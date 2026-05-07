# Civet Zed Extension

Zed editor extension that registers the Civet language and launches the Civet LSP server.

## Features

- Syntax highlighting via the tree-sitter grammar in `../tree-sitter/`
- LSP support via `civet-lsp` (diagnostics, completions, hover, go-to-definition)

## Prerequisites

`civet-lsp` must be on your PATH. The easiest way:

```bash
# Add to ~/.bashrc / ~/.zshrc
export PATH="/path/to/Civet/lsp/server/bin:$PATH"
```

Or install globally:

```bash
npm install -g @danielx/civet-language-server
```

## Installing as a dev extension

1. In Zed: **Extensions → Install Dev Extension**
2. Select this directory (`lsp/zed/`)

## Updating the grammar

After any changes to `../tree-sitter/`:

1. Commit the changes
2. Update `rev` in `extension.toml` to the new commit SHA
3. Delete `grammars/` so Zed re-fetches: `rm -rf lsp/zed/grammars/`
4. Reinstall the dev extension in Zed
