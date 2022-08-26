import assert from "assert"
import ts, { LanguageServiceHost } from "typescript"
import fs from "fs"

describe("ts stuff", function () {
  it("should parse tsconfig", function () {
    assert(true);
    const tsConfigPath = "tsconfig.json"
    const { config } = ts.readConfigFile(tsConfigPath, ts.sys.readFile)

    const currentProjectPath = "./"

    const existingOptions = {}

    const config2 = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      currentProjectPath,
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

    // console.log config, config2

    const host: LanguageServiceHost = Object.assign(ts.createCompilerHost(config2.options), {
      getCompilationSettings() {
        return config2.options;
      },
      getScriptSnapshot(fileName: string) {
        if (!fs.existsSync(fileName)) {
          return undefined;
        }
        return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString())
      },
      getScriptVersion() {
        return "0"
      },
      getScriptFileNames() {
        return ["source/a.civet", "source/a.ts"]
      },
      writeFile(fileName: string, content: string) {
        console.log("write", fileName, content)
      }
    });

    host.writeFile

    const service = ts.createLanguageService(host);

    console.log(service.getQuickInfoAtPosition("source/a.ts", 0))

  });
});
