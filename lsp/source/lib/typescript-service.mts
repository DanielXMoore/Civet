import assert from "assert"
import fs from "fs"
import path from "path";

import Civet, { SourceMap } from "@danielx/civet"
import ts, {
  CompilerHost,
  CompilerOptions,
  LanguageServiceHost,
} from "typescript"

const {
  ScriptSnapshot,
  createCompilerHost,
  createDocumentRegistry,
  createLanguageService,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} = ts

import { TextDocument } from "vscode-languageserver-textdocument";
import { fileURLToPath } from "url";

// ts doesn't have this key in the type
interface ResolvedModuleWithFailedLookupLocations extends ts.ResolvedModuleWithFailedLookupLocations {
  failedLookupLocations: string[];
}

interface FileMeta {
  sourcemapLines: SourceMap["data"]["lines"]
  transpiledDoc: TextDocument
}

interface Host extends LanguageServiceHost {
  getMeta(path: string): FileMeta | undefined
  addDocument(doc: TextDocument): void
}

const civetExtension = /\.civet$/

function TSHost(compilationSettings: CompilerOptions, baseHost: CompilerHost): Host {
  const { rootDir } = compilationSettings
  assert(rootDir, "Most have root dir for now")

  const scriptFileNames: Set<string> = new Set([])
  const fileMetaData: Map<string, FileMeta> = new Map;

  const documents: Set<TextDocument> = new Set();
  const pathMap: Map<string, TextDocument> = new Map

  let projectVersion = 0;

  const resolutionCache: ts.ModuleResolutionCache = ts.createModuleResolutionCache(rootDir, (fileName) => fileName, compilationSettings);

  let self: Host;

  return self = Object.assign({}, baseHost, {
    getModuleResolutionCache: () => resolutionCache,
    /**
     * This is how TypeScript resolves module names when it finds things like `import { foo } from "bar"`.
     * We need to modify this to make sure that TypeScript can resolve our `.civet` files.
     * We default to the original behavior, but if it is a `.civet` file, we resolve it with the `.civet` extension.
     * This requires the `allowNonTsExtensions` option and `allowJs` options to be set to true.
     * Then TypeScript will call `getScriptSnapshot` with the `.civet` extension and we can do the transpilation there.
     */
    resolveModuleNames(moduleNames: string[], containingFile: string, _reusedNames: string[] | undefined, _redirectedReference: ts.ResolvedProjectReference | undefined, compilerOptions: CompilerOptions, _containingSourceFile?: ts.SourceFile) {
      console.log("resolveModuleNames", moduleNames, containingFile)

      return moduleNames.map(name => {
        // Try to resolve the module using the standard TypeScript logic
        let resolution = ts.resolveModuleName(name, containingFile, compilerOptions, self, resolutionCache) as ResolvedModuleWithFailedLookupLocations
        let { resolvedModule } = resolution
        if (resolvedModule) {
          console.log("resolved", resolvedModule.resolvedFileName)
          return resolvedModule
        }

        // TODO: account for module resolution configuration options 'node', etc.

        if (name.match(civetExtension)) {
          const resolved = path.resolve(path.dirname(containingFile), name)
          if (sys.fileExists(resolved)) {
            // TODO: add to resolution cache?
            return {
              resolvedFileName: resolved,
              extension: ".civet",
              isExternalLibraryImport: false,
            }
          }
        }

        console.log("failed to resolve", name, containingFile)//, resolution.failedLookupLocations)
        return undefined
      });
    },
    readDirectory(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[] {
      // Add .civet extension to the list of extensions
      extensions = extensions?.concat([".civet"])
      console.log("readDirectory", path, extensions, exclude, include, depth)
      return sys.readDirectory(path, extensions, exclude, include, depth)
    },
    /**
     * Add a VSCode TextDocument source file.
     * The VSCode document should keep track of its contents and version.
     * I think we just need to update the project version on change events.
     */
    addDocument(doc: TextDocument) {
      const path = fileURLToPath(doc.uri)
      if (scriptFileNames.has(path)) {
        // We already have the document but it may have updated
        projectVersion++
        return
      }

      documents.add(doc)
      scriptFileNames.add(path)
      pathMap.set(path, doc)
      projectVersion++
    },
    getMeta(path: string) {
      return fileMetaData.get(path)
    },
    getProjectVersion() {
      return projectVersion.toString();
    },
    getCompilationSettings() {
      return compilationSettings;
    },
    // TODO: Handle source documents and document updates
    getScriptSnapshot(path: string) {
      console.log("getScriptSnapshot", path)
      let source;
      // Get the source from the open VSCode document if it exists
      const doc = pathMap.get(path)
      if (doc) {
        source = doc.getText()
      } else {
        // Otherwise get it from the file system
        if (!fs.existsSync(path)) {
          console.warn("no file found at path", path)
          return undefined;
        }
        source = fs.readFileSync(path, "utf8")
      }

      // Compile .civet files to TS
      // cache sourcemap and transpiled code
      if (path.match(civetExtension)) {
        try {
          const { code, sourceMap } = Civet.compile(source, {
            filename: path,
            sourceMap: true
          })

          createOrUpdateMeta(path, sourceMap.data.lines, code)

          return ScriptSnapshot.fromString(code)
        } catch (e) {
          console.error(e)
          return
        }
      }

      // Return non-civet files as normal
      return ScriptSnapshot.fromString(source)
    },
    getScriptVersion(path: string) {
      return pathMap.get(path)?.version.toString() || "0"
    },
    getScriptFileNames() {
      return Array.from(scriptFileNames)
    },
    writeFile(fileName: string, content: string) {
      console.log("write", fileName, content)
    }
  });

  function createOrUpdateMeta(path: string, sourcemapLines: SourceMap["data"]["lines"], code: string) {
    let meta = fileMetaData.get(path)

    if (!meta) {
      const transpiledDoc = TextDocument.create(path.replace(civetExtension, ".ts"), "typescript", 0, code)

      meta = {
        sourcemapLines,
        transpiledDoc,
      }

      fileMetaData.set(path, meta)
    } else {
      meta.sourcemapLines = sourcemapLines
      const doc = meta.transpiledDoc
      TextDocument.update(doc, [{ text: code }], doc.version + 1)
    }
  }
}

function TSService(projectPath = "./") {
  projectPath = fileURLToPath(projectPath)
  const tsConfigPath = `${projectPath}tsconfig.json`
  const { config } = readConfigFile(tsConfigPath, sys.readFile)

  const existingOptions = {
    rootDir: projectPath,
    // This is necessary to load .civet files
    allowNonTsExtensions: true,
    // Better described as "allow non-ts, non-json extensions"
    allowJs: true,
  }

  const parsedConfig = parseJsonConfigFileContent(
    config,
    sys,
    projectPath,
    existingOptions,
    tsConfigPath,
    undefined,
    [{
      extension: "civet",
      isMixedContent: false,
      // Note: in order for parsed config to include *.ext files, scriptKind must be set to Deferred.
      // See: https://github.com/microsoft/TypeScript/blob/2106b07f22d6d8f2affe34b9869767fa5bc7a4d9/src/compiler/utilities.ts#L6356
      scriptKind: ts.ScriptKind.Deferred
    }]
  )

  // @ts-ignore
  const baseHost = createCompilerHost(parsedConfig)
  const host = TSHost(parsedConfig.options, baseHost)

  const documentRegistry = createDocumentRegistry(true, projectPath)
  const service = createLanguageService(host, documentRegistry);

  console.log("parsed", parsedConfig)

  // const program = service.getProgram();
  // console.log(program?.getSourceFile("source/a.civet"));
  // for (let i = 0; i < 25; i++)
  //   console.log(i, service.getQuickInfoAtPosition("source/a.civet", i))

  return Object.assign(service, {
    host
  })
}

export default TSService
