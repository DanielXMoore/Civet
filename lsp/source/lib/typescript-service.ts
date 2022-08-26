import Civet from "@danielx/civet"
import ts, { CompilerOptions, LanguageServiceHost } from "typescript"
import fs from "fs"

const {
  ScriptKind,
  ScriptSnapshot,
  createCompilerHost,
  createLanguageService,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} = ts

const scriptFileNames: Set<string> = new Set

function TSService(projectPath = "./") {
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

  const host: LanguageServiceHost = Object.assign(baseHost, {
    getCompilationSettings() {
      return config2.options;
    },
    getScriptSnapshot(fileName: string) {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      const src = fs.readFileSync(fileName, "utf8")

      // Compile .civet files to TS
      if (fileName.match(/\.civet$/)) {
        const tsSrc = Civet.compile(src)
        return ScriptSnapshot.fromString(tsSrc)
      }

      return ScriptSnapshot.fromString(src)
    },
    getScriptVersion() {
      return "0"
    },
    getScriptFileNames() {
      return ["source/lsp.civet"]
    },
    writeFile(fileName: string, content: string) {
      console.log("write", fileName, content)
    }
  });

  const service = createLanguageService(host);

  console.log(config2)
  console.log("SourceFiles", service.getProgram()?.getSourceFiles())

  // const program = service.getProgram();
  // console.log(program?.getSourceFile("source/a.civet"));
  // for (let i = 0; i < 25; i++)
  //   console.log(i, service.getQuickInfoAtPosition("source/a.civet", i))

  return service
}

export default TSService
