{testCase} = require "./helper"

describe "real life examples", ->
  testCase """
    lsp prototype
    ---
    "use coffee-compat"
    # Experimenting with transpiling to TS

    import ts from "typescript"

    const DefaultCompilerOptions =
      allowNonTsExtensions: true
      allowJs: true
      target: ts.ScriptTarget.Latest
      moduleResolution: ts.ModuleResolutionKind.NodeJs
      module: ts.ModuleKind.CommonJS
      allowSyntheticDefaultImports: true
      experimentalDecorators: true

    const fileCache = {}

    const createCompilerHost = (options, moduleSearchLocations) ->
      fileExists = (fileName) ->
        fileCache[fileName]?

      readFile = (fileName) ->
        fileCache[fileName]

      getSourceFile = (fileName, languageVersion, onError) ->
        sourceText = ts.sys.readFile(fileName)

        if sourceText != undefined
          ts.createSourceFile(fileName, sourceText, languageVersion)
        else
          undefined

      resolveModuleNames = (moduleNames, containingFile) ->
        resolvedModules = []

        for moduleName of moduleNames
          # try to use standard resolution
          result = ts.resolveModuleName moduleName, containingFile, options, {
            fileExists,
            readFile
          }

          if result.resolvedModule
            resolvedModules.push(result.resolvedModule);
          else
            # check fallback locations, for simplicity assume that module at location
            # should be represented by '.d.ts' file
            for location of moduleSearchLocations
              modulePath = path.join(location, moduleName + ".d.ts")
              if fileExists(modulePath)
                resolvedModules.push({ resolvedFileName: modulePath })

        return resolvedModules
    ---
    "use coffee-compat"
    // Experimenting with transpiling to TS

    import ts from "typescript";

    const DefaultCompilerOptions = {
      allowNonTsExtensions: true,
      allowJs: true,
      target: ts.ScriptTarget.Latest,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      module: ts.ModuleKind.CommonJS,
      allowSyntheticDefaultImports: true,
      experimentalDecorators: true,
    };

    const fileCache = {};

    const createCompilerHost = function(options, moduleSearchLocations) {
      fileExists = function(fileName) {
        ((fileCache[fileName]) != null);
      };

      readFile = function(fileName) {
        fileCache[fileName];
      };

      getSourceFile = function(fileName, languageVersion, onError) {
        sourceText = ts.sys.readFile(fileName);

        if (sourceText != undefined) {
          ts.createSourceFile(fileName, sourceText, languageVersion);
        }
        else {
          undefined;
        };
      };

      resolveModuleNames = function(moduleNames, containingFile) {
        resolvedModules = [];

        for (moduleName of moduleNames) {
          // try to use standard resolution
          result = ts.resolveModuleName(moduleName, containingFile, options, {
            fileExists,
            readFile,
          });

          if (result.resolvedModule) {
            resolvedModules.push(result.resolvedModule);
          }
          else {
            // check fallback locations, for simplicity assume that module at location
            // should be represented by '.d.ts' file
            for (location of moduleSearchLocations) {
              modulePath = path.join(location, moduleName + ".d.ts");
              if (fileExists(modulePath)) {
                resolvedModules.push({ resolvedFileName: modulePath });
              };
            };
          };
        };

        return resolvedModules;
      };
    };
  """
