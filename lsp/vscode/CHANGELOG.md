# Civet VS Code Extension Changelog

> Pre-0.3.33 releases were published from the `lsp/` directory (which
> contained the combined extension + language server). From 2026-04-13
> the layout was reorganized to separate packages: `lsp/server/` for the
> language server, `lsp/vscode/` for this extension, `lsp/monaco/`,
> `lsp/zed/`, and `lsp/tree-sitter/`.

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
* Extract language server into standalone `@danielx/civet-language-server` package [[#1950](https://github.com/DanielXMoore/Civet/pull/1950)]
* Reorganize repository: extension moves from `lsp/` → `lsp/vscode/`
* LSP: TypeScript-classifier-based semantic tokens [[#1881](https://github.com/DanielXMoore/Civet/pull/1881)]
* LSP: semantic tokens for comments, fixing `coffeeComment` highlighting [[#2011](https://github.com/DanielXMoore/Civet/pull/2011)]
* LSP: auto-import when selecting completions [[#1956](https://github.com/DanielXMoore/Civet/pull/1956)]
* LSP: auto-reload `TSService` when `tsconfig.json` changes [[#1965](https://github.com/DanielXMoore/Civet/pull/1965)]
* LSP: clear stale diagnostics on document close/delete [[#1980](https://github.com/DanielXMoore/Civet/pull/1980)]
* Bump VS Code engine and Node requirements (Node ≥ 23, VS Code ≥ 1.115)

## 0.3.30 (2026-03-07)

> Last release published from the legacy `lsp/` directory.

* LSP: use `vscode-uri` to canonicalize file paths consistently across platforms
* LSP: import completion for module exports, TypeScript path aliases, and relative paths
* LSP: autocomplete closing quote, fix quote closing and space triggering
* LSP: handle TypeScript service crashes gracefully
* LSP: completion at end of file
* Improve import/export keyword highlighting
* Bump VS Code and Node engine requirements

## 0.3.29 (2025-12-10)
* LSP: rename-symbol support
* LSP: new setting `civet.langServer.includeTypescript` (default `true`) — set to `false` to prevent duplicate definitions when another TypeScript server is attached to `.js`/`.ts` files
* LSP: refactor `executeQueue` to group document updates by project, reducing conflicts
* LSP: async `TSService` so restarting `tsserver` no longer surfaces transient errors
* LSP: ensure immediate diagnostic updates for dependent files on change
* TextMate grammar re-applies on config change without needing a reload

## 0.3.28 (2025-02-24)
* LSP: fix opening files without a workspace
* Set extension category for VS Code marketplace listing
* LSP: async config loads to eliminate startup `parseOptions` errors
* Document how to use the VS Code plugin

## 0.3.27 (2024-12-31)
* Update bundled TypeScript
* Preserve `SourceMap` class through the Civet worker

## 0.3.26 (2024-11-11)
* Fix autocompletion details error message
* Highlight import expression and module reference for `export`/`import`
* Numeric syntax allows underscore separators (e.g. `9_999_999`)

## 0.3.25 (2024-11-01)
* LSP completions show details and documentation

## 0.3.24 (2024-10-30)
* LSP restarts when `package.json` or Civet config file changes
* Fix `WithResolver` return type

## 0.3.23 (2024-10-26)
* Remove completion `triggerCharacters` (didn't tolerate fault-tolerant compile)

## 0.3.22 (2024-10-25)
* Fix completions and hover quickinfo regressions
* Fix `tsconfig.json` naming issue
* Wait for document update across all hooks
* Show correct LSP version number in logs
* Fix CLI with complex `NODE_OPTIONS`

## 0.3.21 (2024-10-16)
* Add `skipLibCheck` in lib `tsconfig`

## 0.3.20 (2024-10-16)
* Improve project root detection in LSP

## 0.3.19 (2024-10-06)
* New Civet extension icon
* Fix unplugin `parseOptions`; fix ESLint plugin on Node 22
* Stop registering for `.coffee` files
* Update dependencies

## 0.3.17 (2024-06-26)
* Upgrade bundled TypeScript

## 0.3.16 (2024-05-28)
* Show diagnostics for nonfatal Civet parse errors with location info in the editor
* Fix source mapping for Civet parse errors
* Update Civet and TypeScript dependencies

## 0.3.15 (2024-05-07)
* Add LSP warning when running against a dev build of Civet
* Improve log feedback in VS Code plugin
* `sync: true` Civet API option

## 0.3.14 (2024-02-26)
* Improve source mapping

## 0.3.13 (2024-02-22)
* Improve forward mapping (fixes #1053)
* Experimental Hera types in Civet LSP
* Fix non-transpiled files not being added to the path map (so they refresh on update)
* Snapshot model similar to Vue language tools
* Report error nodes in LSP
* Richer completion info
* Support importing directories with `index.civet`

## 0.3.11 (2024-01-16)
* Support TypeScript `paths` alias
* Add angle brackets to surrounding pairs
* Bracket/comments matching
* Reset service when `tsconfig` changes (fixes #72)
* Implement `references` (Find All References) [[#801](https://github.com/DanielXMoore/Civet/pull/801)]

## 0.3.7 (2023-07-30)
* Maintenance release

## 0.3.6 (2023-02-04)
* Maintenance release

## 0.3.3 (2022-12-29)
* Maintenance release

## 0.3.0 (2022-12-13)

> Initial 0.3 release of the standalone Civet Language Server backing the
> VS Code extension. Earlier exploratory commits trace back to the first
> "Starting vscode extension" commit on 2022-08-23.

* Standalone Civet Language Server
* Civet syntax highlighting (originally adapted from CoffeeScript)
* Basic hover and completion via the TypeScript service
