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
  CompletionItemTag,
  Location,
  DiagnosticSeverity,
} from 'vscode-languageserver/node';

import {
  TextDocument,
  type Position
} from 'vscode-languageserver-textdocument';
import TSService from './lib/typescript-service.mjs';
import * as Previewer from "./lib/previewer.mjs";
import { convertNavTree, forwardMap, getCompletionItemKind, convertDiagnostic, remapPosition, parseKindModifier, logTiming, WithResolvers, withResolvers } from './lib/util.mjs';
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
import { fileURLToPath, pathToFileURL } from 'url';
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
      projPath = pathToFileURL(dirname + "/").toString()
      break
    } else {
      dirname = path.dirname(dirname) // go up one level
    }
  }

  // Otherwise, check for ancestor tsconfig
  if (!projPath) {
    const tsConfigPath = findConfigFile(sourcePath, tsSys.fileExists, 'tsconfig.json')
    if (tsConfigPath) {
      projPath = pathToFileURL(path.dirname(tsConfigPath) + "/").toString()
    }
  }

  // Otherwise, check whether we're inside the root
  if (!projPath) {
    if (rootDir != null && sourcePath.startsWith(rootDir)) {
      projPath = rootUri ?? pathToFileURL(path.dirname(sourcePath) + "/").toString()
    } else {
      projPath = pathToFileURL(path.dirname(sourcePath) + "/").toString()
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
        resolveProvider: true
      },
      // documentLinkProvider: {
      //   resolveProvider: true
      // },
      documentSymbolProvider: true,
      definitionProvider: true,
      hoverProvider: true,
      referencesProvider: true,

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
    rootDir = fileURLToPath(rootUri)
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

// This handler provides the initial list of the completion items.
connection.onCompletion(async ({ textDocument, position, context: _context }) => {
  const completionConfiguration = {
    useCodeSnippetsOnMethodSuggest: false,
    pathSuggestions: true,
    autoImportSuggestions: true,
    nameSuggestions: true,
    importStatementSuggestions: true,
  }

  const context = _context as {
    triggerKind?: GetCompletionsAtPositionOptions["triggerKind"],
    triggerCharacter?: GetCompletionsAtPositionOptions["triggerCharacter"]
  }

  const completionOptions: GetCompletionsAtPositionOptions = {
    includeExternalModuleExports: completionConfiguration.autoImportSuggestions,
    includeInsertTextCompletions: true,
  }
  
  if (context?.triggerKind) {
    completionOptions.triggerKind = context.triggerKind
  }
  if (context?.triggerCharacter) {
    completionOptions.triggerCharacter = context.triggerCharacter
  }

  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)
  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return

  logger.log("completion " + sourcePath + " " + position)

  await updating(textDocument)
  if (sourcePath.match(tsSuffix)) { // non-transpiled
    const document = documents.get(textDocument.uri)
    assert(document)
    const p = document.offsetAt(position)
    const completions = service.getCompletionsAtPosition(sourcePath, p, completionOptions)
    if (!completions) return
    return convertCompletions(completions, document, sourcePath, position)
  }

  // need to sourcemap the line/columns
  const meta = service.host.getMeta(sourcePath)
  if (!meta) return
  const { sourcemapLines, transpiledDoc } = meta
  if (!transpiledDoc) return

  // Map input hover position into output TS position
  // Don't map for files that don't have a sourcemap (plain .ts for example)
  if (sourcemapLines) {
    position = forwardMap(sourcemapLines, position)
    logger.log('remapped')
  }

  const p = transpiledDoc.offsetAt(position)
  const transpiledPath = documentToSourcePath(transpiledDoc)
  const completions = service.getCompletionsAtPosition(transpiledPath, p, completionOptions)
  if (!completions) return;

  return convertCompletions(completions, transpiledDoc, sourcePath, position, sourcemapLines)
});

type CompletionItemData = {
  sourcePath: string
  position: Position
  name: string
  source: string | undefined
  data: ts.CompletionEntryData | undefined
}

connection.onCompletionResolve(async (item) => {
  let { sourcePath, position, name, source, data } =
    item.data as CompletionItemData
  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return item

  let document
  if (sourcePath.match(tsSuffix)) { // non-transpiled
    document = documents.get(pathToFileURL(sourcePath).toString())
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
      uri: pathToFileURL(rawSourceName).toString(),
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
      uri: pathToFileURL(rawSourceName).toString(),
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

  for (const sourceFile of program.getSourceFiles()) {
    if (status.isCanceled) return;

    // We only send diagnostics for files the user actually has open,
    // even though we're checking every file in the project for correctness.
    const docUri = pathToFileURL(sourceFile.fileName).toString();
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
  return fileURLToPath(textDocument.uri);
}

function convertCompletions(completions: ts.CompletionInfo, document: TextDocument, sourcePath: string, position: Position, sourcemapLines?: any): CompletionItem[] {
  // Partial simulation of MyCompletionItem in
  // https://github.com/microsoft/vscode/blob/main/extensions/typescript-language-features/src/languageFeatures/completions.ts
  const { entries } = completions;

  const items: CompletionItem[] = [];
  for (const entry of entries) {
    const item: CompletionItem = {
      label: entry.name || (entry.insertText ?? ''),
      kind: getCompletionItemKind(entry.kind),
      data: {
        sourcePath, position,
        name: entry.name, source: entry.source, data: entry.data,
      } satisfies CompletionItemData,
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
    if (entry.insertText) {
      item.insertText = entry.insertText
    }
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
