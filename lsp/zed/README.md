# Civet Zed Extension

Zed editor extension that registers the Civet and Hera languages and launches the Civet LSP server.

## Features

- Syntax highlighting via the tree-sitter grammars in `../tree-sitter/` (Civet) and `../tree-sitter-hera/` (`.hera` grammar files)
- LSP support via `civet-lsp` for both `.civet` and `.hera` (diagnostics, completions, hover, go-to-definition), plus grammar-level navigation for `.hera` rules

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

After any changes to `../tree-sitter/` or `../tree-sitter-hera/`:

1. Commit the changes
2. Update `rev` in `extension.toml` to the new commit SHA
3. Delete `grammars/` so Zed re-fetches: `rm -rf lsp/zed/grammars/`
4. Reinstall the dev extension in Zed
