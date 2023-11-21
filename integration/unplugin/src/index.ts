import {
  TransformResult,
  createUnplugin,
  SourceMapCompact as UnpluginSourceMap,
} from 'unplugin';
import civet, { SourceMap } from '@danielx/civet';
import {
  remapRange,
  flattenDiagnosticMessageText,
  // @ts-ignore
  // using ts-ignore because the version of @danielx/civet typescript is checking against
  // is the one published to npm, not the one in the repo
} from '@danielx/civet/ts-diagnostic';
import * as fs from 'fs';
import path from 'path';
import type { FormatDiagnosticsHost, Diagnostic, System } from 'typescript';
import * as tsvfs from '@typescript/vfs';
import type { UserConfig } from 'vite';
import os from 'os';

export type PluginOptions = {
  outputExtension?: string;
  transformOutput?: (
    code: string,
    id: string
  ) => TransformResult | Promise<TransformResult>;
  emitDeclaration?: boolean;
  typecheck?: boolean;
  ts?: 'civet' | 'esbuild' | 'tsc' | 'preserve';
};

const isCivet = (id: string) => /\.civet([?#].*)?$/.test(id);
const isCivetTranspiled = (id: string) => /\.civet\.[jt]sx([?#].*)?$/.test(id);
const postfixRE = /[?#].*$/s;
const isWindows = os.platform() === 'win32';
const windowsSlashRE = /\\/g;

// removes query string, hash and tsx/jsx extension
function cleanCivetId(id: string): string {
  return id.replace(postfixRE, '').replace(/\.[jt]sx$/, '');
}

function tryStatSync(file: string): fs.Stats | undefined {
  try {
    // The "throwIfNoEntry" is a performance optimization for cases where the file does not exist
    return fs.statSync(file, { throwIfNoEntry: false });
  } catch {
    return undefined;
  }
}

export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/');
}

function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}

function tryFsResolve(file: string): string | undefined {
  const fileStat = tryStatSync(file);
  if (fileStat?.isFile()) return normalizePath(file);

  return undefined;
}

function resolveAbsolutePath(rootDir: string, id: string) {
  const resolved = tryFsResolve(path.join(rootDir, id));

  if (!resolved) return tryFsResolve(id);

  return resolved;
}

const civetUnplugin = createUnplugin((options: PluginOptions = {}) => {
  const transformTS = options.emitDeclaration || options.typecheck;
  const outExt =
    options.outputExtension ?? (options.ts === 'preserve' ? '.tsx' : '.jsx');

  let fsMap: Map<string, string> = new Map();
  const sourceMaps = new Map<string, SourceMap>();
  let compilerOptions: any;
  let rootDir = process.cwd();

  const tsPromise =
    transformTS || options.ts === 'tsc'
      ? import('typescript').then(m => m.default)
      : null;
  const getTS = () => tsPromise!;
  const getFormatHost = (sys: System): FormatDiagnosticsHost => {
    return {
      getCurrentDirectory: () => sys.getCurrentDirectory(),
      getNewLine: () => sys.newLine,
      getCanonicalFileName: sys.useCaseSensitiveFileNames
        ? f => f
        : f => f.toLowerCase(),
    };
  };

  return {
    name: 'unplugin-civet',
    enforce: 'pre',
    async buildStart() {
      if (transformTS || options.ts === 'tsc') {
        const ts = await getTS();

        const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists);

        if (!configPath) {
          throw new Error("Could not find 'tsconfig.json'");
        }

        const { config, error } = ts.readConfigFile(
          configPath,
          ts.sys.readFile
        );

        if (error) {
          console.error(ts.formatDiagnostic(error, getFormatHost(ts.sys)));
          throw error;
        }

        const configContents = ts.parseJsonConfigFileContent(
          config,
          ts.sys,
          process.cwd()
        );

        compilerOptions = {
          ...configContents.options,
          target: ts.ScriptTarget.ESNext,
        };
        fsMap = new Map();
      }
    },
    async buildEnd() {
      if (transformTS) {
        const ts = await tsPromise!;

        const system = tsvfs.createFSBackedSystem(fsMap, process.cwd(), ts);
        const host = tsvfs.createVirtualCompilerHost(
          system,
          compilerOptions,
          ts
        );
        const program = ts.createProgram({
          rootNames: [...fsMap.keys()],
          options: compilerOptions,
          host: host.compilerHost,
        });

        const diagnostics: Diagnostic[] = ts
          .getPreEmitDiagnostics(program)
          .map(diagnostic => {
            const file = diagnostic.file;
            if (!file) return diagnostic;

            const sourceMap = sourceMaps.get(file.fileName);
            if (!sourceMap) return diagnostic;

            const sourcemapLines = sourceMap.data.lines;
            const range = remapRange(
              {
                start: diagnostic.start || 0,
                end: (diagnostic.start || 0) + (diagnostic.length || 1),
              },
              sourcemapLines
            );

            return {
              ...diagnostic,
              messageText: flattenDiagnosticMessageText(diagnostic.messageText),
              length: diagnostic.length,
              start: range.start,
            };
          });

        if (diagnostics.length > 0) {
          console.error(
            ts.formatDiagnosticsWithColorAndContext(
              diagnostics,
              getFormatHost(ts.sys)
            )
          );
        }

        if (options.emitDeclaration) {
          for (const file of fsMap.keys()) {
            const sourceFile = program.getSourceFile(file)!;
            program.emit(
              sourceFile,
              async (filePath, content) => {
                const dir = path.dirname(filePath);
                await fs.promises.mkdir(dir, { recursive: true });

                const pathFromDistDir = path.relative(
                  compilerOptions.outDir ?? process.cwd(),
                  filePath
                );

                this.emitFile({
                  source: content,
                  fileName: pathFromDistDir,
                  type: 'asset',
                });
              },
              undefined,
              true
            );
          }
        }
      }
    },
    resolveId(id, importer) {
      if (/\0/.test(id)) return null;
      if (!isCivet(id) && !isCivetTranspiled(id)) return null;

      id = cleanCivetId(id);
      const absolutePath = path.isAbsolute(id)
        ? resolveAbsolutePath(rootDir, id)
        : path.resolve(path.dirname(importer ?? ''), id);
      if (!absolutePath) return null;

      const relativeId = path.relative(process.cwd(), absolutePath);

      const relativePath = relativeId + outExt;
      return relativePath;
    },
    loadInclude(id) {
      return isCivetTranspiled(id);
    },
    async load(id) {
      if (!isCivetTranspiled(id)) return null;

      const filename = path.resolve(process.cwd(), id.slice(0, -outExt.length));
      const rawCivetSource = await fs.promises.readFile(filename, 'utf-8');
      this.addWatchFile(filename);

      let compiled: {
        code: string;
        sourceMap: SourceMap | string;
      } = undefined!;

      if (options.ts === 'civet' && !transformTS) {
        compiled = civet.compile(rawCivetSource, {
          filename: id,
          js: true,
          sourceMap: true,
        });
      } else {
        const compiledTS = civet.compile(rawCivetSource, {
          filename: id,
          js: false,
          sourceMap: true,
        });

        sourceMaps.set(
          path.resolve(process.cwd(), id),
          compiledTS.sourceMap as SourceMap
        );

        if (transformTS) {
          const resolved = path.resolve(process.cwd(), id);
          fsMap.set(resolved, compiledTS.code);
          // Vite and Rollup normalize filenames to use `/` instead of `\`.
          // We give the TypeScript VFS both versions just in case.
          const slashed = slash(resolved);
          if (resolved !== slashed) fsMap.set(slashed, rawCivetSource);
        }

        switch (options.ts) {
          case 'esbuild': {
            const esbuildTransform = (await import('esbuild')).transform;
            const result = await esbuildTransform(compiledTS.code, {
              loader: 'tsx',
              sourcefile: id,
              sourcemap: 'external',
            });

            compiled = { code: result.code, sourceMap: result.map };
            break;
          }
          case 'tsc': {
            const tsTranspile = (await getTS()).transpileModule;
            const result = tsTranspile(compiledTS.code, { compilerOptions });

            compiled = {
              code: result.outputText,
              sourceMap: result.sourceMapText ?? '',
            };
            break;
          }
          case 'preserve': {
            compiled = compiledTS;
            break;
          }
          case 'civet':
          default: {
            compiled = civet.compile(compiledTS.code, {
              filename: id,
              js: true,
              sourceMap: true,
            });
          }
          case undefined: {
            console.log(
              'WARNING: You are using the default mode for `options.ts` which is `civet`. This mode does not support all TS features. If this is intentional, you should explicitly set `options.ts` to `civet`, or choose a different mode.'
            );
            break;
          }
        }
      }

      const jsonSourceMap =
        typeof compiled.sourceMap == 'string'
          ? compiled.sourceMap
          : compiled.sourceMap.json(
              path.basename(id.replace(/\.[jt]sx$/, '')),
              path.basename(id)
            );

      let transformed: TransformResult = {
        code: compiled.code,
        map: jsonSourceMap as UnpluginSourceMap,
      };

      if (options.transformOutput)
        transformed = await options.transformOutput(transformed.code, id);

      return transformed;
    },
    vite: {
      config(config: UserConfig) {
        rootDir = path.resolve(process.cwd(), config.root ?? '');
      },
      async transformIndexHtml(html) {
        return html.replace(/<!--[^]*?-->|<[^<>]*>/g, tag =>
          tag.replace(/<\s*script\b[^<>]*>/gi, script =>
            // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
            script.replace(
              /([:_\p{ID_Start}][:\p{ID_Continue}]*)(\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]*))?/gu,
              (attr, name, value) =>
                name.toLowerCase() === 'src' && value
                  ? attr.replace(
                      /(\.civet)(['"]?)$/,
                      (_, extension, endQuote) =>
                        `${extension}${outExt}?transform${endQuote}`
                    )
                  : attr
            )
          )
        );
      },
    },
  };
});

export default civetUnplugin;
