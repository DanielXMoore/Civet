# pnpm Workspaces Migration

**Date:** 2026-03-31
**Branch:** `feat/pnpm-workspaces` off `main`

## Problem

Yarn 1 Classic has two blockers for this repo:

1. **`private: true` required on root** — prevents `yarn publish` for `@danielx/civet`
2. **Circular workspace symlink** — yarn 1 fails when a child workspace declares `"@danielx/civet": "*"` because it tries to symlink back to the repo root, which is circular

pnpm solves both: it does not require `private: true` on the root, and its virtual store (`.pnpm/`) links packages by name without circular symlinks.

## Approach

Full migration from yarn 1 to pnpm with strict (non-flat) node_modules. Child packages update their `@danielx/civet` dependency to `workspace:*`, resolving to the local build rather than a pinned npm version.

## Changes

### Root `package.json`

- Update `"packageManager"` to `"pnpm@X.Y.Z"` (latest stable at migration time)
- Replace `yarn` → `pnpm` in all scripts:
  - `build:self`
  - `docs:dev`, `docs:build`, `docs:preview`
  - `prepublishOnly`
  - `test:self`
- No `"private"` field needed
- No `"workspaces"` field (moved to `pnpm-workspace.yaml`)

### New `pnpm-workspace.yaml`

```yaml
packages:
  - lsp
  - integration/eslint
  - integration/jest
  - integration/gulp
  - integration/eslint/example
  - integration/unplugin-examples/*
```

### Child packages — `@danielx/civet` dep

| Package | Before | After |
|---|---|---|
| `integration/eslint` | `"^0.9.4"` | `"workspace:*"` |
| `integration/jest` | `"0.7.17"` | `"workspace:*"` |
| `integration/gulp` | `"^0.7.4"` | `"workspace:*"` |
| `integration/eslint/example` | `"^0.9.4"` | `"workspace:*"` |
| `integration/unplugin-examples/*` | `"latest"` | `"workspace:*"` |

The `unplugin-examples` packages also need `"name"` and `"version": "0.0.0"` fields added for pnpm workspace membership. `integration/eslint/example` already has both.

### Child packages — scripts

| Package | Change |
|---|---|
| `integration/eslint` | `prepublishOnly: yarn build` → `pnpm build` |
| `integration/jest` | `test: yarn prepare && ...` → `pnpm prepare && ...` |
| `lsp` | `package: vsce package --yarn` → `vsce package --no-yarn` |

### Lockfile

- Delete root `yarn.lock`
- Run `pnpm install` to generate `pnpm-lock.yaml`

## Why pnpm over yarn 1 / Yarn Berry

- **vs yarn 1:** No `private: true` requirement; workspace protocol resolves root package correctly via `.pnpm/` virtual store
- **vs Yarn Berry:** Direct migration without PnP complexity; pnpm is now the more widely adopted strict workspace tool

## Verification

After `pnpm install`:

1. `pnpm build` from root — confirm build succeeds
2. `pnpm test` from root — confirm tests pass
3. Fix any implicit deps surfaced by pnpm's strict node_modules

## Future

`pnpm publish` from the root publishes `@danielx/civet` directly — no workarounds needed. This is a clean foundation for CI-based release automation.
