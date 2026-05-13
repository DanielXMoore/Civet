# Civet Language Server

Standalone, editor-agnostic Language Server Protocol implementation for Civet.

## Install

```bash
npm install -g @danielx/civet-language-server
```

For repository development:

```bash
pnpm -C lsp/server build
pnpm -C lsp/server test
```

## Command Line

The package installs `civet-lsp`, which speaks LSP over stdio:

```bash
civet-lsp --stdio
```

Use this from editors or tools that can launch a standard LSP server process.

## Browser Worker

The package also publishes browser-oriented entries for [Monaco](../monaco)
or other in-browser clients:

```ts
import { createCivetLspWorker } from '@danielx/civet-language-server/worker'

const worker = createCivetLspWorker({
  civetUrl: new URL('@danielx/civet/browser.min', import.meta.url),
  serverUrl: new URL('@danielx/civet-language-server/browser', import.meta.url),
})
```

`civetUrl` should point to a browser build that installs `globalThis.Civet` in
the worker. `serverUrl` should point to `@danielx/civet-language-server/browser`
or an equivalent browser bundle of this package.

For a working example, see the [Playground](https://civet.dev/playground)
and its [source code](../../civet.dev/.vitepress/components/Playground.vue).

## Package Entries

| Entry | Purpose |
|-------|---------|
| `@danielx/civet-language-server` | Conditional default entry: browser builds use the browser worker server; Node uses the Node stdio server |
| `@danielx/civet-language-server/node` | Explicit Node stdio server entry |
| `@danielx/civet-language-server/browser` | Explicit browser worker LSP server entry |
| `@danielx/civet-language-server/worker` | Browser helper for creating and talking to the worker |

Use `/node` or `/browser` when a bundler's package conditions are not the
runtime you want. The command-line `civet-lsp` wrapper always launches the Node
entry.

## Source Layout

| Path | Purpose |
|------|---------|
| `source/server.civet` | Shared LSP server implementation |
| `source/node.civet` | Node stdio entrypoint |
| `source/browser.civet` | Browser worker entrypoint |
| `source/worker.civet` | Browser-side worker helpers |
