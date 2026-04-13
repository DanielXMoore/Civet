# Contributing to the Civet LSP

## Setup

Open `civet/lsp-vscode/` in another VSCode window.

```bash
# From the repository root (pnpm workspace)
pnpm install
```

## Overview

This repo is split into two packages:

- `lsp-server/` — standalone, editor-agnostic Language Server
  - `source/server.civet` — LSP event handlers, delegates to TypeScriptService
  - `source/lib/typescript-service.civet` — TSServer wrapper with Civet transpilation support, handles module resolution
  - `source/lib/previewer.civet`, `util.civet`, `textRendering.civet` — supporting utilities
- `lsp-vscode/` — VSCode extension wrapper
  - `source/extension.civet` — launches the language server, registers commands and languages

## Trying out changes

- Run and Debug -> Client + Server
- Open `civet/lsp-server/integration/project-test/`
- Breakpoints in editor should work
- Press `` Ctrl + ` `` to view extension console logs in Output by selecting "Civet Language Server"

## Testing

```bash
# Unit tests (lsp-server)
cd lsp-server && pnpm test

# E2E tests (lsp-vscode)
cd lsp-vscode && pnpm test

# Unified coverage report
cd lsp-vscode && pnpm test:coverage
```
