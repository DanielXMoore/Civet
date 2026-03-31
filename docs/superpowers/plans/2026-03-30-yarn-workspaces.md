# Yarn Workspaces Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure Yarn Classic workspaces at the repo root so all sub-packages resolve `@danielx/civet` to the local package, share a single `yarn.lock`, and support `yarn workspace <name> <script>` commands.

**Architecture:** Add a `"workspaces"` array to the root `package.json` listing all sub-packages. Pin all internal `@danielx/civet` devDeps to `"*"` so Yarn resolves them locally. Delete `lsp/yarn.lock`. Fix two path-dependent references in `lsp/` that break under hoisting. Run `yarn install` from root to produce a unified `yarn.lock`.

**Tech Stack:** Yarn Classic 1.22, Node.js module resolution, esbuild, vsce

---

## File Map

| File | Change |
|---|---|
| `package.json` | Add `"workspaces"` array |
| `lsp/package.json` | `@danielx/civet: "*"`, `vsce package --no-dependencies` |
| `lsp/build/build.sh` | Fix `node_modules/typescript` path to use Node resolver |
| `lsp/yarn.lock` | Delete |
| `integration/eslint/package.json` | `@danielx/civet: "*"` |
| `integration/jest/package.json` | `@danielx/civet: "*"` |
| `integration/gulp/package.json` | `@danielx/civet: "*"` |
| `integration/eslint/example/package.json` | `@danielx/civet: "*"`, `eslint-plugin-civet: "*"` |
| `integration/unplugin-examples/*/package.json` (×9) | Add `"name"` where missing, `@danielx/civet: "*"` |

---

### Task 1: Add workspaces to root `package.json`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add `"workspaces"` field**

In `package.json`, add after the `"packageManager"` line (before the closing `}`). The existing file has no `"workspaces"` key.

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

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add yarn workspaces configuration"
```

---

### Task 2: Add missing `"name"` fields to unnamed unplugin-examples

**Files:**
- Modify: `integration/unplugin-examples/esbuild/package.json`
- Modify: `integration/unplugin-examples/rolldown/package.json`
- Modify: `integration/unplugin-examples/rollup/package.json`
- Modify: `integration/unplugin-examples/vite-lib/package.json`
- Modify: `integration/unplugin-examples/vite/package.json`
- Modify: `integration/unplugin-examples/webpack/package.json`

Yarn workspaces requires every member to have a unique `"name"`. These six files currently have none.

- [ ] **Step 1: Add `"name"` to `integration/unplugin-examples/esbuild/package.json`**

Insert as the first key:

```json
{
  "name": "civet-example-esbuild",
  "type": "module",
  ...
}
```

- [ ] **Step 2: Add `"name"` to `integration/unplugin-examples/rolldown/package.json`**

```json
{
  "name": "civet-example-rolldown",
  "type": "module",
  ...
}
```

- [ ] **Step 3: Add `"name"` to `integration/unplugin-examples/rollup/package.json`**

```json
{
  "name": "civet-example-rollup",
  "type": "module",
  ...
}
```

- [ ] **Step 4: Add `"name"` to `integration/unplugin-examples/vite-lib/package.json`**

```json
{
  "name": "civet-example-vite-lib",
  ...
}
```

- [ ] **Step 5: Add `"name"` to `integration/unplugin-examples/vite/package.json`**

```json
{
  "name": "civet-example-vite",
  ...
}
```

- [ ] **Step 6: Add `"name"` to `integration/unplugin-examples/webpack/package.json`**

```json
{
  "name": "civet-example-webpack",
  ...
}
```

- [ ] **Step 7: Verify all workspace members now have unique names**

```bash
node -e "
const glob = require('path');
const fs = require('fs');
const files = [
  'package.json',
  'lsp/package.json',
  'integration/eslint/package.json',
  'integration/jest/package.json',
  'integration/gulp/package.json',
  'integration/eslint/example/package.json',
  ...require('fs').readdirSync('integration/unplugin-examples').map(d => \`integration/unplugin-examples/\${d}/package.json\`)
].filter(f => fs.existsSync(f));
const names = files.map(f => JSON.parse(fs.readFileSync(f,'utf8')).name);
console.log(names);
const dupes = names.filter((n,i) => names.indexOf(n) !== i);
if (dupes.length) throw new Error('Duplicate names: ' + dupes);
console.log('All names unique');
"
```

Expected: list of names, then `All names unique`

- [ ] **Step 8: Commit**

```bash
git add integration/unplugin-examples/esbuild/package.json \
        integration/unplugin-examples/rolldown/package.json \
        integration/unplugin-examples/rollup/package.json \
        integration/unplugin-examples/vite-lib/package.json \
        integration/unplugin-examples/vite/package.json \
        integration/unplugin-examples/webpack/package.json
git commit -m "chore: add name fields to unplugin-examples for yarn workspaces"
```

---

### Task 3: Pin `@danielx/civet` to `"*"` in integration packages

**Files:**
- Modify: `integration/eslint/package.json`
- Modify: `integration/jest/package.json`
- Modify: `integration/gulp/package.json`
- Modify: `integration/eslint/example/package.json`

Yarn Classic resolves a workspace dep when `semver.satisfies(workspaceVersion, range)` is true. `"*"` always satisfies any version, ensuring local resolution. `"latest"` is a dist-tag — it fails the semver check and would resolve from npm instead.

`peerDependencies` are left untouched — they express the published contract for end-users.

- [ ] **Step 1: Update `integration/eslint/package.json`**

Change `devDependencies["@danielx/civet"]` from `"^0.9.4"` to `"*"`:

```json
"devDependencies": {
  "@danielx/civet": "*",
  "@eslint/js": "^9.17.0",
  "@types/eslint": "^9.6.1",
  "eslint": "^9.17.0",
  "mocha": "^10.7.3",
  "typescript-eslint": "^8.19.0"
}
```

- [ ] **Step 2: Update `integration/jest/package.json`**

Change `devDependencies["@danielx/civet"]` from `"0.7.17"` to `"*"`:

```json
"devDependencies": {
  "@danielx/civet": "*",
  "cross-env": "7.0.3",
  "jest": "29.7.0"
}
```

- [ ] **Step 3: Update `integration/gulp/package.json`**

Change `devDependencies["@danielx/civet"]` from `"^0.7.4"` to `"*"`:

```json
"devDependencies": {
  "@danielx/civet": "*",
  "mocha": "^10.7.3",
  "vinyl": "^3.0.0"
}
```

- [ ] **Step 4: Update `integration/eslint/example/package.json`**

Change both `@danielx/civet` and `eslint-plugin-civet` to `"*"` (both are local workspace packages):

```json
{
  "name": "civet-eslint-example",
  "version": "0.0.0",
  "scripts": {
    "lint": "civetlint"
  },
  "devDependencies": {
    "@danielx/civet": "*",
    "eslint": "^9.17.0",
    "eslint-plugin-civet": "*",
    "typescript": "^5.7.2",
    "typescript-eslint": "^8.19.0"
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add integration/eslint/package.json \
        integration/jest/package.json \
        integration/gulp/package.json \
        integration/eslint/example/package.json
git commit -m "chore: pin @danielx/civet devDeps to workspace:* in integration packages"
```

---

### Task 4: Pin `@danielx/civet` to `"*"` in all unplugin-examples

**Files:**
- Modify: `integration/unplugin-examples/astro/package.json`
- Modify: `integration/unplugin-examples/esbuild/package.json`
- Modify: `integration/unplugin-examples/farm/package.json`
- Modify: `integration/unplugin-examples/nextjs/package.json`
- Modify: `integration/unplugin-examples/rolldown/package.json`
- Modify: `integration/unplugin-examples/rollup/package.json`
- Modify: `integration/unplugin-examples/vite-lib/package.json`
- Modify: `integration/unplugin-examples/vite/package.json`
- Modify: `integration/unplugin-examples/webpack/package.json`

All currently use `"latest"`, which Yarn Classic does not resolve to workspace packages (it's a dist-tag, not a semver range).

- [ ] **Step 1: Change `"latest"` → `"*"` in all nine files**

In each of the nine `package.json` files above, change:

```json
"@danielx/civet": "latest"
```

to:

```json
"@danielx/civet": "*"
```

- [ ] **Step 2: Verify no `"latest"` remains for `@danielx/civet`**

```bash
grep -r '"@danielx/civet"' integration/unplugin-examples/
```

Expected: every line shows `"*"`, no `"latest"`

- [ ] **Step 3: Commit**

```bash
git add integration/unplugin-examples/
git commit -m "chore: pin @danielx/civet devDeps to * in unplugin-examples"
```

---

### Task 5: Update `lsp/` — pin dep, fix vsce script, fix typescript path

**Files:**
- Modify: `lsp/package.json`
- Modify: `lsp/build/build.sh`

Two independent issues:

1. `lsp/package.json` script `"package"` uses `vsce package --yarn`, which tries to run its own install step — unnecessary since esbuild bundles everything into `dist/`.
2. `lsp/build/build.sh` line 11: `cp node_modules/typescript/lib/lib.*.d.ts dist/lib` is a hard-coded relative path. Once `typescript` is hoisted to root `node_modules`, `lsp/node_modules/typescript` won't exist, breaking this copy step.

- [ ] **Step 1: Update `lsp/package.json`**

Make two changes:

a) `devDependencies["@danielx/civet"]`: `"0.11.4"` → `"*"`

b) `scripts["package"]`: `"bash ./build/build.sh && vsce package --yarn"` → `"bash ./build/build.sh && vsce package --no-dependencies"`

The full `scripts` block becomes:

```json
"scripts": {
  "build": "bash ./build/build.sh",
  "build-dev": "bash ./build/build.sh development",
  "package": "bash ./build/build.sh && vsce package --no-dependencies",
  "vsce-publish": "bash ./build/build.sh && vsce publish",
  "test": "mocha",
  "watch": "node build.mjs --watch"
}
```

- [ ] **Step 2: Fix typescript path in `lsp/build/build.sh`**

Replace line 11:

```bash
cp node_modules/typescript/lib/lib.*.d.ts dist/lib
```

with:

```bash
TS_LIB_DIR=$(node -p "require('path').dirname(require.resolve('typescript'))")
cp "$TS_LIB_DIR"/lib.*.d.ts dist/lib
```

`require.resolve('typescript')` returns the absolute path to `typescript/lib/typescript.js`. `path.dirname(...)` gives the `lib/` directory containing all `lib.*.d.ts` files. This works regardless of whether typescript is in `lsp/node_modules` or hoisted to the root.

The full updated `lsp/build/build.sh`:

```bash
#!/bin/bash
set -euo pipefail

export NODE_ENV=${1-}

rm -rf dist

node_modules/.bin/civet build/build.civet

mkdir -p dist/lib
TS_LIB_DIR=$(node -p "require('path').dirname(require.resolve('typescript'))")
cp "$TS_LIB_DIR"/lib.*.d.ts dist/lib
cp source/tsconfig-lib.json dist/lib/tsconfig.json
```

- [ ] **Step 3: Commit**

```bash
git add lsp/package.json lsp/build/build.sh
git commit -m "chore: update lsp for yarn workspaces (pin dep, fix vsce and typescript path)"
```

---

### Task 6: Delete `lsp/yarn.lock` and run `yarn install`

**Files:**
- Delete: `lsp/yarn.lock`

- [ ] **Step 1: Delete `lsp/yarn.lock`**

```bash
rm lsp/yarn.lock
```

- [ ] **Step 2: Run `yarn install` from root**

```bash
yarn install
```

Expected: Yarn discovers all workspace packages, hoists shared deps, creates symlinks, updates root `yarn.lock`. You may see output like:

```
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
```

No errors. If you see `"workspaces" is not supported in private packages`, add `"private": true` to root `package.json` — Yarn Classic requires this for workspaces.

- [ ] **Step 3: Verify workspace symlinks exist**

```bash
ls -la node_modules/@danielx/civet
```

Expected: a symlink pointing to the repo root (e.g., `../../..` or an absolute path to `/home/.../Civet`). This confirms local resolution is active.

- [ ] **Step 4: Verify `yarn workspaces info`**

```bash
yarn workspaces info
```

Expected: JSON listing all workspace packages with their locations and dependency relationships. All workspace members should appear.

- [ ] **Step 5: Commit**

```bash
git add yarn.lock
git rm lsp/yarn.lock
git commit -m "chore: consolidate to single root yarn.lock via workspaces"
```

---

### Task 7: Smoke test workspace commands and lsp build

- [ ] **Step 1: Verify `yarn workspace lsp build` resolves `civet` correctly**

First ensure root is built (needed since lsp's `node_modules/.bin/civet` symlinks to `dist/civet`):

```bash
yarn build
```

Then build the lsp:

```bash
yarn workspace lsp build
```

Expected: builds successfully, `lsp/dist/extension.js` and `lsp/dist/server.js` are created, `lsp/dist/lib/lib.*.d.ts` files are present.

If `lsp/dist/lib/` is empty or the copy fails, re-check Step 2 of Task 5 — the `TS_LIB_DIR` expansion.

- [ ] **Step 2: Verify `yarn workspaces run test` on integration packages**

```bash
yarn workspace civet-jest test 2>&1 | tail -5
```

Expected: Jest runs and outputs test results (pass or fail — we're checking it resolves deps, not that tests pass).

- [ ] **Step 3: Verify `@danielx/civet` resolves locally in lsp**

```bash
node -e "
const pkg = require('./lsp/node_modules/@danielx/civet/package.json');
console.log('resolved version:', pkg.version);
const rootPkg = require('./package.json');
console.log('root version:', rootPkg.version);
console.log('match:', pkg.version === rootPkg.version);
"
```

Expected: both versions match (the local workspace version), and `match: true`.

- [ ] **Step 4: Final commit if any fixes were needed**

If Task 7 required any fixes, commit them:

```bash
git add -p
git commit -m "fix: correct workspace resolution issues found during smoke test"
```

---

## Notes

- If `yarn install` fails with `"workspaces" is not supported in private packages`, add `"private": true` to root `package.json`. Yarn Classic requires workspaces roots to be private (prevents accidentally publishing the root).
- The `lsp/node_modules/.bin/civet` symlink is created by Yarn even for hoisted packages — `.bin` entries are always linked into each workspace that declares the dep.
- `civet.dev/` remains out of the workspace (no `package.json`). Its browser build is still produced by the root `build` script via `terser`.
- Cross-workspace commands available immediately: `yarn workspace <name> <script>`, `yarn workspaces run <script>`, `yarn workspaces info`.
