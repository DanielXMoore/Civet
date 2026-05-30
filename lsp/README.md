# Civet LSP

Language server and editor integrations for Civet.

## Packages

| Directory | Package | Purpose |
|-----------|---------|---------|
| `server/` | `@danielx/civet-language-server` | Standalone, editor-agnostic Language Server |
| `monaco/` | `@danielx/civet-monaco` | Monaco language registration, token, and LSP provider helpers |
| `vscode/` | `@danielx/civet-vscode` | VS Code extension |
| `sublime/` | — | Sublime Text package |
| `zed/` | — | Zed editor extension (Rust/WASM) |
| `tree-sitter/` | — | Tree-sitter grammar for Civet syntax highlighting |
| `tree-sitter-hera/` | — | Tree-sitter grammar for `.hera` syntax highlighting |

## Languages

The server transpiles and serves `.civet` files, and additionally answers
grammar-level requests — go-to-definition, references, document symbols,
completions, and hover — for Hera grammar files (`.hera`), parsed directly with
the project's `@danielx/hera` rather than through the composed sourcemap. Zed
routes `.hera` to the server and highlights it via `tree-sitter-hera/`.

## Setup

```bash
# From the repository root
pnpm install
pnpm -C lsp/server build
pnpm -C lsp/monaco build
```

## Editor Support

- **VS Code** — install from the [marketplace](https://marketplace.visualstudio.com/items?itemName=DanielX.civet), or see `vscode/` to develop locally
- **Monaco** — use `@danielx/civet-monaco` with `@danielx/civet-language-server/browser`; see `monaco/`
- **Sublime Text** — see `sublime/`
- **Zed** — see `zed/`
- **Neovim / other LSP clients** — run `civet-lsp --stdio`; see [integrations docs](https://civet.dev/integrations)
