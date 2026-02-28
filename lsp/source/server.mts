import {
  createConnection,
  TextDocuments,
  Diagnostic,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  TextDocumentSyncKind,
  InitializeResult,
  MarkupKind,
  TextDocumentIdentifier,
  DocumentSymbol,
  CompletionItem,
  CompletionItemKind,
  CompletionItemTag,
  Location,
  DiagnosticSeverity,
  TextEdit,
} from 'vscode-languageserver/node';

import {
  TextDocument,
  type Position
} from 'vscode-languageserver-textdocument';
import TSService from './lib/typescript-service.mjs';
import * as Previewer from "./lib/previewer.mjs";
import { convertNavTree, forwardMap, getCompletionItemKind, convertDiagnostic, remapPosition, parseKindModifier, logTiming, WithResolvers, withResolvers, type SourcemapLines } from './lib/util.mjs';
import { asPlainTextWithLinks, tagsToMarkdown } from './lib/textRendering.mjs';
import assert from "assert"
import path from "node:path"
import ts, {
  sys as tsSys,
  displayPartsToString,
  GetCompletionsAtPositionOptions,
  findConfigFile,
  ScriptElementKindModifier,
  SemicolonPreference,
} from 'typescript';
import { URI } from 'vscode-uri';
import { setTimeout } from 'timers/promises';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all)
const logger = connection.console;

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
// let hasDiagnosticRelatedInformationCapability = false;
// comment out unused variable

// Mapping from abs file path -> path of nearest applicable project path (tsconfig.json base)
const sourcePathToProjectPathMap = new Map<string, string>()

// Tracks pending promises for tsserver initialization to safeguard
// against creating multiple tsserver instances for same project path
const projectPathToPendingPromiseMap = new Map<string, Promise<void>>()

// Mapping from project path -> TSService instance operating on that base directory
type ResolvedService = Awaited<ReturnType<typeof TSService>>
const projectPathToServiceMap = new Map<string, ResolvedService>()

let rootUri: string | undefined, rootDir: string | undefined;

const getProjectPathFromSourcePath = (sourcePath: string): string => {
  let projPath = sourcePathToProjectPathMap.get(sourcePath)
  if (projPath) return projPath

  // If we're in a node_modules/foo directory, use that as the project path
  let dirname = sourcePath
  while (dirname.includes("node_modules")) {
    if (path.basename(path.dirname(dirname)) === "node_modules") {
      projPath = URI.file(dirname + "/").toString()
      break
    } else {
      dirname = path.dirname(dirname) // go up one level
    }
  }

  // Otherwise, check for ancestor tsconfig
  if (!projPath) {
    const tsConfigPath = findConfigFile(sourcePath, tsSys.fileExists, 'tsconfig.json')
    if (tsConfigPath) {
      projPath = URI.file(path.dirname(tsConfigPath) + "/").toString()
    }
  }

  // Otherwise, check whether we're inside the root
  if (!projPath) {
    if (rootDir != null && sourcePath.startsWith(rootDir)) {
      projPath = rootUri ?? pathToFileURL(path.dirname(sourcePath) + "/").toString()
    } else {
      projPath = URI.file(path.dirname(sourcePath) + "/").toString()
    }
  }

  sourcePathToProjectPathMap.set(sourcePath, projPath)
  return projPath
}

const ensureServiceForSourcePath = async (sourcePath: string) => {
  const projPath = getProjectPathFromSourcePath(sourcePath)
  await projectPathToPendingPromiseMap.get(projPath)
  let service = projectPathToServiceMap.get(projPath)
  if (service) return service
  logger.log("Spawning language server for project path: " + projPath)
  service = await TSService(projPath, connection.console)
  const initP = service.loadPlugins()
  projectPathToPendingPromiseMap.set(projPath, initP)
  await initP
  projectPathToServiceMap.set(projPath, service)
  projectPathToPendingPromiseMap.delete(projPath)
  return service
}

// TODO Propagate this to an extension setting
const diagnosticsDelay = 16;  // ms delay for primary updated file
const diagnosticsPropagationDelay = 100;  // ms delay for other files

connection.onInitialize(async (params: InitializeParams) => {
  const capabilities = params.capabilities;

  // Does the client support the `workspace/configuration` request?
  // If not, we fall back using global settings.
  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  );
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && !!capabilities.workspace.workspaceFolders
  );
  // hasDiagnosticRelatedInformationCapability = !!(
  //   capabilities.textDocument &&
  //   capabilities.textDocument.publishDiagnostics &&
  //   capabilities.textDocument.publishDiagnostics.relatedInformation
  // );
  // Removed unused diagnostic capability check

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {

        // TS extension's triggerCharacters: ['.', '"', '\'', '/', '@', '<']
        // We'll also respond to space to handle e.g. `import module`
        triggerCharacters: ['.', '"', "'", '/', '@', '<', ' '],

        resolveProvider: true,
      },
      // documentLinkProvider: {
      //   resolveProvider: true
      // },
      documentSymbolProvider: true,
      definitionProvider: true,
      hoverProvider: true,
      referencesProvider: true,
      renameProvider: true,

    }
  };

  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true
      }
    };
  }

  // TODO: currently only using the first workspace folder
  const baseDir = params.workspaceFolders?.[0]?.uri.toString()
  if (!baseDir) {
    logger.log("Warning: No workspace folders")
    rootUri = rootDir = undefined
  } else {
    rootUri = baseDir + "/"
    rootDir = URI.parse(rootUri).fsPath
  }

  logger.log("Init " + rootDir)
  return result;
});

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    connection.client.register(DidChangeConfigurationNotification.type, undefined);
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders(_event => {
      logger.log('Workspace folder change event received.');
    });
  }
});

const updating = (document: { uri: string }) => documentUpdateStatus.get(document.uri)?.promise
const tsSuffix = /\.[cm]?[jt]s$|\.json|\.[jt]sx/
const civetFileExtension = '.civet'

connection.onHover(async ({ textDocument, position }) => {
  // logger.log("hover"+ position)
  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)

  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return

  const doc = documents.get(textDocument.uri)
  assert(doc)

  let info
  await updating(textDocument)
  if (sourcePath.match(tsSuffix)) { // non-transpiled
    const p = doc.offsetAt(position)
    info = service.getQuickInfoAtPosition(sourcePath, p)
  } else { // Transpiled
    // need to sourcemap the line/columns
    const meta = service.host.getMeta(sourcePath)
    if (!meta) return
    const sourcemapLines = meta.sourcemapLines
    const transpiledDoc = meta.transpiledDoc
    if (!transpiledDoc) return

    // Map input hover position into output TS position
    // Don't map for files that don't have a sourcemap (plain .ts for example)
    if (sourcemapLines) {
      position = forwardMap(sourcemapLines, position)
    }

    // logger.log("onHover2"+ sourcePath+ position)

    const p = transpiledDoc.offsetAt(position)
    const transpiledPath = documentToSourcePath(transpiledDoc)
    info = service.getQuickInfoAtPosition(transpiledPath, p)
    // logger.log("onHover3"+ info)

  }
  if (!info) return

  const display = displayPartsToString(info.displayParts);
  // TODO: Replace Previewer
  const documentation = Previewer.plain(displayPartsToString(info.documentation));

  return {
    // TODO: Range
    contents: {
      kind: MarkupKind.Markdown,
      value: [
        `\`\`\`typescript\n${display}\n\`\`\``,
        documentation ?? "",
        ...info.tags?.map(Previewer.getTagDocumentation).filter((t) => !!t) || []
      ].join("\n\n")
    }
  };
})

// Helpers for completing import paths.

const looksLikeImportContext = /\b(from|import|require)\s*$/
function likelyImportContext(text: string): boolean { return looksLikeImportContext.test(text) }

// … Extract information about an import statement under the cursor
const importPathExtractor = /\b(?<statement>from|import|require)\b[ \t]*(?:[\(][ \t]*)?(?:(?<qt>')(?<path>[^']*)(?<endqt>'?)|(?<qt>")(?<path>[^"]*)(?<endqt>")?|(?<path>[^;"'\s=>]*))/gd

type ImportPathMatchIterator = RegExpStringIterator< RegExpExecArray & {
  groups: { statement: ('from'|'import'|'require'), path: string, qt: '"'|"'"|undefined , endqt: '"'|"'"|undefined }
  indices: { groups: { statement: [number, number], path: [number, number], qt: [number, number], endqt: [number, number] } }
}>

function extractImportPath(lineText: string, cursorOffset: number) {
  // Get all import|from|require statements in the line
  const matches = lineText.matchAll(importPathExtractor) as ImportPathMatchIterator

  // See if there's a match whose path group spans over the cursor
  for (const match of matches) {
    // Return that whole match, including quotes and the statement type
    if ( cursorOffset >= match.indices.groups.path[0]
      && cursorOffset <= match.indices.groups.path[1] ) {
        return match.groups
  }}
  return // undefined means no match
}

function findCivetFilesInDir(searchDir: string): string[] {
  try {
    return tsSys
      .readDirectory(searchDir, [civetFileExtension], undefined, undefined, 1)
      .map(f => path.basename(f))
  } catch {
    return []
  }
}

function createCivetFileCompletions(
  files: string[],
  sourcePath: string,
  position: Position,
): CompletionItem[] {
  return files.map((file) => {
    return {
      label: file,
      kind: CompletionItemKind.File,
      insertText: file,
      sortText: `${0}_${file}`,
      data: {
        sourcePath,
        position,
        name: file,
        source: undefined,
        data: undefined,
      }
    }
  })
}

function resolvePathAliasDir(
  compilationSettings: ts.CompilerOptions,
  importPath: string,
): string | undefined {
  const { baseUrl, paths } = compilationSettings
  if (!paths) return
  if (!(baseUrl && path.isAbsolute(baseUrl))) return

  const candidates: { resolvedDir: string, aliasPattern: string }[] = []

  for (const [pattern, replacements] of Object.entries(paths)) {
    if (pattern.endsWith('*')) {
      const aliasPrefix = pattern.slice(0, -1)
      if (importPath.startsWith(aliasPrefix)) {
        const pathAfterAlias = importPath.slice(aliasPrefix.length)
        for (const replacement of replacements) {
          const replacementBase = replacement.endsWith('*') ? replacement.slice(0, -1) : replacement
          const resolvedDir = path.resolve(baseUrl, replacementBase, pathAfterAlias)
          if (tsSys.directoryExists(resolvedDir)) {
            candidates.push({
              aliasPattern: aliasPrefix,
              resolvedDir,
            })
          }
        }
      }
    } else if (importPath === pattern) {
      for (const replacement of replacements) {
        const resolvedDir = path.resolve(baseUrl, replacement)
        if (tsSys.directoryExists(resolvedDir)) {
          candidates.push({
            resolvedDir,
            aliasPattern: pattern,
          })
        }
      }
    }
  }

  const chosenCandidate = candidates
    .sort((a, b) => b.aliasPattern.length - a.aliasPattern.length)
    .at(0)

  return chosenCandidate?.resolvedDir
}

const lineEnding = /[\n\r]+$/g
/** Get the content of the current line (with the trailing newline removed.) */
function getCurrentLineText(document: TextDocument, position: Position): string {
  return document.getText({
    start: { character: 0, line: position.line     },
    end:   { character: 0, line: position.line + 1 },
  }).replace(lineEnding, '');  
}

function appendClosingQuoteToPathCompletions(
  completions: CompletionItem[],
  closingQuoteSuffix: "'" | '"' | undefined,
): CompletionItem[] {
  if (!closingQuoteSuffix) return completions

  for (const completion of completions) {
    if (completion.kind !== CompletionItemKind.File && completion.kind !== CompletionItemKind.Module) {
      continue
    }
    if (completion.textEdit &&
        !completion.textEdit.newText.endsWith(closingQuoteSuffix)) {
      completion.textEdit.newText += closingQuoteSuffix
    }
    if (typeof completion.label === 'string') {
      completion.insertText ??= completion.label
    }
    if (typeof completion.insertText === 'string' &&
        !completion.insertText.endsWith(closingQuoteSuffix)) {
      completion.insertText += closingQuoteSuffix
    }
  }

  return completions
}

function getCivetFileCompletions(
  service: ResolvedService,
  document: TextDocument,
  sourcePath: string,
  position: Position
) {
  const lineText = getCurrentLineText(document, position)
  let civetFileCompletions: CompletionItem[] = []
  const show = { 
    relative:           false, // Civet files from relative paths
    alias:              false, // Civet files from path alias
    otherPaths:         false, // Other files, found by TypeScript
    otherLspCompletions: true, // Other suggestions, including exports
  }
  let cursorOffsetAdjustment = 0
  let importPath = ''
  let closingQuoteSuffix: "'" | '"' | undefined
  
  const extracted = extractImportPath(lineText, position.character)
  // logger.log(JSON.stringify(extracted || { path: '' }))
  if (extracted != null) {
    const { statement, path: pathText, qt, endqt } = extracted

    // require needs quotes to trigger completions
    if (statement !== 'require' || qt) {
      show.otherPaths = true
      if (statement === 'from' || statement === 'require') {
        show.otherLspCompletions = false
      }

      // Hardcode special-case cursor offset
      //
      //     Source:      import a from ./a|
      //     Transpiled:  import a from "./a"|
      //     Adjusted:    import a from "./a|"
      //
      if (!qt || qt !== endqt) cursorOffsetAdjustment = -1
      if (qt && qt !== endqt) closingQuoteSuffix = qt

      importPath = pathText
      show.relative = importPath.startsWith('./') || importPath.startsWith('../')
      show.alias = importPath.length > 0 && !show.relative
    }
  }

  let relativeCompletionItems: CompletionItem[] = []
  if (show.relative) {
    const sourceDir = path.dirname(sourcePath)
    const searchDir = path.resolve(sourceDir, importPath.substring(0, importPath.lastIndexOf('/')))
    const relativeCivetFiles = findCivetFilesInDir(searchDir)
    relativeCompletionItems = createCivetFileCompletions(relativeCivetFiles, sourcePath, position)
  }
  
  let pathAliasCompletionItems: CompletionItem[] = []
  if (show.alias) {
    const compilationSettings = service.host.getCompilationSettings()
    const aliasDir = resolvePathAliasDir(compilationSettings, importPath)
    const pathAliasCivetFiles = !aliasDir ? [] : findCivetFilesInDir(aliasDir)
    pathAliasCompletionItems = createCivetFileCompletions(pathAliasCivetFiles, sourcePath, position) 
  }

  civetFileCompletions = relativeCompletionItems.concat(pathAliasCompletionItems)

  const heuristics = { show, cursorOffsetAdjustment }
  return { civetFileCompletions, heuristics, closingQuoteSuffix }
}

// This handler provides the initial list of the completion items.
connection.onCompletion(async ({ textDocument, position, context }) => {

  const document = documents.get(textDocument.uri)
  assert(document)

  // Fast path for space trigger
  const linePrefix = getCurrentLineText(document, position).slice(0, position.character)
  if (context?.triggerCharacter === ' ' && !likelyImportContext(linePrefix)) {
    return []
  }

  await updating(textDocument)

  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)
  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return
  
  logger.log("completion " + sourcePath + " " + (position.line+1) + ":" + position.character)

  const { civetFileCompletions, heuristics, closingQuoteSuffix } = getCivetFileCompletions(
    service, document, sourcePath, position
  )

  // Options for the downstream TS LSP
  const completionOptions: GetCompletionsAtPositionOptions = {
    includeCompletionsForImportStatements: heuristics.show.otherPaths || likelyImportContext(linePrefix),
    includeCompletionsForModuleExports:    heuristics.show.otherLspCompletions,
    includeCompletionsWithSnippetText:     heuristics.show.otherLspCompletions,
    
    allowIncompleteCompletions: true,
    includeCompletionsWithInsertText: true,
    useLabelDetailsInCompletionEntries: true,
  }
  if (context?.triggerKind) {
    completionOptions.triggerKind = context.triggerKind
  }
  const isSpaceImport =
    context?.triggerCharacter === ' ' && likelyImportContext(linePrefix)
  if (context?.triggerCharacter) {
    completionOptions.triggerCharacter = context.triggerCharacter as ts.CompletionsTriggerCharacter

    if (isSpaceImport) {
      // Civet recovers incomplete `import ` as `import ""` for TS.
      // Treat this as if the user typed `"` so TS returns module path completions.
      completionOptions.triggerCharacter = '"' as ts.CompletionsTriggerCharacter
    }
  }
  
  if (sourcePath.match(tsSuffix)) {
    // Non-transpiled files
    const p = document.offsetAt(position)
    const tslCompletions = service.getCompletionsAtPosition(sourcePath, p, completionOptions)
    const completions = tslCompletions
      ? convertCompletions(
        tslCompletions, document, sourcePath, position, 
        undefined, // No sourcemap
        true, // Show file extensions (and use them in path completions)
      ) : []

    return appendClosingQuoteToPathCompletions(
      civetFileCompletions.concat(completions),
      closingQuoteSuffix)
  }

  // Civet files
  
  // … Sourcemap the line/columns
  const meta = service.host.getMeta(sourcePath)
  if (!meta) return civetFileCompletions
  const { sourcemapLines, transpiledDoc } = meta
  if (!transpiledDoc) return civetFileCompletions
  if (sourcemapLines) { position = forwardMap(sourcemapLines, position); logger.log('remapped') }
  let p = transpiledDoc.offsetAt(position)
  
  // … Adjust the cursor position, on a case-per-case basis, to access better completions.
  //  0: Default, when sourcemap cursor position is already perfect.
  // -1: Gets inside closing quotes for import file completion.
  p += heuristics.cursorOffsetAdjustment
  if (isSpaceImport) {
    // If we're at `import ` followed by EOF, sourcemapping is a bit wonky,
    // and we start on the left of the implicit "" instead of the right.
    // So now we've gone one step left when we need to go one step right.
    if (transpiledDoc.getText().slice(p, p + 3) === ' ""') p += 2
  }
  // logger.log([
  //   transpiledDoc.getText().slice(0, p),
  //   transpiledDoc.getText().slice(p)
  // ].join(`<[${heuristics.cursorOffsetAdjustment}]|>`))

  // … Get completions from TS
  const transpiledPath = documentToSourcePath(transpiledDoc)
  const tslCompletions = service.getCompletionsAtPosition(
    transpiledPath, p, completionOptions)
  const completions = tslCompletions 
    ? convertCompletions(
      tslCompletions,
      transpiledDoc,
      sourcePath,
      position,
      sourcemapLines,
      true,
    ) : []

  // … Return.
  return appendClosingQuoteToPathCompletions(
    civetFileCompletions.concat(completions),
    closingQuoteSuffix)

});

connection.onCompletionResolve(async (item) => {
  let { sourcePath, position, name, source, data } = item.data
  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return item

  let document
  if (sourcePath.match(tsSuffix)) { // non-transpiled
    document = documents.get(URI.file(sourcePath).toString())
    assert(document)
  } else {
    // use transpiled doc; forward source mapping already done
    const meta = service.host.getMeta(sourcePath)
    if (!meta) return item
    const { transpiledDoc } = meta
    if (!transpiledDoc) return item
    document = transpiledDoc
    sourcePath = documentToSourcePath(transpiledDoc)
  }
  const p = document.offsetAt(position)

  let detail
  try {
    detail = service.getCompletionEntryDetails(sourcePath, p, name, {
      semicolons: SemicolonPreference.Remove,
    }, source, undefined, data)
  } catch (e) {
    logger.log("Failed to get completion details for " + name)
    logger.log(String(e))
  }
  if (!detail) return item

  // getDetails from https://github.com/microsoft/vscode/blob/main/extensions/typescript-language-features/src/languageFeatures/completions.ts
  const details: string[] = []
  for (const action of detail.codeActions ?? []) {
    details.push(action.description)
  }
  details.push(asPlainTextWithLinks(detail.displayParts))
  item.detail = details.join("\n\n")

  // getDocumentation from https://github.com/microsoft/vscode/blob/main/extensions/typescript-language-features/src/languageFeatures/completions.ts
  const documentations: string[] = []
  if (detail.documentation) {
    documentations.push(asPlainTextWithLinks(detail.documentation))
  }
  if (detail.tags) {
    documentations.push(tagsToMarkdown(detail.tags))
  }
  if (documentations.length) {
    item.documentation = {
      kind: "markdown",
      value: documentations.join("\n\n"),
      // @ts-ignore
      baseUri: document.uri,
      isTrusted: { enabledCommands: ["_typescript.openJsDocLink"] },
    }
  }

  return item
});

connection.onDefinition(async ({ textDocument, position }) => {
  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)
  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return

  let definitions

  await updating(textDocument)
  // Non-transpiled
  if (sourcePath.match(tsSuffix)) {
    const document = documents.get(textDocument.uri)
    assert(document)
    const p = document.offsetAt(position)
    definitions = service.getDefinitionAtPosition(sourcePath, p)
  } else {
    // need to sourcemap the line/columns
    const meta = service.host.getMeta(sourcePath)
    if (!meta) return
    const { sourcemapLines, transpiledDoc } = meta
    if (!transpiledDoc) return

    // Map input hover position into output TS position
    // Don't map for files that don't have a sourcemap (plain .ts for example)
    if (sourcemapLines) {
      position = forwardMap(sourcemapLines, position)
    }

    const p = transpiledDoc.offsetAt(position)
    const transpiledPath = documentToSourcePath(transpiledDoc)
    definitions = service.getDefinitionAtPosition(transpiledPath, p)
  }

  if (!definitions) return

  const program = service.getProgram()
  assert(program)

  const defs = definitions as readonly ts.DefinitionInfo[]
  return defs.map((definition) => {
    let { fileName, textSpan } = definition
    // source file as it is known to TSServer
    const sourceFile = program.getSourceFile(fileName)
    if (!sourceFile) return

    let start = sourceFile.getLineAndCharacterOfPosition(textSpan.start)
    let end = sourceFile.getLineAndCharacterOfPosition(textSpan.start + textSpan.length)
    const rawSourceName = service.getSourceFileName(fileName)

    // Reverse map back to .civet source space if this definition is in a transpiled file
    const meta = service.host.getMeta(rawSourceName)
    if (meta) {
      const { sourcemapLines } = meta

      if (sourcemapLines) {
        start = remapPosition(start, sourcemapLines)
        end = remapPosition(end, sourcemapLines)
      }
    }

    return {
      uri: URI.file(rawSourceName).toString(),
      range: {
        start,
        end,
      }
    }
  }).filter((d): d is Location => !!d)

})

connection.onReferences(async ({ textDocument, position }) => {
  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)
  const service = await ensureServiceForSourcePath(sourcePath)
  // TODO: same source mapping as onDefinition I think...
  if (!service) return

  let references

  await updating(textDocument)
  if (sourcePath.match(tsSuffix)) { // non-transpiled
    const document = documents.get(textDocument.uri)
    assert(document)
    const p = document.offsetAt(position)
    references = service.getReferencesAtPosition(sourcePath, p)
  } else {
    // need to sourcemap the line/columns
    const meta = service.host.getMeta(sourcePath)
    if (!meta) return
    const { sourcemapLines, transpiledDoc } = meta
    if (!transpiledDoc) return

    // Map input hover position into output TS position
    // Don't map for files that don't have a sourcemap (plain .ts for example)
    if (sourcemapLines) {
      position = forwardMap(sourcemapLines, position)
    }

    const p = transpiledDoc.offsetAt(position)
    const transpiledPath = documentToSourcePath(transpiledDoc)
    references = service.getReferencesAtPosition(transpiledPath, p)
  }

  if (!references) return

  const program = service.getProgram()
  assert(program)

  const refs = references as readonly ts.ReferenceEntry[]
  return refs.map((reference) => {
    let { fileName, textSpan } = reference
    // source file as it is known to TSServer
    const sourceFile = program.getSourceFile(fileName)
    if (!sourceFile) return

    let start = sourceFile.getLineAndCharacterOfPosition(textSpan.start)
    let end = sourceFile.getLineAndCharacterOfPosition(textSpan.start + textSpan.length)
    const rawSourceName = service.getSourceFileName(fileName)

    // Reverse map back to .civet source space if this definition is in a transpiled file
    const meta = service.host.getMeta(rawSourceName)
    if (meta) {
      const { sourcemapLines } = meta

      if (sourcemapLines) {
        start = remapPosition(start, sourcemapLines)
        end = remapPosition(end, sourcemapLines)
      }
    }

    return {
      uri: URI.file(rawSourceName).toString(),
      range: {
        start,
        end,
      }
    }
  }).filter((d): d is Location => !!d)
});

connection.onDocumentSymbol(async ({ textDocument }) => {
  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)

  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return

  let document, navTree, sourcemapLines

  await updating(textDocument)
  if (sourcePath.match(tsSuffix)) { // non-transpiled
    document = documents.get(textDocument.uri)
    assert(document)
    navTree = service.getNavigationTree(sourcePath)
  } else {
    // Transpiled
    const meta = service.host.getMeta(sourcePath)
    assert(meta)
    const { transpiledDoc } = meta
    assert(transpiledDoc)

    document = transpiledDoc
    const transpiledPath = documentToSourcePath(transpiledDoc)
    navTree = service.getNavigationTree(transpiledPath)
    sourcemapLines = meta.sourcemapLines
  }

  const items: DocumentSymbol[] = []

  // The root represents the file. Ignore this when showing in the UI
  if (navTree.childItems) {
    for (const child of navTree.childItems) {
      convertNavTree(child, items, document, sourcemapLines)
    }
  }

  return items
})

function getRenameSourceDetails(
  service: ResolvedService,
  textDocumentId: TextDocumentIdentifier,
  sourcePath: string,
  position: Position
) {
  const isTypeScriptFile = sourcePath.match(tsSuffix)
  if (isTypeScriptFile) {
    const document = documents.get(textDocumentId.uri)
    if (!document) return null
    return {
      document,
      position,
      sourcePath,
      offset: document.offsetAt(position),
    }
  } else {
    const meta = service.host.getMeta(sourcePath)
    if (!meta) return null
    if (!meta.transpiledDoc || !meta.sourcemapLines) return null

    const document = meta.transpiledDoc
    if (!document) return null

    const mappedPosition = forwardMap(meta.sourcemapLines, position)

    return {
      document,
      position: mappedPosition,
      sourcePath: documentToSourcePath(meta.transpiledDoc),
      offset: document.offsetAt(mappedPosition),
    }
  }
}

function remapLocationRename(service: ResolvedService, sourceFile: ts.SourceFile, loc: ts.RenameLocation) {
  const start = sourceFile.getLineAndCharacterOfPosition(loc.textSpan.start)
  const end = sourceFile.getLineAndCharacterOfPosition(loc.textSpan.start + loc.textSpan.length)

  const sourceFileName = service.getSourceFileName(loc.fileName)
  const meta = service.host.getMeta(sourceFileName)

  if (meta?.sourcemapLines) {
    return {
      start: remapPosition(start, meta.sourcemapLines),
      end: remapPosition(end, meta.sourcemapLines),
      uri: pathToFileURL(sourceFileName).toString(),
    }
  }
  
  return {
    start,
    end,
    uri: pathToFileURL(loc.fileName).toString(),
  }
}

function createRenameLocationChanges(
  service: ResolvedService,
  program: ts.Program,
  locations: readonly ts.RenameLocation[],
  newName: string
) {
  const changes: Record<string, TextEdit[]> = {}

  for (const loc of locations) {
    const sourceFile = program.getSourceFile(loc.fileName)
    if (!sourceFile) continue

    const { start, end, uri } = remapLocationRename(service, sourceFile, loc)
    const edit: TextEdit = {
      range: { start, end },
      newText: newName,
    };

    if (changes[uri]) {
      changes[uri].push(edit)
    } else {
      changes[uri] = [edit]
    }
  }

  return changes 
}

connection.onRenameRequest(async ({ textDocument, position, newName }) => {
  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)

  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return

  await updating(textDocument)

  const mapped = getRenameSourceDetails(service, textDocument, sourcePath, position)
  if (!mapped) return

  const locations = service.findRenameLocations(mapped.sourcePath, mapped.offset, false, false, {})
  if (!locations || !locations.length) return

  const program = service.getProgram()
  assert(program)

  return {
    changes: createRenameLocationChanges(service, program, locations, newName),
  }
})

// TODO
documents.onDidClose(({ document }) => {
  logger.log("close " + document.uri)
});

documents.onDidOpen(async ({ document }) => {
  logger.log("open " + document.uri)
})

// Buffer up changes to documents so we don't stack transpilations and become unresponsive
let changeQueue = new Set<TextDocument>()
let executeTimeout: Promise<void> | undefined
const documentUpdateStatus = new Map<string, WithResolvers<boolean>>()
async function executeQueue() {
  // Cancel any in-flight project-wide diagnostics update to avoid conflicts
  if (runningDiagnosticsUpdate) {
    runningDiagnosticsUpdate.isCanceled = true
  }
  const changed = Array.from(changeQueue);
  changeQueue = new Set();
  if (changed.length === 0) {
    executeTimeout = undefined;
    return;
  }
  logger.log(`executeQueue: Processing batch of ${changed.length} documents.`);

  const docsByProject = new Map<string, { service: ResolvedService; docs: TextDocument[] }>();

  // Group documents by their project path to ensure atomic updates per project.
  for (const doc of changed) {
    const sourcePath = documentToSourcePath(doc);
    const projPath = getProjectPathFromSourcePath(sourcePath);
    if (!docsByProject.has(projPath)) {
      const service = await ensureServiceForSourcePath(sourcePath);
      if (service) docsByProject.set(projPath, { service, docs: [] });
    }
    docsByProject.get(projPath)?.docs.push(doc);
  }

  for (const { service, docs } of docsByProject.values()) {
    // Phase 1: Stage all changes within this project.
    docs.forEach(doc => service.host.addOrUpdateDocument(doc));

    // Phase 2: Analyze all staged documents within this project.
    for (const doc of docs) {
      await updateDiagnosticsForDoc(doc, service);
      documentUpdateStatus.get(doc.uri)?.resolve(true);
      Promise.resolve().then(() => documentUpdateStatus.delete(doc.uri));
    }
  }
  executeTimeout = undefined
  if (changeQueue.size) {
    scheduleExecuteQueue()
  } else {
    scheduleUpdateDiagnostics(new Set(changed));
  }
}
async function scheduleExecuteQueue() {
  // Schedule executeQueue() if there isn't one already running or scheduled
  if (executeTimeout) return
  if (!changeQueue.size) return
  await (executeTimeout = setTimeout(diagnosticsDelay))
  await executeQueue()
}

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(async ({ document }) => {
  logger.log("onDidChangeContent " + document.uri)
  documentUpdateStatus.set(document.uri, withResolvers())
  changeQueue.add(document)
  scheduleExecuteQueue()
});

async function updateDiagnosticsForDoc(document: TextDocument, service?: ResolvedService) {
  logger.log("Updating diagnostics for doc: " + document.uri)
  const sourcePath = documentToSourcePath(document)
  assert(sourcePath)

  if (!service) {
    service = await ensureServiceForSourcePath(sourcePath)
  }
  if (!service) return

  // When called from executeQueue, document is already staged.
  // When called from updateProjectDiagnostics, we need to stage it.
  if (arguments.length === 1) {
    service.host.addOrUpdateDocument(document)
  }

  // Non-transpiled
  if (sourcePath.match(tsSuffix)) {
    const diagnostics: Diagnostic[] = [
      ...logTiming(logger, "service.getSyntacticDiagnostics", service.getSyntacticDiagnostics)(sourcePath),
      ...logTiming(logger, "service.getSemanticDiagnostics", service.getSemanticDiagnostics)(sourcePath),
      ...logTiming(logger, "service.getSuggestionDiagnostics", service.getSuggestionDiagnostics)(sourcePath),
    ].map((diagnostic) => convertDiagnostic(diagnostic, document))

    return connection.sendDiagnostics({
      uri: document.uri,
      diagnostics
    })
  }

  // Transpiled file
  const meta = service.host.getMeta(sourcePath)
  if (!meta) {
    logger.log("no meta for " + sourcePath)
    return
  }
  const { sourcemapLines, transpiledDoc, parseErrors, fatal } = meta
  if (!transpiledDoc) {
    logger.log("no transpiledDoc for " + sourcePath)
    return
  }

  const transpiledPath = documentToSourcePath(transpiledDoc)
  const diagnostics: Diagnostic[] = [];

  if (parseErrors?.length) {
    diagnostics.push(...parseErrors.map((e: Error & {line?: number, column?: number}) => {
      let start = { line: 0, character: 0 }, end = { line: 0, character: 10 }
      let message = e.message
      if (e.line != null && e.column != null) { // ParseError
        // Remove leading filename:line:column from message
        message = message.replace(/^\S+ /, "")
        // Convert 1-based to 0-based
        start.line = end.line = e.line - 1
        start.character = e.column - 1
        end.character = e.column + 3
      }

      return {
        severity: DiagnosticSeverity.Error,
        // Don't need to transform the range, it's already in the source file coordinates
        range: {
          start,
          end,
        },
        message,
        source: 'civet'
      }
    }).filter(x => !!x))
  }
  if (!fatal) {
    [
      ...logTiming(logger, "service.getSyntacticDiagnostics", service.getSyntacticDiagnostics)(transpiledPath),
      ...logTiming(logger, "service.getSemanticDiagnostics", service.getSemanticDiagnostics)(transpiledPath),
      ...logTiming(logger, "service.getSuggestionDiagnostics", service.getSuggestionDiagnostics)(transpiledPath),
    ].forEach((diagnostic) => {
      diagnostics.push(convertDiagnostic(diagnostic, transpiledDoc!, sourcemapLines))
    })
  }

  connection.sendDiagnostics({
    uri: document.uri,
    diagnostics
  })

  return
}

// Using a cancellation token we prevent parallel executions of scheduleUpdateDiagnostics
let runningDiagnosticsUpdate: { isCanceled: boolean } | undefined

// Asynchronously update diagnostics for all the documents
// in a project, based on the service instance.
const updateProjectDiagnostics = async (
  status: { isCanceled: boolean },
  service: ResolvedService
) => {
  const program = service.getProgram();
  if (!program) return;

  // A single, short delay before starting the update for a project.
  await setTimeout(diagnosticsPropagationDelay);

  const projectFiles = program.getSourceFiles();
  for (const sourceFile of projectFiles) {
    if (status.isCanceled) return;

    // We only need to send diagnostics for files the user has open
    // TypeScript is analyzing all files in memory anyway
    const rawFileName = service.getSourceFileName(sourceFile.fileName);
    const docUri = URI.file(rawFileName).toString();
    const doc = documents.get(docUri);
    if (doc) {
      await updateDiagnosticsForDoc(doc, service);
    }
  }
}

// Schedule an update of diagnostics for all projects affected by recent changes.
function scheduleUpdateDiagnostics(changedDocs: Set<TextDocument>) {
  if (runningDiagnosticsUpdate) {
    runningDiagnosticsUpdate.isCanceled = true;
  }
  const status = { isCanceled: false };
  runningDiagnosticsUpdate = status;

  // Deduplicate by project path to avoid redundant updates.
  const servicesToUpdate = new Set<ResolvedService>();
  for (const doc of changedDocs) {
    const sourcePath = documentToSourcePath(doc);
    const projPath = getProjectPathFromSourcePath(sourcePath);
    const service = projectPathToServiceMap.get(projPath);
    if (service) {
      servicesToUpdate.add(service);
    }
  }

  // Trigger updates for each affected project.
  for (const service of servicesToUpdate) {
    // Don't await; let updates for different projects run in parallel.
    updateProjectDiagnostics(status, service);
  }
}

connection.onDidChangeWatchedFiles(_change => {
  // Monitored files have change in VSCode
  logger.log('We received an file change event');
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();

// Utils

function documentToSourcePath(textDocument: TextDocumentIdentifier) {
  return URI.parse(textDocument.uri).fsPath;
}

// https://github.com/typescript-language-server/typescript-language-server/blob/e91bd52a47c05ffd946e0abd27f242eb631b7604/src/completion.ts#L188
const fileExtensionKindModifiers = new Set<string>([
  ScriptElementKindModifier.dtsModifier,
  ScriptElementKindModifier.tsModifier,
  ScriptElementKindModifier.tsxModifier,
  ScriptElementKindModifier.jsModifier,
  ScriptElementKindModifier.jsxModifier,
  ScriptElementKindModifier.jsonModifier,
  ScriptElementKindModifier.dmtsModifier,
  ScriptElementKindModifier.mtsModifier,
  ScriptElementKindModifier.mjsModifier,
  ScriptElementKindModifier.dctsModifier,
  ScriptElementKindModifier.ctsModifier,
  ScriptElementKindModifier.cjsModifier,
])

function getFileExtensionModifier(kindModifiers: Set<string>): string {
  for (const modifier of kindModifiers) {
    if (fileExtensionKindModifiers.has(modifier)) return modifier
  }
  return ''
}

function convertCompletions(completions: ts.CompletionInfo, document: TextDocument, sourcePath: string, position: Position, sourcemapLines?: SourcemapLines, showFileExtensions?: boolean): CompletionItem[] {
  // Partial simulation of MyCompletionItem in
  // https://github.com/microsoft/vscode/blob/main/extensions/typescript-language-features/src/languageFeatures/completions.ts
  const { entries } = completions;

  const items: CompletionItem[] = [];
  for (const entry of entries) {
    const kind = getCompletionItemKind(entry.kind)

    // https://github.com/typescript-language-server/typescript-language-server/blob/e91bd52a47c05ffd946e0abd27f242eb631b7604/src/completion.ts#L106
    const item: CompletionItem = {
      label: entry.name || (entry.insertText ?? ''),
      kind,
      data: {
        sourcePath, position,
        name: entry.name, source: entry.source, data: entry.data,
        kindModifiers: entry.kindModifiers,
      }
    }

    if (entry.sourceDisplay) {
      item.labelDetails = { description: Previewer.plain(entry.sourceDisplay) }
    } else if (entry.source && entry.hasAction) {
      item.labelDetails = { description: rootDir ? path.relative(rootDir, entry.source) : entry.source }
    }
    if (entry.labelDetails) {
      item.labelDetails = { ...item.labelDetails, ...entry.labelDetails }
    }

    if (entry.isRecommended) {
      item.preselect = entry.isRecommended
    }
    item.insertText = entry.insertText || item.label
    if (entry.filterText) {
      item.filterText = entry.filterText
    }
    if (entry.sortText) {
      item.sortText = entry.sortText
    }
    if (entry.replacementSpan) {
      const { start, length } = entry.replacementSpan
      let begin = document.positionAt(start)
      let end = document.positionAt(start + length)
      if (sourcemapLines) {
        begin = remapPosition(begin, sourcemapLines)
        end = remapPosition(end, sourcemapLines)
      }
      item.textEdit = {
        range: { start: begin, end },
        newText: entry.insertText!,
      }
    }
    if (entry.kindModifiers) {
      const kindModifiers = parseKindModifier(entry.kindModifiers)
      if (kind === CompletionItemKind.File && showFileExtensions) {
        const extension = getFileExtensionModifier(kindModifiers)
        if (!entry.name.toLowerCase().endsWith(extension)) {
          item.label += extension
          item.insertText += extension
        }
      }
      if (kindModifiers.has(ScriptElementKindModifier.optionalModifier)) {
        item.label += '?'
      }
      if (kindModifiers.has(ScriptElementKindModifier.deprecatedModifier)) {
        item.tags = [CompletionItemTag.Deprecated]
      }
    }

    items.push(item);
  }

  return items
}

/*
  References:
  - Completion trigger characters used by the TS language server: '.', '"', '\'', '/', '@', '<'
    https://github.com/typescript-language-server/typescript-language-server/blob/e91bd52a47c05ffd/src/lsp-server.ts#L193
  - SignatureHelpProvider triggers: '(', ',', '<', and re-trigger ')'
    https://github.com/typescript-language-server/typescript-language-server/blob/e91bd52a47c05ffd946e0abd27f242eb631b7604/src/lsp-server.ts#L234-L237
*/
