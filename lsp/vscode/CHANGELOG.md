# Civet VS Code Extension Changelog

## 0.3.36 (2026-05-22)
* Grammar: align `const`/`let`/`var` and template-expression scopes with JS [[#2094](https://github.com/DanielXMoore/Civet/pull/2094)]
* Add `vscode-tmgrammar-test` harness for TextMate grammar regressions

## 0.3.35 (2026-05-18)
* LSP: implement `workspace/symbol` [[#2049](https://github.com/DanielXMoore/Civet/pull/2049)]
* LSP: skip semantic tokens in unmapped TS prelude code [[#2070](https://github.com/DanielXMoore/Civet/pull/2070)]
* LSP: emit semantic tokens for import binding names [[#2071](https://github.com/DanielXMoore/Civet/pull/2071)]
* LSP: fix missing line/column info by unwrapping `ParseErrors` [[#2075](https://github.com/DanielXMoore/Civet/pull/2075)]
* LSP: warn + narrow scope when project has no `tsconfig.json` [[#2078](https://github.com/DanielXMoore/Civet/pull/2078)]
* LSP: add handlers for `signatureHelp`, `prepareRename`, `documentHighlight`, `typeDefinition`, `implementation`, `foldingRange`, `selectionRange`, `linkedEditingRange` [[#2069](https://github.com/DanielXMoore/Civet/pull/2069)]

## 0.3.34 (2026-05-08)
* VS Code: support `lang="civet"` in Svelte components [[#2021](https://github.com/DanielXMoore/Civet/pull/2021)]
* VS Code: basic syntax highlighting for `type` and `interface` [[#2022](https://github.com/DanielXMoore/Civet/pull/2022)]
* LSP: fix `@` shorthand incorrectly completing as `@this.member` [[#2032](https://github.com/DanielXMoore/Civet/pull/2032)]
* LSP: fix `@` completion in implicit-return context [[#2034](https://github.com/DanielXMoore/Civet/pull/2034)]
* LSP: auto-indent on Enter for Civet block-openers [[#2043](https://github.com/DanielXMoore/Civet/pull/2043)]
* Monaco and browser LSP support; LSP in the Playground [[#2044](https://github.com/DanielXMoore/Civet/pull/2044)]
  * **Breaking** for direct LSP users (e.g. Neovim): use `dist/node.js` instead of `dist/server.js`.

## 0.3.33 (2026-04-25)
* Auto-publish to VS Code Marketplace and Open VSX on version bump [[#1963](https://github.com/DanielXMoore/Civet/pull/1963)]
* Extract LSP into standalone `@danielx/civet-language-server` package [[#1950](https://github.com/DanielXMoore/Civet/pull/1950)]
* LSP: auto-import when selecting completions [[#1956](https://github.com/DanielXMoore/Civet/pull/1956)]
* LSP: TypeScript-classifier-based semantic tokens [[#1881](https://github.com/DanielXMoore/Civet/pull/1881)]
* LSP: semantic tokens for comments, fixing `coffeeComment` highlighting [[#2011](https://github.com/DanielXMoore/Civet/pull/2011)]
* LSP: auto-reload `TSService` when `tsconfig.json` changes [[#1965](https://github.com/DanielXMoore/Civet/pull/1965)]
* LSP: clear stale diagnostics on document close/delete [[#1980](https://github.com/DanielXMoore/Civet/pull/1980)]
* Bump VS Code engine and Node requirements (Node ≥ 23, VS Code ≥ 1.115)

## 0.3.30 (2026-03-07)
* Use `vscode-uri` to canonicalize file paths consistently across platforms
* Improve LSP behavior on Windows

## 0.3.29 (2025-12-10)
* Update `@types/node` and refactor `setTimeout` import for compatibility
* New setting: `civet.langServer.includeTypescript` controls whether the
  LSP attaches to `.js`/`.ts` files (set to `false` to avoid duplicate
  definitions when another TypeScript server is active)
* TextMate grammar refinements driven by configuration

## 0.3.28 (2025-02-24)
* Set extension category for VS Code marketplace listing
* LSP: async config loads so restarting `tsserver` no longer surfaces transient `parseOptions` errors

## 0.3.27 (2024-12-31)
* Update bundled TypeScript

## 0.3.26 (2024-11-11)
* Maintenance release

## 0.3.25 (2024-11-01)
* Maintenance release

## 0.3.24 (2024-10-30)
* Maintenance release

## 0.3.23 (2024-10-26)
* Maintenance release

## 0.3.22 (2024-10-25)
* Maintenance release

## 0.3.21 (2024-10-16)
* Maintenance release

## 0.3.20 (2024-10-16)
* Maintenance release

## 0.3.19 (2024-10-06)
* New Civet icon
* Dependency updates (mocha, etc.)

## 0.3.17 (2024-06-26)
* LSP improvements

## 0.3.16 (2024-05-28)
* LSP improvements

## 0.3.15 (2024-05-07)
* LSP improvements

## 0.3.14 (2024-02-26)
* LSP improvements

## 0.3.13 (2024-02-22)
* LSP improvements

## 0.3.7 (2023-07-30)
* LSP improvements

## 0.3.6 (2023-02-04)
* LSP improvements

## 0.3.3 (2022-12-29)
* LSP improvements

## 0.3.0 (2022-12-13)
* Initial 0.3 release: standalone Civet Language Server backing the VS Code extension
