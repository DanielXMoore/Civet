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
  Location,
  DiagnosticSeverity,
} from 'vscode-languageserver/node';

import {
  TextDocument
} from 'vscode-languageserver-textdocument';
import TSService, { FileMeta } from './lib/typescript-service.mjs';
import * as Previewer from "./lib/previewer.mjs";
import { convertNavTree, forwardMap, getCompletionItemKind, convertDiagnostic, remapPosition } from './lib/util.mjs';
import assert from "assert"
import path from "node:path"
import ts, {
  sys as tsSys,
  displayPartsToString,
  GetCompletionsAtPositionOptions,
  findConfigFile
} from 'typescript';
import { fileURLToPath, pathToFileURL } from 'url';
import { setTimeout } from 'timers/promises';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all)

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

// Mapping from abs file path -> path of nearest applicable project path (tsconfig.json base)
const sourcePathToProjectPathMap = new Map<string, string>()

// Tracks pending promises for tsserver initialization to safeguard
// against creating multiple tsserver instances for same project path
const projectPathToPendingPromiseMap = new Map<string, Promise<void>>()

// Mapping from project path -> TSService instance operating on that base directory
const projectPathToServiceMap = new Map<string, ReturnType<typeof TSService>>()

let rootDir: string;

const ensureServiceForSourcePath = async (sourcePath: string) => {
  let projPath = sourcePathToProjectPathMap.get(sourcePath)
  if (!projPath) {
    const tsConfigPath = findConfigFile(sourcePath, tsSys.fileExists, 'tsconfig.json')
    if (tsConfigPath) {
      projPath = pathToFileURL(path.dirname(tsConfigPath) + "/").toString()
    }
    if (!projPath) projPath = rootDir // Fallback
    sourcePathToProjectPathMap.set(sourcePath, projPath)
  }
  await projectPathToPendingPromiseMap.get(projPath)
  let service = projectPathToServiceMap.get(projPath)
  if (service) return service
  console.log("Spawning language server for project path: ", projPath)
  service = TSService(projPath)
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
  hasDiagnosticRelatedInformationCapability = !!(
    capabilities.textDocument &&
    capabilities.textDocument.publishDiagnostics &&
    capabilities.textDocument.publishDiagnostics.relatedInformation
  );

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
  if (!baseDir)
    throw new Error("Could not initialize without workspace folders")

  rootDir = baseDir + "/"

  console.log("Init", rootDir)
  return result;
});

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    connection.client.register(DidChangeConfigurationNotification.type, undefined);
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders(_event => {
      connection.console.log('Workspace folder change event received.');
    });
  }
});

const tsSuffix = /\.[cm]?[jt]s$|\.json|\.[jt]sx/

connection.onHover(async ({ textDocument, position }) => {
  // console.log("hover", position)
  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)

  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return

  const doc = documents.get(textDocument.uri)
  assert(doc)

  let info
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

    // console.log("onHover2", sourcePath, position)

    const p = transpiledDoc.offsetAt(position)
    const transpiledPath = documentToSourcePath(transpiledDoc)
    info = service.getQuickInfoAtPosition(transpiledPath, p)
    // console.log("onHover3", info)

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
    ...context,
  }

  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)
  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return

  console.log("completion", sourcePath, position)

  if (sourcePath.match(tsSuffix)) { // non-transpiled
    const document = documents.get(textDocument.uri)
    assert(document)
    const p = document.offsetAt(position)
    const completions = service.getCompletionsAtPosition(sourcePath, p, completionOptions)
    if (!completions) return
    return convertCompletions(completions)
  }

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
    console.log('remapped')
  }

  const p = transpiledDoc.offsetAt(position)
  const transpiledPath = documentToSourcePath(transpiledDoc)
  const completions = service.getCompletionsAtPosition(transpiledPath, p, completionOptions)
  if (!completions) return;

  return convertCompletions(completions)
});

// TODO
connection.onCompletionResolve((item) => {
  return item;
})

connection.onDefinition(async ({ textDocument, position }) => {
  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)
  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return

  let definitions, meta: FileMeta | undefined

  // Non-transpiled
  if (sourcePath.match(tsSuffix)) {
    const document = documents.get(textDocument.uri)
    assert(document)
    const p = document.offsetAt(position)
    definitions = service.getDefinitionAtPosition(sourcePath, p)
  } else {

    // need to sourcemap the line/columns
    meta = service.host.getMeta(sourcePath)
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

  return definitions.map<Location | undefined>((definition) => {
    let { fileName, textSpan } = definition
    // TODO: May need to remap fileNames back to sourceFileNames
    const sourceFile = program.getSourceFile(fileName)
    if (!sourceFile) return

    // Reverse map back to .civet source space if we forward mapped earlier
    if (meta) {
      const { sourcemapLines } = meta
      return {
        uri: service.getSourceFileName(fileName),
        range: {
          start: remapPosition(sourceFile.getLineAndCharacterOfPosition(textSpan.start), sourcemapLines),
          end: remapPosition(sourceFile.getLineAndCharacterOfPosition(textSpan.start + textSpan.length), sourcemapLines),
        }
      }
    }

    return {
      uri: service.getSourceFileName(fileName),
      range: {
        start: sourceFile.getLineAndCharacterOfPosition(textSpan.start),
        end: sourceFile.getLineAndCharacterOfPosition(textSpan.start + textSpan.length)
      }
    }
  }).filter((d) => !!d) as Location[]

})

connection.onDocumentSymbol(async ({ textDocument }) => {
  const sourcePath = documentToSourcePath(textDocument)
  assert(sourcePath)

  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return

  let document, navTree, sourcemapLines

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
  console.log("close", document.uri)
});

documents.onDidOpen(async ({ document }) => {
  console.log("open", document.uri)
})

// Buffer up changes to documents so we don't stack transpilations and become unresponsive
let changeQueue = new Set<TextDocument>()
let executeTimeout: Promise<void> | undefined
async function executeQueue() {
  // Cancel updating any other documents while running queue of primary changes
  if (runningDiagnosticsUpdate) {
    runningDiagnosticsUpdate.isCanceled = true
  }
  // Reset queue to allow accumulating jobs while this queue runs
  const changed = changeQueue
  changeQueue = new Set
  console.log("executeQueue", changed.size)
  // Run all jobs in queue (preventing livelock).
  for (const document of changed) {
    await updateDiagnosticsForDoc(document)
  }
  // Allow executeQueue() again, and run again if there are new jobs now.
  // Otherwise, schedule update of all other documents.
  executeTimeout = undefined
  if (changeQueue.size) {
    scheduleExecuteQueue()
  } else {
    scheduleUpdateDiagnostics(changed)
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
  console.log("onDidChangeContent", document.uri)
  changeQueue.add(document)
  scheduleExecuteQueue()
});

async function updateDiagnosticsForDoc(document: TextDocument) {
  console.log("Updating diagnostics for doc:", document.uri)
  const sourcePath = documentToSourcePath(document)
  assert(sourcePath)

  const service = await ensureServiceForSourcePath(sourcePath)
  if (!service) return

  service.host.addOrUpdateDocument(document)

  // Non-transpiled
  if (sourcePath.match(tsSuffix)) {
    const diagnostics: Diagnostic[] = [
      ...service.getSyntacticDiagnostics(sourcePath),
      ...service.getSemanticDiagnostics(sourcePath),
      ...service.getSuggestionDiagnostics(sourcePath),
    ].map((diagnostic) => convertDiagnostic(diagnostic, document))

    return connection.sendDiagnostics({
      uri: document.uri,
      diagnostics
    })
  }

  // Transpiled file
  const meta = service.host.getMeta(sourcePath)
  if (!meta) {
    console.log("no meta for ", sourcePath)
    return
  }
  const { sourcemapLines, transpiledDoc, parseErrors } = meta
  if (!transpiledDoc) return

  const transpiledPath = documentToSourcePath(transpiledDoc)
  const diagnostics: Diagnostic[] = [];

  if (parseErrors?.length) {
    diagnostics.push(...parseErrors.map((e: Error) => {
      const { message } = e

      let start = { line: 0, character: 0 }, end = { line: 0, character: 10 }
      try {
        const match = errorRe.exec(message)
        if (match) {
          const
            line = parseInt(match[1]) - 1,
            column = parseInt(match[2]) - 1

          start = {
            line,
            character: column
          }

          end = {
            line,
            character: column + 3
          }
        }

      } catch { }

      return {
        severity: DiagnosticSeverity.Error,
        // Don't need to transform the range, it's already in the source file coordinates
        range: {
          start,
          end,
        },
        message: message,
        source: 'ts'
      }
    }).filter(x => !!x))
  } else {
    [
      ...service.getSyntacticDiagnostics(transpiledPath),
      ...service.getSemanticDiagnostics(transpiledPath),
      ...service.getSuggestionDiagnostics(transpiledPath),
    ].forEach((diagnostic) => {
      diagnostics.push(convertDiagnostic(diagnostic, transpiledDoc, sourcemapLines))
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
// other than the ones in skip list
const updatePendingDiagnostics = async (
  status: { isCanceled: boolean },
  skipDocs: Set<TextDocument>
) => {
  await setTimeout(diagnosticsPropagationDelay)
  if (status?.isCanceled) return
  for (let doc of documents.all()) {
    if (skipDocs.has(doc)) {
      // We can skip this document because it was updated
      // right after the content update
      continue
    }
    updateDiagnosticsForDoc(doc)
    await setTimeout(diagnosticsPropagationDelay)
    if (status?.isCanceled) return
  }
}

// Schedule an update of diagnostics for all *other* documents
// that weren't directly changed, but might depend on changed documents.
// Skip documents passed in as a set (the already updated changed documents).
function scheduleUpdateDiagnostics(skipDocs: Set<TextDocument>) {
  if (runningDiagnosticsUpdate) {
    runningDiagnosticsUpdate.isCanceled = true
  }
  runningDiagnosticsUpdate = {
    isCanceled: false
  }
  updatePendingDiagnostics(runningDiagnosticsUpdate, skipDocs)
}

// NOTE: this is a bit of a hack, Hera should provide enhanced error objects with line and column info
const errorRe = /(\d+):(\d+)/

connection.onDidChangeWatchedFiles(_change => {
  // Monitored files have change in VSCode
  connection.console.log('We received an file change event');
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

function convertCompletions(completions: ts.CompletionInfo): CompletionItem[] {
  // TODO: TS is doing a lot more here and some of it might be useful
  const { entries } = completions;

  const items: CompletionItem[] = [];
  for (const entry of entries) {
    const item: CompletionItem = {
      label: entry.name,
      kind: getCompletionItemKind(entry.kind)
    };

    if (entry.insertText) {
      item.insertText = entry.insertText
    }

    items.push(item);
  }

  return items
}
