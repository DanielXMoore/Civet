import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  TextDocumentSyncKind,
  InitializeResult,
  MarkupKind,
  TextDocumentIdentifier,
  HandlerResult,
  DocumentSymbol,
} from 'vscode-languageserver';

import {
  TextDocument
} from 'vscode-languageserver-textdocument';

import ts from "typescript"

import TSService from './lib/typescript-service';
import * as Previewer from "./lib/previewer";
import { convertNavTree } from './lib/util';
import assert from "assert"
// import { toCompletionItemKind } from './util';

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

  const doc = documents.get(textDocument.uri);
  assert(doc)

  // Make sure doc is in ts-server
  service.host.addPath(sourcePath)

  // TODO: Map input hover position into output TS position

  const info = service.getQuickInfoAtPosition(sourcePath, doc.offsetAt(position))
  if (!info) return;

  const display = ts.displayPartsToString(info.displayParts);
  // TODO: Replace Previewer
  const documentation = Previewer.plain(ts.displayPartsToString(info.documentation));

  // TODO: position source mapping

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
connection.onCompletion(() => {
  // ({ textDocument, position, context }) => {
  // const doc = documents.get(textDocument.uri);
  // console.log("completion", textDocument, position)
  // if (!doc) return;

  // const sourcePath = doc.uri.replace(rootDir, "")
  // const completionInfo = service.getCompletionsAtPosition(sourcePath, doc.offsetAt(position), {})

  // return completionInfo?.entries.map((e) => ({
  //   label: e.name,
  //   kind: 1,
  // }));

  return [{
    label: "hi",
    kind: 1
  }]
});

// TODO
connection.onCompletionResolve(() => {
  return {
    label: "ahopy",
    documentation: "yolo"
  }
})

// TODO
connection.onDocumentSymbol(({ textDocument }) => {
  const sourcePath = documentToSourcePath(textDocument);
  console.log("document symbol", textDocument, sourcePath)
  if (!sourcePath) return undefined

  // Make sure doc is in ts-server
  service.host.addPath(sourcePath)

  // return [{
  //   name: "test",
  //   kind: 10,
  //   location: {
  //     uri: textDocument.uri,
  //     range: {
  //       start: {
  //         line: 0,
  //         character: 0
  //       },
  //       end: {
  //         line: 0,
  //         character: 10
  //       }
  //     }
  //   }
  // }]

  const items: DocumentSymbol[] = []
  const navTree = service.getNavigationTree(sourcePath)
  console.dir(navTree)
  convertNavTree(textDocument.uri, items, navTree)

  return items
})

// TODO
documents.onDidClose(e => {

});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
  // validateTextDocument(change.document);
});

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
  const doc = documents.get(textDocument.uri);
  return doc?.uri.replace(rootDir, "")
}
