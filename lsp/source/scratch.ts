
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
