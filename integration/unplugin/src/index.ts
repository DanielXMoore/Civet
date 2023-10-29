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
import ts from 'typescript';
import * as tsvfs from '@typescript/vfs';
import type { UserConfig } from 'vite';

const formatHost: ts.FormatDiagnosticsHost = {
  getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
  getNewLine: () => ts.sys.newLine,
  getCanonicalFileName: ts.sys.useCaseSensitiveFileNames
    ? f => f
    : f => f.toLowerCase(),
};

export type PluginOptions = {
  outputExtension?: string;
  transformOutput?: (
    code: string,
    id: string
  ) => TransformResult | Promise<TransformResult>;
} & ( // Eliminates the possibility of having both `dts` and `js` set to `true`
  | {
      dts?: false;
      typecheck?: false;
      js?: false | true;
    }
  | {
      dts?: true;
      typecheck?: true;
      js?: false;
    }
);

const isCivet = (id: string) => /\.civet$/.test(id);
const isCivetTranspiled = (id: string) =>
  /\.civet\.(m?)(j|t)s(x?)(\?transform)?$/.test(id);
const isCivetTranspiledTS = (id: string) => /\.civet\.(m?)ts(x?)$/.test(id);

const civetUnplugin = createUnplugin((options: PluginOptions = {}) => {
  const requiresTS = options.dts || options.typecheck;
  const outExt = options.outputExtension ?? (requiresTS ? '.tsx' : '.jsx');

  let fsMap: Map<string, string> = new Map();
  const sourceMaps = new Map<string, SourceMap>();
  let compilerOptions: any;
  let rootDir: string | undefined;

  return {
    name: 'unplugin-civet',
    enforce: 'pre',
    async buildStart() {
      if (requiresTS) {
        const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists);

        if (!configPath) {
          throw new Error("Could not find 'tsconfig.json'");
        }

        const { config, error } = ts.readConfigFile(
          configPath,
          ts.sys.readFile
        );

        if (error) {
          console.error(ts.formatDiagnostic(error, formatHost));
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
    buildEnd() {
      if (requiresTS) {
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

        const diagnostics: ts.Diagnostic[] = ts
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
            ts.formatDiagnosticsWithColorAndContext(diagnostics, formatHost)
          );
        }

        if (options.dts) {
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

      const absolutePath =
        rootDir != null && path.isAbsolute(id)
          ? path.join(rootDir, id)
          : path.resolve(path.dirname(importer ?? ''), id);

      const relativeId = path.relative(process.cwd(), absolutePath);

      if (isCivetTranspiled(id)) return relativeId.replace(/\?transform$/, '');

      const relativePath = relativeId + outExt;

      return relativePath;
    },
    loadInclude(id) {
      return isCivetTranspiled(id);
    },
    async load(id) {
      if (!isCivetTranspiled(id)) return null;

      const filename = path.resolve(process.cwd(), id.slice(0, -outExt.length));
      const code = await fs.promises.readFile(filename, 'utf-8');

      // Ideally this should have been done in a `transform` step
      // but for some reason, webpack seems to be running them in the order
      // of `resolveId` -> `loadInclude` -> `transform` -> `load`
      // so we have to do transformation here instead
      const compiledJS = civet.compile(code, {
        filename: id,
        js: true,
        sourceMap: true,
      });

      const jsonSourceMap = compiledJS.sourceMap.json(
        path.basename(id.replace(/\.[jt]sx$/, '')),
        path.basename(id)
      );
      let transformed: TransformResult = {
        code: compiledJS.code,
        map: jsonSourceMap as UnpluginSourceMap,
      };

      if (options.transformOutput) {
        transformed = await options.transformOutput(transformed.code, id);
      }

      if (requiresTS) {
        const compiledTS = civet.compile(code, {
          filename: id,
          js: false,
          sourceMap: true,
        });
        sourceMaps.set(path.resolve(process.cwd(), id), compiledTS.sourceMap);

        const resolved = path.resolve(process.cwd(), id);
        fsMap.set(resolved, compiledTS.code);
        // Vite and Rollup normalize filenames to use `/` instead of `\`.
        // We give the TypeScript VFS both versions just in case.
        const slash = resolved.replace(/\\/g, '/');
        if (resolved !== slash) fsMap.set(slash, compiledTS.code);
      }

      return transformed;
    },
    vite: {
      config(config: UserConfig, { command }: { command: string }) {
        rootDir = path.resolve(process.cwd(), config.root ?? '');
        // Ensure esbuild runs on .civet files
        if (command === 'build') {
          return {
            esbuild: {
              include: [/\.civet$/],
              loader: 'tsx',
            },
          };
        }

        return null;
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
