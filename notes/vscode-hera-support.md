# VSCode: `.hera` highlighting + LSP support

Add Hera language support to the Civet VSCode extension: TextMate syntax
highlighting and LSP routing for `.hera` files. **Deferred** — PR #2127
(`lsp-hera-grammar-level`) scoped VSCode out (its notes list the markdown
```` ```hera ```` injection as a follow-up). Tracked here so it isn't lost.

## Why

PR #2127 added a Hera-aware LSP server path and a **tree-sitter** grammar for
Zed. VSCode highlights via **TextMate grammars**, not tree-sitter, so none of
that grammar work reaches VSCode, and the extension doesn't register Hera at
all. A `.hera` file in VSCode today opens as plaintext with no LSP attached.

## Current state in `lsp/vscode`

- **No `hera` language.** `contributes.languages` registers only `civet`, so
  `.hera` isn't associated with any language.
- **No `source.hera` grammar.** `syntaxes/codeblock.json` already *references*
  `source.hera` for markdown ```` ```hera ```` blocks, but the scope is
  undefined — a dangling include that currently does nothing.
- **No LSP routing.** `source/extension.civet` builds `docSelector` from
  `civet` (+ optional `javascript`/`typescript`); no `hera` entry, so the
  server (which already handles `.hera`) never attaches in VSCode.
- **No activation.** `activationEvents` has no `onLanguage:hera`.

## Ready-made asset

The standalone Hera extension already ships a TextMate grammar:

- `~/apps/Hera/lsp/syntaxes/hera.json` — scope `source.hera`
- `~/apps/Hera/lsp/syntaxes/hera-configuration.json` — language config

This is the same split Civet already maintains: tree-sitter for Zed,
TextMate for VSCode.

## Work items

Highlighting is items 1–4; LSP features are item 5.

1. Vendor `hera.json` + `hera-configuration.json` into `lsp/vscode/syntaxes/`.
2. `package.json` → `contributes.languages`: add
   `{ id: "hera", extensions: [".hera"], configuration: "./syntaxes/hera-configuration.json" }`.
3. `package.json` → `contributes.grammars`: add
   `{ language: "hera", scopeName: "source.hera", path: "./syntaxes/hera.json" }`.
   Also un-dangles the existing markdown ```` ```hera ```` injection in
   `codeblock.json`.
4. `package.json` → `activationEvents`: add `onLanguage:hera`.
5. `source/extension.civet`: add `{ scheme: 'file', language: 'hera' }` to
   `docSelector` so the LSP attaches (go-to-definition, references, hover,
   outline, completion — the grammar-level features from #2127).

## Verify before porting

- Does `~/apps/Hera/lsp/syntaxes/hera.json` inject `source.civet` into handler
  bodies / fenced code? The tree-sitter injection does **not** carry over —
  TextMate needs its own embedding to colour embedded Civet. If absent, decide
  whether to add it or ship grammar-only highlighting first.
- Confirm the Hera tmLanguage is current/good enough to vendor (it predates
  recent Hera syntax changes?).
- Add an e2e smoke test under `lsp/vscode/e2e/` that opens a `.hera` file and
  asserts the LSP attaches (mirrors existing `.civet` e2e tests).

## Tracking

- Origin: PR #2127 review ("anything for the VSCode extension / highlighting?").
- Related deferral: [`hera-ast-comments.md`](hera-ast-comments.md) (Hera AST
  leading-comment association, also pending).
