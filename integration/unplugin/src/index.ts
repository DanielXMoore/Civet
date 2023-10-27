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
const isCivetTranspiled = (id: string) => /\.civet\.(m?)(j|t)s(x?)$/.test(id);
const isCivetTranspiledTS = (id: string) => /\.civet\.(m?)ts(x?)$/.test(id);

const civetUnplugin = createUnplugin((options: PluginOptions = {}) => {
  if (options.dts && options.js) {
    throw new Error("Can't have both `dts` and `js` be set to `true`.");
  }

  if (options.typecheck && options.js) {
    throw new Error("Can't have both `typecheck` and `js` be set to `true`.");
  }

  const transpileToJS = options.js ?? false;
  // When Civet's js option is better, we could consider a different default:
  //const transpileToJS = options.js ?? !(options.dts || options.typecheck);
  const outExt = options.outputExtension ?? (transpileToJS ? '.jsx' : '.tsx');

  let fsMap: Map<string, string> = new Map();
  const sourceMaps = new Map<string, SourceMap>();
  let compilerOptions: any;
  let rootDir: string | undefined;

  return {
    name: 'unplugin-civet',
    enforce: 'pre',
    async buildStart() {
      if (options.dts || options.typecheck) {
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
      if (options.dts || options.typecheck) {
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
      if (!isCivet(id)) return null;

      const absolutePath = rootDir != null && path.isAbsolute(id)
        ? path.join(rootDir, id)
        : path.resolve(path.dirname(importer ?? ''), id);

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
      const code = await fs.promises.readFile(filename, 'utf-8');

      // Ideally this should have been done in a `transform` step
      // but for some reason, webpack seems to be running them in the order
      // of `resolveId` -> `loadInclude` -> `transform` -> `load`
      // so we have to do transformation here instead
      const compiled = civet.compile(code, {
        // inlineMap: true,
        filename: id,
        js: transpileToJS,
        sourceMap: true,
      });

      sourceMaps.set(path.resolve(process.cwd(), id), compiled.sourceMap);

      const jsonSourceMap = compiled.sourceMap.json(
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
    transformInclude(id) {
      return isCivetTranspiledTS(id);
    },
    transform(code, id) {
      if (!isCivetTranspiledTS(id)) return null;

      if (options.dts || options.typecheck) {
        const resolved = path.resolve(process.cwd(), id);
        fsMap.set(resolved, code);
        // Vite and Rollup normalize filenames to use `/` instead of `\`.
        // We give the TypeScript VFS both versions just in case.
        const slash = resolved.replace(/\\/g, '/');
        if (resolved !== slash) fsMap.set(slash, code);
      }

      return null;
    },
    vite: {
      config(config, { command }) {
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
    },
  };
});

export default civetUnplugin;
