import {
  TransformResult,
  createUnplugin,
  SourceMapCompact as UnpluginSourceMap,
} from 'unplugin';
import civet, { SourceMap } from '@danielx/civet';
import {
  remapRange,
  flattenDiagnosticMessageText,
  rangeFromTextSpan,
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
      typeCheck?: false;
      js?: false | true;
    }
  | {
      dts?: true;
      typeCheck?: true;
      js?: false;
    }
);

const isCivet = (id: string) => /\.civet$/.test(id);
const isCivetTranspiled = (id: string) => /\.civet\.(m?)(j|t)s(x?)$/.test(id);

const civetUnplugin = createUnplugin((options: PluginOptions = {}) => {
  if ((options.dts || options.typeCheck) && options.js) {
    throw new Error("Can't have both `dts` and `js` be set to `true`.");
  }

  const transpileToJS = options.js ?? !(options.dts || options.typeCheck);
  const outExt = options.outputExtension ?? (transpileToJS ? '.jsx' : '.tsx');

  let fsMap: Map<string, string> = new Map();
  const sourceMaps = new Map<string, SourceMap>();
  let compilerOptions: any;

  return {
    name: 'unplugin-civet',
    enforce: 'pre',
    async buildStart() {
      if (options.dts || options.typeCheck) {
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
      if (options.dts || options.typeCheck) {
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

        const diagnostics: ts.Diagnostic[] = program
          .getGlobalDiagnostics()
          .map(diagnostic => {
            const file = diagnostic.file;
            if (!file) return diagnostic;

            const sourceMap = sourceMaps.get(file.fileName);
            if (!sourceMap) return diagnostic;

            const sourcemapLines = sourceMap.data.lines;
            const range = remapRange(
              rangeFromTextSpan(
                {
                  start: diagnostic.start || 0,
                  length: diagnostic.length ?? 1,
                },
                document
              ),
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
                if (!pathExists(dir)) {
                  await fs.promises.mkdir(dir, { recursive: true });
                }

                this.emitFile({
                  source: content,
                  fileName: path.relative(process.cwd(), filePath),
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

      const relativeId = path.relative(
        process.cwd(),
        path.resolve(path.dirname(importer ?? ''), id)
      );
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
        path.basename(id.replace(/\.tsx$/, '')),
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
    transform(code, id) {
      if (!/\.civet\.tsx?$/.test(id)) return null;

      if (options.dts) {
        fsMap.set(path.resolve(process.cwd(), id), code);
      }

      return null;
    },
    vite: {
      config(_config, { command }) {
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

async function pathExists(path: string) {
  try {
    await fs.promises.access(path);
    return true;
  } catch {
    return false;
  }
}

export default civetUnplugin;
