# pnpm Workspaces Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the repo from yarn 1 classic to pnpm workspaces so that `@danielx/civet` is publishable without `private: true` and child packages can depend on the local workspace build.

**Architecture:** Replace yarn with pnpm. Add `pnpm-workspace.yaml` at the repo root. Update all child package `@danielx/civet` dependencies to `workspace:*` so they resolve to the local build. Delete all `yarn.lock` files and generate `pnpm-lock.yaml`.

**Tech Stack:** pnpm (workspace manager), Node 24, existing build/test scripts unchanged

**Branch:** `feat/pnpm-workspaces` off `main`

---

## File Map

| Action | Path | Change |
|--------|------|--------|
| Create | `pnpm-workspace.yaml` | Declare workspace packages |
| Modify | `package.json` | `packageManager` field + `yarn`→`pnpm` in scripts |
| Modify | `integration/eslint/package.json` | dep `workspace:*` + script `pnpm build` |
| Modify | `integration/jest/package.json` | dep `workspace:*` + script `pnpm prepare` |
| Modify | `integration/gulp/package.json` | dep `workspace:*` |
| Modify | `integration/eslint/example/package.json` | dep `workspace:*` |
| Modify | `lsp/package.json` | `vsce package --yarn` → `vsce package --no-yarn` |
| Modify | `integration/unplugin-examples/esbuild/package.json` | add `name`+`version`, dep `workspace:*` |
| Modify | `integration/unplugin-examples/rolldown/package.json` | add `name`+`version`, dep `workspace:*` |
| Modify | `integration/unplugin-examples/rollup/package.json` | add `name`+`version`, dep `workspace:*` |
| Modify | `integration/unplugin-examples/vite/package.json` | add `name`+`version`, dep `workspace:*` |
| Modify | `integration/unplugin-examples/vite-lib/package.json` | add `name`+`version`, dep `workspace:*` |
| Modify | `integration/unplugin-examples/webpack/package.json` | add `name`+`version`, dep `workspace:*` |
| Modify | `integration/unplugin-examples/astro/package.json` | dep `workspace:*` |
| Modify | `integration/unplugin-examples/farm/package.json` | dep `workspace:*` |
| Modify | `integration/unplugin-examples/nextjs/package.json` | dep `workspace:*` |
| Delete | `yarn.lock` | replaced by `pnpm-lock.yaml` |
| Delete | `integration/eslint/yarn.lock` | child lockfile no longer needed |
| Delete | `lsp/yarn.lock` | child lockfile no longer needed |

---

## Task 1: Install pnpm and determine version

**Files:** none — environment setup only

- [ ] **Step 1: Install pnpm globally**

```bash
npm install -g pnpm
```

Expected: pnpm installed with no errors.

- [ ] **Step 2: Record the installed version**

```bash
pnpm --version
```

Note the output (e.g., `10.7.0`). You will use this in Task 2.

---

## Task 2: Create `pnpm-workspace.yaml`

**Files:**
- Create: `pnpm-workspace.yaml`

- [ ] **Step 1: Create the workspace config**

Create `pnpm-workspace.yaml` at the repo root with this content:

```yaml
packages:
  - lsp
  - integration/eslint
  - integration/jest
  - integration/gulp
  - integration/eslint/example
  - integration/unplugin-examples/*
```

- [ ] **Step 2: Commit**

```bash
git add pnpm-workspace.yaml
git commit -m "chore: add pnpm-workspace.yaml"
```

---

## Task 3: Update root `package.json`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update `packageManager` field**

Replace the `packageManager` line in `package.json`. Use the version you noted in Task 1 Step 2 (shown here as `10.7.0` — substitute your actual version):

```json
"packageManager": "pnpm@10.7.0",
```

- [ ] **Step 2: Replace `yarn` with `pnpm` in scripts**

Update the `scripts` block in `package.json`. Change only these four entries (leave `build`, `test`, and `changelog` untouched — they call bash scripts directly):

```json
"scripts": {
  "build": "bash ./build/build.sh",
  "build:self": "pnpm build && bash ./build/build-self.sh",
  "docs:dev": "pnpm build && vitepress dev civet.dev",
  "docs:build": "pnpm build && vitepress build civet.dev",
  "docs:preview": "pnpm build && vitepress preview civet.dev",
  "prepublishOnly": "pnpm build && pnpm test && pnpm changelog --release",
  "test": "bash ./build/test.sh",
  "test:self": "pnpm build && mocha --config .mocharc-self.json",
  "changelog": "civet build/changelog.civet"
},
```

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: update root package.json for pnpm"
```

---

## Task 4: Update integration child packages — deps and scripts

**Files:**
- Modify: `integration/eslint/package.json`
- Modify: `integration/jest/package.json`
- Modify: `integration/gulp/package.json`
- Modify: `integration/eslint/example/package.json`

- [ ] **Step 1: Update `integration/eslint/package.json`**

Change `devDependencies["@danielx/civet"]` from `"^0.9.4"` to `"workspace:*"`.
Change `scripts["prepublishOnly"]` from `"yarn build"` to `"pnpm build"`.

The relevant sections should read:

```json
"scripts": {
  "build": "civet --no-config esbuild.civet",
  "prepublishOnly": "pnpm build",
  "typecheck": "civet --typecheck",
  "test": "pnpm typecheck"
},
"devDependencies": {
  "@danielx/civet": "workspace:*",
  ...
}
```

- [ ] **Step 2: Update `integration/jest/package.json`**

Change `devDependencies["@danielx/civet"]` from `"0.7.17"` to `"workspace:*"`.
Change `scripts["test"]` from `"yarn prepare && cross-env ..."` to `"pnpm prepare && cross-env ..."`.

The relevant sections should read:

```json
"scripts": {
  "prepare": "civet --js -c index.civet -o index.js",
  "test": "pnpm prepare && cross-env NODE_OPTIONS=--experimental-vm-modules jest"
},
"devDependencies": {
  "@danielx/civet": "workspace:*",
  ...
}
```

- [ ] **Step 3: Update `integration/gulp/package.json`**

Change `devDependencies["@danielx/civet"]` from `"^0.7.4"` to `"workspace:*"`. No script changes needed.

- [ ] **Step 4: Update `integration/eslint/example/package.json`**

Change `devDependencies["@danielx/civet"]` from `"^0.9.4"` to `"workspace:*"`. No script changes needed.

- [ ] **Step 5: Commit**

```bash
git add integration/eslint/package.json integration/jest/package.json integration/gulp/package.json integration/eslint/example/package.json
git commit -m "chore: update integration package deps to workspace:*"
```

---

## Task 5: Update `lsp/package.json`

**Files:**
- Modify: `lsp/package.json`

- [ ] **Step 1: Fix the vsce package script**

In `lsp/package.json`, change `scripts["package"]` from:

```json
"package": "bash ./build/build.sh && vsce package --yarn",
```

to:

```json
"package": "bash ./build/build.sh && vsce package --no-yarn",
```

- [ ] **Step 2: Commit**

```bash
git add lsp/package.json
git commit -m "chore: update lsp vsce package script for pnpm"
```

---

## Task 6: Update `unplugin-examples` packages

Six packages need a `name` and `version` added (required for pnpm workspace membership). All nine need `@danielx/civet` updated to `workspace:*`.

**Files:**
- Modify: `integration/unplugin-examples/esbuild/package.json`
- Modify: `integration/unplugin-examples/rolldown/package.json`
- Modify: `integration/unplugin-examples/rollup/package.json`
- Modify: `integration/unplugin-examples/vite/package.json`
- Modify: `integration/unplugin-examples/vite-lib/package.json`
- Modify: `integration/unplugin-examples/webpack/package.json`
- Modify: `integration/unplugin-examples/astro/package.json`
- Modify: `integration/unplugin-examples/farm/package.json`
- Modify: `integration/unplugin-examples/nextjs/package.json`

- [ ] **Step 1: Update `esbuild/package.json`**

```json
{
  "name": "civet-example-esbuild",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build": "node esbuild.js",
    "watch": "node esbuild.js --watch"
  },
  "devDependencies": {
    "@danielx/civet": "workspace:*",
    "esbuild": "latest"
  }
}
```

- [ ] **Step 2: Update `rolldown/package.json`**

```json
{
  "name": "civet-example-rolldown",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build": "npx rolldown -c",
    "watch": "npx rolldown -w -c"
  },
  "devDependencies": {
    "@danielx/civet": "workspace:*",
    "rolldown": "^1.0.0-beta.6"
  }
}
```

- [ ] **Step 3: Update `rollup/package.json`**

```json
{
  "name": "civet-example-rollup",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build": "npx rollup --config rollup.config.js",
    "watch": "npx rollup --config rollup.config.js --watch"
  },
  "devDependencies": {
    "@danielx/civet": "workspace:*"
  }
}
```

- [ ] **Step 4: Update `vite/package.json`**

```json
{
  "name": "civet-example-vite",
  "version": "0.0.0",
  "scripts": {
    "build": "npx vite build",
    "dev": "npx vite dev"
  },
  "devDependencies": {
    "@danielx/civet": "workspace:*"
  }
}
```

- [ ] **Step 5: Update `vite-lib/package.json`**

```json
{
  "name": "civet-example-vite-lib",
  "version": "0.0.0",
  "scripts": {
    "build": "npx vite build"
  },
  "devDependencies": {
    "@danielx/civet": "workspace:*"
  }
}
```

- [ ] **Step 6: Update `webpack/package.json`**

```json
{
  "name": "civet-example-webpack",
  "version": "0.0.0",
  "scripts": {
    "build": "npx webpack build",
    "watch": "npx webpack build --watch"
  },
  "devDependencies": {
    "@danielx/civet": "workspace:*",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4"
  }
}
```

- [ ] **Step 7: Update `astro/package.json`** — dep only, `name`+`version` already present

Change `devDependencies["@danielx/civet"]` from `"latest"` to `"workspace:*"`.

- [ ] **Step 8: Update `farm/package.json`** — dep only, `name`+`version` already present

Change `devDependencies["@danielx/civet"]` from `"latest"` to `"workspace:*"`.

- [ ] **Step 9: Update `nextjs/package.json`** — dep only, `name`+`version` already present

Change `devDependencies["@danielx/civet"]` from `"latest"` to `"workspace:*"`.

- [ ] **Step 10: Commit**

```bash
git add integration/unplugin-examples/
git commit -m "chore: update unplugin-examples for pnpm workspace membership"
```

---

## Task 7: Migrate lockfile

**Files:**
- Delete: `yarn.lock`, `integration/eslint/yarn.lock`, `lsp/yarn.lock`
- Create: `pnpm-lock.yaml` (generated)

- [ ] **Step 1: Delete all yarn lockfiles**

```bash
rm yarn.lock integration/eslint/yarn.lock lsp/yarn.lock
```

- [ ] **Step 2: Run `pnpm install`**

```bash
pnpm install
```

Expected: pnpm resolves all workspace packages, generates `pnpm-lock.yaml`, creates `.pnpm/` virtual store. Should complete with no errors. If you see `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND` for `@danielx/civet`, double-check that `package.json` at the root has `"name": "@danielx/civet"`.

- [ ] **Step 3: Commit**

```bash
git add pnpm-lock.yaml
git rm yarn.lock integration/eslint/yarn.lock lsp/yarn.lock
git commit -m "chore: replace yarn.lock with pnpm-lock.yaml"
```

---

## Task 8: Verify build and tests pass

**Files:** none unless fixes are needed

- [ ] **Step 1: Run the build**

```bash
pnpm build
```

Expected: build completes successfully, `dist/` is populated.

If you see errors like `Cannot find module 'X'` in any workspace package, it means that package has an implicit dep (relies on hoisting). Fix it by adding the missing package to that workspace's `devDependencies` and re-running `pnpm install`.

- [ ] **Step 2: Run the tests**

```bash
pnpm test
```

Expected: all tests pass with the same results as before migration.

- [ ] **Step 3: Commit any fixes**

If you needed to add implicit deps in Step 1 or 2, commit those fixes:

```bash
git add <affected package.json files> pnpm-lock.yaml
git commit -m "chore: fix implicit deps surfaced by pnpm strict node_modules"
```

If no fixes were needed, skip this step.
