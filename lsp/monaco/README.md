# Civet Monaco

Browser-side helpers for wiring Monaco to the Civet browser LSP worker:
Monaco language registration, token, and provider helpers.
The Civet docs [Playground](https://civet.dev/playground) uses this setup for
diagnostics, hover, completion, definitions, and semantic tokens.

## Usage

```ts
import * as monaco from 'monaco-editor'
import {
  registerCivetLanguage,
  registerCivetLspProviders,
  registerCivetMonarchTokens,
} from '@danielx/civet-monaco'
import {
  createCivetLspWorker,
  createCivetLspWorkerClient,
} from '@danielx/civet-language-server/worker'

registerCivetLanguage(monaco)

// Optional lightweight syntax highlighting. Use this if you do not already
// provide TextMate/Shiki or another Monaco tokens provider for Civet.
registerCivetMonarchTokens(monaco)

const model = monaco.editor.createModel(
  "console.log 'Hello Civet!'",
  'civet',
  monaco.Uri.parse('file:///workspace/index.civet'),
)

const worker = createCivetLspWorker({
  civetUrl: new URL('@danielx/civet/browser.min', import.meta.url),
  serverUrl: new URL('@danielx/civet-language-server/browser', import.meta.url),
})

const uri = model.uri.toString()
const client = createCivetLspWorkerClient({ worker, uri })
await client.start(model.getValue())

registerCivetLspProviders(monaco, {
  uri,
  model,
  client,
})
```

See the
[Playground source code](../../civet.dev/.vitepress/components/Playground.vue)
for a working example.

### Detailed Provider Client

`registerCivetLspProviders` takes a small adapter object. Use this shape if
you already have a JSON-RPC/LSP client and want explicit control over each
request:

```ts
const uri = model.uri.toString()

registerCivetLspProviders(monaco, {
  uri,
  model,
  client: {
    semanticTokensFull: () => jsonRpc.sendRequest('textDocument/semanticTokens/full', {
      textDocument: { uri },
    }),
    hover: (position) => jsonRpc.sendRequest('textDocument/hover', {
      textDocument: { uri },
      position,
    }),
    definition: (position) => jsonRpc.sendRequest('textDocument/definition', {
      textDocument: { uri },
      position,
    }),
    completion: (params) => jsonRpc.sendRequest('textDocument/completion', {
      textDocument: { uri },
      ...params,
    }),
    completionResolve: (item) => jsonRpc.sendRequest('completionItem/resolve', item),
  },
})
```

### Notes

The browser LSP worker loads `civetUrl` with `importScripts`, so it should point
at `@danielx/civet/browser.min` or another script that installs
`globalThis.Civet` in the worker.

`registerCivetLspProviders` is a convenience wrapper around the individual
`registerCivetSemanticTokens`, `registerCivetHoverProvider`,
`registerCivetCompletionProvider`, and `registerCivetDefinitionProvider`
exports.
