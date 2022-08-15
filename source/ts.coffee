# Experimenting with transpiling to TS

ts = require "typescript"

DefaultCompilerOptions =
  allowNonTsExtensions: true
  allowJs: true
  target: ts.ScriptTarget.Latest
  moduleResolution: ts.ModuleResolutionKind.NodeJs
  module: ts.ModuleKind.CommonJS
  allowSyntheticDefaultImports: true
  experimentalDecorators: true

fileCache = {}

#
###*
@return ts.LanguageServiceHost
###
createCompilerHost = (options, moduleSearchLocations) ->
  ###*
  @param fileName {string}
  ###
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

    for moduleName from moduleNames
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
        for location from moduleSearchLocations
          modulePath = path.join(location, moduleName + ".d.ts")
          if fileExists(modulePath)
            resolvedModules.push({ resolvedFileName: modulePath })

    return resolvedModules

  return {
    getCompilationSettings: ->
      options
    getSourceFile
    getDefaultLibFileName: ->
      "lib.d.ts"
    writeFile: (fileName, content) ->
      fileCache[fileName] = content
    getCurrentDirectory: ->
      ts.sys.getCurrentDirectory()
    getDirectories: (path) ->
      ts.sys.getDirectories(path)
    getCanonicalFileName: (fileName) ->
      if ts.sys.useCaseSensitiveFileNames
        fileName
      else
        fileName.toLowerCase()
    getNewLine: ->
      ts.sys.newLine
    getScriptFileNames: ->
      Object.keys(fileCache)
    getScriptKind: (fileName) ->
      ts.ScriptKind.TS
    getScriptSnapshot: (fileName) ->
      content = fileCache[fileName]
      if content?
        ts.ScriptSnapshot.fromString(content)
      else
        return undefined
    getScriptVersion: (fileName) ->
      ""
    useCaseSensitiveFileNames: ->
      ts.sys.useCaseSensitiveFileNames
    fileExists
    readFile
    resolveModuleNames
  }

host = createCompilerHost(DefaultCompilerOptions, )
ts.createLanguageService(host)
