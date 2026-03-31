# Yarn Workspaces Migration Design

**Date:** 2026-03-30
**Status:** Approved
**Scope:** Streamline dependencies across `lsp/`, `integration/`, and example projects using Yarn Classic workspaces

## Goals

- Sub-packages always resolve `@danielx/civet` to the local workspace package, eliminating stale version pins
- Deduplicate `node_modules` across all packages via hoisting
- Single root `yarn.lock` so dependabot opens one PR per external dep bump instead of one per sub-package
- Cross-workspace commands (`yarn workspace <name> <script>`) as a free side-effect

## Out of Scope

- Upgrading to Yarn Berry (see `docs/ponder/upgrade-yarn.md`)
- Changes to `civet.dev/` (no `package.json`, built via root `docs:*` scripts)
- Root `scripts` convenience aliases for workspace commands

## Workspace Members

Add to root `package.json`:

```json
"workspaces": [
  "lsp",
  "integration/eslint",
  "integration/jest",
  "integration/gulp",
  "integration/eslint/example",
  "integration/unplugin-examples/*"
]
```

All directories containing a `package.json` are included. `civet.dev/` has no `package.json` and is excluded.

## Dependency Version Changes

In every workspace member, change `devDependencies["@danielx/civet"]` to `"*"`:

- `lsp/package.json`: `"0.11.4"` → `"*"`
- `integration/eslint/package.json`: `"^0.9.4"` → `"*"`
- `integration/jest/package.json`: `"0.7.17"` → `"*"`
- `integration/gulp/package.json`: `"^0.7.4"` → `"*"`
- `integration/eslint/example/package.json`: `@danielx/civet: "^0.9.4"` → `"*"`, and `eslint-plugin-civet: "^0.0.5"` → `"*"` (also a local workspace package)
- `integration/unplugin-examples/*/package.json`: update any `@danielx/civet` devDep

`peerDependencies` version ranges are left untouched — they express the published package's compatibility contract for users, not internal resolution.

Yarn Classic resolves a dep to the local workspace package when the version range matches the workspace package's version. `"*"` always matches, ensuring local resolution and preventing dependabot from opening PRs to bump these entries.

## Lockfile

- Delete `lsp/yarn.lock`
- Single `yarn.lock` at the repo root
- All installs: `yarn install` from root

## LSP Build Script

In `lsp/build/build.sh`, change:

```bash
vsce package --yarn
```

to:

```bash
vsce package --no-dependencies
```

**Rationale:** The production esbuild bundles (`dist/extension.js`, `dist/server.js`) include all runtime deps (`@danielx/civet`, `typescript`, `vscode-language*`) — only `vscode` is marked external (provided by VS Code itself). `vsce` only needs to zip `dist/` and metadata; it does not need to run an install step. The `--no-dependencies` flag makes this explicit.

Development builds (`NODE_ENV=development`) mark those deps as external and rely on Node's module resolution, which traverses up from `lsp/` to the root `node_modules` — this works correctly with workspace hoisting.

## Hoisting Behavior

Yarn Classic hoists compatible dep versions to root `node_modules` and creates symlinks for workspace packages. If two workspace members require incompatible versions of the same dep (e.g., different bundler major versions across `unplugin-examples/`), Yarn places the conflicting version in the package's local `node_modules` automatically — no manual configuration needed.

## Dependabot

With a single root `yarn.lock`:
- Dependabot targets one file for the entire repo
- External deps shared across packages (e.g., `esbuild`, `typescript`, `mocha`) appear once in the lockfile; one bump PR covers all usages
- Internal `@danielx/civet: "*"` devDeps are invisible to dependabot (no version to bump)

## Cross-Workspace Commands

Available immediately with no extra config:

```bash
yarn workspace lsp build          # run a script in one workspace
yarn workspace lsp test
yarn workspaces run test          # run test in all workspaces that define it
yarn workspaces info              # show workspace dependency graph
```
