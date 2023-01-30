# Contributing to the Civet LSP

## Setup

Open `civet/lsp/` in another VSCode window.

```bash
yarn
```

## Overview

- `source/lib/typescript-service.mts`
  - TSServer wrapper with Civet transpilation support.
  - Handles module resolution to transpiled files.
- `source/extension.civet`
  - VSCode Extension client
  - Adds commands
  - Registers languages
- `source/server.mts`
  - VSCode Extension language server
  - Handles LSP events, delegates to TypeScriptService to respond.

## Trying out changes

- Run and Debug -> Launch Extension
- Open `civet/lsp/integration/project-test/`
- Press `` Ctrl + ` `` View extension console logs in Output by selecting "Civet Language Server"

## TODO: describe attaching the debugger
