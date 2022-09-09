import Civet, { SourceMap } from "@danielx/civet"
import {
  CompilerHost,
  CompilerOptions,
  LanguageServiceHost,
  ScriptKind,
  ScriptSnapshot,
  createCompilerHost,
  createLanguageService,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} from "typescript"
import fs from "fs"

interface Host extends LanguageServiceHost {
  addPath(path: string): void;
  getSourcemap(path: string): SourceMap["data"]["lines"] | undefined
}

function TSHost(compilationSettings: CompilerOptions, baseHost: CompilerHost): Host {
  // TODO: Actual files
  const scriptFileNames = new Set(["source/lsp.civet"])
  const fileMetaData: Map<string, {
    version: number
    sourcemapLines?: SourceMap["data"]["lines"]
  }> = new Map;

  let projectVersion = 0;

  return Object.assign(baseHost, {
    addPath(path: string) {
      if (scriptFileNames.has(path)) return

      scriptFileNames.add(path)
      fileMetaData.set(path, { version: 0 })
      projectVersion++
    },
    getSourcemap(fileName: string) {
      return fileMetaData.get(fileName)?.sourcemapLines
    },
    getProjectVersion() {
      return projectVersion.toString();
    },
    getCompilationSettings() {
      return compilationSettings;
    },
    getScriptSnapshot(fileName: string) {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      const src = fs.readFileSync(fileName, "utf8")

      // Compile .civet files to TS
      if (fileName.match(/\.civet$/)) {
        try {
          const { code, sourceMap } = Civet.compile(src, {
            filename: fileName,
            sourceMap: true
          })

          const meta = fileMetaData.get(fileName)
          meta!.sourcemapLines = sourceMap.data.lines

          return ScriptSnapshot.fromString(code)
        } catch (e) {
          console.error(e)
          return
        }
      }

      // Return non-civet files as normal
      return ScriptSnapshot.fromString(src)
    },
    getScriptVersion(path: string) {
      return fileMetaData.get(path)?.version.toString() || "0"
    },
    getScriptFileNames() {
      return Array.from(scriptFileNames)
    },
    writeFile(fileName: string, content: string) {
      console.log("write", fileName, content)
    }
  });
}

function TSService(projectPath = "./") {
  debugger
  const tsConfigPath = "tsconfig.json"
  const { config } = readConfigFile(tsConfigPath, sys.readFile)

  const existingOptions = {}

  const config2 = parseJsonConfigFileContent(
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
      scriptKind: ScriptKind.Deferred
    }]
  )

  const defaultCompilerOptions: CompilerOptions = {
    allowNonTsExtensions: true,
  }

  Object.assign(config2.options, defaultCompilerOptions);

  const baseHost = createCompilerHost(config2.options)
  const host = TSHost(config2.options, baseHost)

  host.getScriptVersion
  const service = createLanguageService(host);

  console.log(config2)

  // const program = service.getProgram();
  // console.log(program?.getSourceFile("source/a.civet"));
  // for (let i = 0; i < 25; i++)
  //   console.log(i, service.getQuickInfoAtPosition("source/a.civet", i))

  return Object.assign(service, {
    host
  })
}

export = TSService
