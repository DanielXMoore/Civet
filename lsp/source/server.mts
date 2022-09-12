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
  HandlerResult,
  DocumentSymbol,
  CompletionItem,
  Location,
} from 'vscode-languageserver';

import {
  TextDocument
} from 'vscode-languageserver-textdocument';

import TSService from './lib/typescript-service.mjs';
import * as Previewer from "./lib/previewer.mjs";
import { convertNavTree, forwardMap, getCompletionItemKind, convertDiagnostic } from './lib/util.mjs';
import assert from "assert"

import Civet from "@danielx/civet"
import { displayPartsToString, GetCompletionsAtPositionOptions } from 'typescript';
import { fileURLToPath } from 'url';
const { util: { locationTable } } = Civet

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

let service: ReturnType<typeof TSService>;
let rootDir: string;

connection.onInitialize((params: InitializeParams) => {
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
  service = TSService(rootDir)

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

connection.onHover(({ textDocument, position }) => {
  const sourcePath = documentToSourcePath(textDocument)
  if (!sourcePath) return;

  // console.log("hover", sourcePath, position)

  const doc = documents.get(textDocument.uri);
  assert(doc)

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

  const p = transpiledDoc.offsetAt(position)

  const info = service.getQuickInfoAtPosition(sourcePath, p)
  if (!info) return;

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
connection.onCompletion(({ textDocument, position, context: _context }) => {
  const context = _context as {
    triggerKind?: GetCompletionsAtPositionOptions["triggerKind"],
    triggerCharacter?: GetCompletionsAtPositionOptions["triggerCharacter"]
  }

  const sourcePath = documentToSourcePath(textDocument)
  if (!sourcePath) return;

  console.log("completion", sourcePath, position)

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

  const completionConfiguration = {
    useCodeSnippetsOnMethodSuggest: false,
    pathSuggestions: true,
    autoImportSuggestions: true,
    nameSuggestions: true,
    importStatementSuggestions: true,
  }

  const completionOptions: GetCompletionsAtPositionOptions = {
    includeExternalModuleExports: completionConfiguration.autoImportSuggestions,
    includeInsertTextCompletions: true,
    ...context,
  }

  const completions = service.getCompletionsAtPosition(sourcePath, p, completionOptions)
  if (!completions) return;

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
});

// TODO
connection.onCompletionResolve((item) => {
  return item;
})

connection.onDefinition(({ textDocument, position }) => {
  const sourcePath = documentToSourcePath(textDocument)
  if (!sourcePath) return undefined

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

  const p = transpiledDoc.offsetAt(position)

  const program = service.getProgram()
  if (!program) return

  const definitions = service.getDefinitionAtPosition(sourcePath, p)
  if (!definitions) return

  return definitions.map<Location | undefined>((definition) => {
    const { fileName, textSpan } = definition
    const sourceFile = program.getSourceFile(fileName)
    if (!sourceFile) return

    return {
      uri: fileName,
      range: {
        start: sourceFile.getLineAndCharacterOfPosition(textSpan.start),
        end: sourceFile.getLineAndCharacterOfPosition(textSpan.start + textSpan.length)
      }
    }
  }).filter((d) => !!d) as Location[]

})

connection.onDocumentSymbol(({ textDocument }) => {
  const sourcePath = documentToSourcePath(textDocument)
  if (!sourcePath) return undefined

  const items: DocumentSymbol[] = []
  const navTree = service.getNavigationTree(sourcePath)

  // Need to use the transpiled source to convert from text spans (pos, length) to (line, column)
  const snapshot = service.host.getScriptSnapshot(sourcePath)
  const transpiled = snapshot?.getText(0, snapshot.getLength())
  if (!transpiled) return

  const lineTable = locationTable(transpiled)

  // need to sourcemap the line/columns
  const sourcemapLines = service.host.getMeta(sourcePath)?.sourcemapLines

  // The root represents the file. Ignore this when showing in the UI
  for (const child of navTree.childItems!) {
    convertNavTree(lineTable, sourcemapLines, items, child)
  }

  return items
})

// TODO
documents.onDidClose(({ document }) => {
  console.log("close", document.uri)
});

documents.onDidOpen(({ document }) => {
  console.log("open", document.uri)
})

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(({ document }) => {
  console.log("onDidChangeContent", document.uri)
  service.host.addDocument(document)

  service.get

  updateDiagnostics(document)
});

function updateDiagnostics(document: TextDocument) {
  const sourcePath = documentToSourcePath(document)
  if (!sourcePath) return

  const meta = service.host.getMeta(sourcePath)
  if (!meta) {
    console.log("no meta for ", sourcePath)
    return
  }
  const sourcemapLines = meta.sourcemapLines
  const transpiledDoc = meta.transpiledDoc
  if (!transpiledDoc) return

  const diagnostics: Diagnostic[] = [];
  [
    ...service.getSyntacticDiagnostics(sourcePath),
    ...service.getSemanticDiagnostics(sourcePath),
    ...service.getSuggestionDiagnostics(sourcePath),
  ].forEach((diagnostic) => {
    diagnostics.push(convertDiagnostic(diagnostic, transpiledDoc, sourcemapLines))
  })

  connection.sendDiagnostics({
    uri: document.uri,
    diagnostics
  })

  return
}

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
