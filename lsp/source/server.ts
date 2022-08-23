import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  TextDocumentSyncKind,
  InitializeResult
} from 'vscode-languageserver/node';

import {
  TextDocument
} from 'vscode-languageserver-textdocument';

import Civet from "@danielx/civet"

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

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

// This handler provides the initial list of the completion items.
connection.onCompletion((params) => {
  const doc = documents.get(params.textDocument.uri);
  if (doc) {
    return getCompletionsFor(doc, params.position);
  }
});

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(onCompletionResolve);

// Goto definition
// textDocument/definitio
connection.onDefinition((params, token, workDoneProgress, resultProgress) => {
  const doc = documents.get(params.textDocument.uri);
  if (doc) {
    return getDeclarationFor(doc, params.position);
  }
});

connection.onHover((params, token) => {
  service.getQuickInfoAtPosition()
})

// connection.onDocumentLinks((params: DocumentLinkParams) => {
//   const doc = documents.get(params.textDocument.uri);
//   if (doc) {
//     return getDocumentLinksFor(doc);
//   }
// });

// connection.onDocumentLinkResolve(onLinkResolve);

connection.onReferences((params) => {
  const doc = documents.get(params.textDocument.uri);
  if (doc) {
    return getReferencesFor(doc, params.position);
  }
});

connection.onDocumentSymbol((params) => {
  const doc = documents.get(params.textDocument.uri);
  if (doc) {
    return getDocumentSymbols(doc);
  }
});

// The example settings
interface ExampleSettings {
  maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
  if (hasConfigurationCapability) {
    // Reset all cached document settings
    documentSettings.clear();
  } else {
    globalSettings = <ExampleSettings>(
      (change.settings.languageServerExample || defaultSettings)
    );
  }

  // Revalidate all open text documents
  documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
  if (!hasConfigurationCapability) {
    return Promise.resolve(globalSettings);
  }
  let result = documentSettings.get(resource);
  if (!result) {
    result = connection.workspace.getConfiguration({
      scopeUri: resource,
      section: 'languageServerExample'
    });
    documentSettings.set(resource, result);
  }
  return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
  documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
  validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
  const diagnostics: Diagnostic[] = [];

  try {
    parseDocument(textDocument);
  } catch (e: any) {
    console.log(e);
    const [_, line, character, message] = e.message.match(/^[^:]*:(\d+):(\d+)\s*(.*)$/s);
    diagnostics.push({
      range: {
        start: {
          line: line - 1,
          character: character - 1
        },
        end: {
          line: line - 1,
          character: character
        }
      },
      severity: DiagnosticSeverity.Error,
      message: message,
      source: "civet"
    });
  }

  // Send the computed diagnostics to VSCode.
  connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
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
