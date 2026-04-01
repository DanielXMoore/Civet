# Unified Build Loader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace four build-time loader files with two: `build/register.js` (CJS hooks + ESM registration) and `build/esm-hook.mjs` (ESM hook for both `.hera` and `.civet` with disk caching), configurable via `CIVET_SOURCE` env var.

**Architecture:** A unified CJS register sets up `require.extensions` for `.hera` and `.civet` and calls `module.register()` to install the ESM hook. The ESM hook caches compiled output to `.cache/build/` keyed on source + versions. The `.hera` path chains Hera → Civet → JS; the `.civet` path goes directly to JS.

**Tech Stack:** Node.js CJS/ESM loader APIs, `@danielx/hera`, `@danielx/civet`, `node:crypto` (sha1 cache keys), `node:fs` (atomic cache writes)

---

## Files

| Action | Path | Purpose |
|--------|------|---------|
| Create | `build/esm-hook.mjs` | ESM hook: resolve + load for `.hera` and `.civet` with caching |
| Create | `build/register.js` | CJS hooks for `.hera`/`.civet` + registers ESM hook |
| Modify | `.mocharc.json` | Replace multi-entry require with `["./build/register.js"]` |
| Modify | `.mocharc-self.json` | Same structure; CIVET_SOURCE moved to `test:self` script |
| Modify | `package.json` | Update `test:self` to set `CIVET_SOURCE=./dist/main.js` |
| Delete | `build/hera-register.js` | Superseded |
| Delete | `build/hera-esm-hook.mjs` | Superseded |
| Delete | `build/civet-cache-register.js` | Superseded |
| Delete | `build/civet-esm-hook.mjs` | Superseded |

---

## Task 1: Write `build/esm-hook.mjs`

**Files:**
- Create: `build/esm-hook.mjs`

- [ ] **Step 1: Create `build/esm-hook.mjs`**

```javascript
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const _require = createRequire(import.meta.url);
const baseURL = pathToFileURL(process.cwd() + '/').href;

let cacheDir;
let civetCompile;
let civetVersion;
let heraCompile;
let heraVersion;

export function initialize({ civetSource, civetVersion: cv, cacheDir: cd }) {
  cacheDir = cd;
  civetVersion = cv;
  civetCompile = _require(civetSource).compile;
  heraCompile = _require('@danielx/hera/dist/main.js').compile;
  heraVersion = _require('@danielx/hera/package.json').version;
}

export function resolve(specifier, context, next) {
  const parentURL = context.parentURL ?? baseURL;
  if (/\.hera(?:$|[?#])/.test(specifier)) {
    return { shortCircuit: true, format: 'hera', url: new URL(specifier, parentURL).href };
  }
  if (/\.civet(?:$|[?#])/.test(specifier)) {
    return { shortCircuit: true, format: 'civet', url: new URL(specifier, parentURL).href };
  }
  return next(specifier, context);
}

function getCachePath(key) {
  return `${cacheDir}/${key}.mjs`;
}

function readCache(p) {
  try { return readFileSync(p, 'utf8'); } catch {}
}

function writeCache(p, content) {
  try { mkdirSync(cacheDir, { recursive: true }); } catch {}
  try {
    const tmp = p + '.tmp.' + process.pid;
    writeFileSync(tmp, content);
    renameSync(tmp, p);
  } catch {}
}

export async function load(url, context, next) {
  const { format } = context;
  if (format !== 'hera' && format !== 'civet') return next(url, context);

  const filename = fileURLToPath(url);
  const source = readFileSync(filename, 'utf8');

  const key = format === 'hera'
    ? createHash('sha1')
        .update(heraVersion).update('\0')
        .update(civetVersion).update('\0')
        .update(source).update('\0')
        .update(filename).update('\0hera')
        .digest('hex')
    : createHash('sha1')
        .update(civetVersion).update('\0')
        .update(source).update('\0')
        .update(filename).update('\0civet')
        .digest('hex');

  const p = getCachePath(key);
  const cached = readCache(p);
  if (cached) return { format: 'module', source: cached, shortCircuit: true };

  let js;
  if (format === 'hera') {
    const civetOutput = heraCompile(source, { filename, module: true });
    js = await civetCompile(civetOutput, { filename, js: true, inlineMap: true });
  } else {
    js = await civetCompile(source, { filename, js: true, inlineMap: true });
  }

  writeCache(p, js);
  return { format: 'module', source: js, shortCircuit: true };
}
```

- [ ] **Step 2: Commit**

```bash
git add build/esm-hook.mjs
git commit -m "build: add unified esm-hook.mjs for .hera and .civet"
```

---

## Task 2: Write `build/register.js`

**Files:**
- Create: `build/register.js`

- [ ] **Step 1: Create `build/register.js`**

```javascript
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const { compile: heraCompile } = require('@danielx/hera/dist/main.js');
const heraVersion = require('@danielx/hera/package.json').version;

const civetSourceRaw = process.env.CIVET_SOURCE ?? '@danielx/civet';
const civetSourceResolved = civetSourceRaw.startsWith('.')
  ? require.resolve(path.resolve(process.cwd(), civetSourceRaw))
  : require.resolve(civetSourceRaw);

const { compile: civetCompile } = require(civetSourceResolved);

function findPackageVersion(resolvedPath) {
  let dir = path.dirname(resolvedPath);
  while (true) {
    try { return require(path.join(dir, 'package.json')).version; } catch {}
    const parent = path.dirname(dir);
    if (parent === dir) return 'unknown';
    dir = parent;
  }
}
const civetVersion = findPackageVersion(civetSourceResolved);

const cacheDir = path.resolve(__dirname, '../.cache/build');

function getCachePath(parts) {
  const key = crypto.createHash('sha1').update(parts.join('\0')).digest('hex');
  return path.join(cacheDir, key + '.mjs');
}

function compileWithCache(type, source, filename) {
  const parts = type === 'hera'
    ? [heraVersion, civetVersion, source, filename, 'hera-cjs']
    : [civetVersion, source, filename, 'civet-cjs'];
  const p = getCachePath(parts);

  try { return fs.readFileSync(p, 'utf8'); } catch {}

  let js;
  if (type === 'hera') {
    const civetOutput = heraCompile(source, { filename });
    js = civetCompile(civetOutput, { filename, js: true, inlineMap: true, sync: true });
  } else {
    js = civetCompile(source, { filename, js: true, inlineMap: true, sync: true });
  }

  try {
    fs.mkdirSync(cacheDir, { recursive: true });
    const tmp = p + '.tmp.' + process.pid;
    fs.writeFileSync(tmp, js);
    fs.renameSync(tmp, p);
  } catch {}

  return js;
}

if (require.extensions) {
  require.extensions['.hera'] = function(module, filename) {
    const source = fs.readFileSync(filename, 'utf8');
    module._compile(compileWithCache('hera', source, filename), filename);
  };

  require.extensions['.civet'] = function(module, filename) {
    const source = fs.readFileSync(filename, 'utf8');
    module._compile(compileWithCache('civet', source, filename), filename);
  };
}

try {
  const { register } = require('node:module');
  register(
    pathToFileURL(path.resolve(__dirname, './esm-hook.mjs')).href,
    pathToFileURL(__filename),
    { data: { civetSource: civetSourceResolved, civetVersion, cacheDir } }
  );
} catch {
  // Node version doesn't support module.register()
}
```

- [ ] **Step 2: Smoke test — verify the new loader can compile a .civet file**

```bash
node --import ./build/register.js -e "import('./source/esm.civet').then(() => console.log('OK')).catch(e => { console.error(e); process.exit(1) })"
```

Expected: prints `OK` with no errors.

- [ ] **Step 3: Commit**

```bash
git add build/register.js
git commit -m "build: add unified register.js for .hera and .civet"
```

---

## Task 3: Update mocharc files and package.json

**Files:**
- Modify: `.mocharc.json`
- Modify: `.mocharc-self.json`
- Modify: `package.json`

- [ ] **Step 1: Update `.mocharc.json`**

Replace the entire file contents with:

```json
{
  "extension": [
    "civet"
  ],
  "require": [
    "./build/register.js"
  ],
  "reporter": "dot",
  "recursive": true,
  "spec": [
    "test"
  ],
  "exclude": [
    "test/infra/config/**"
  ]
}
```

- [ ] **Step 2: Update `.mocharc-self.json`**

Replace the entire file contents with:

```jsonc
// Self-test: run Civet tests using the current built version of Civet
{
  "extension": [
    "civet"
  ],
  "require": [
    "./build/register.js"
  ],
  "reporter": "dot",
  "recursive": true,
  "spec": [
    "test"
  ],
  "exclude": [
    "test/infra/config/**"
  ]
}
```

- [ ] **Step 3: Update `test:self` script in `package.json`**

Change the `test:self` line from:
```json
"test:self": "pnpm build && mocha --config .mocharc-self.json",
```
to:
```json
"test:self": "pnpm build && CIVET_SOURCE=./dist/main.js mocha --config .mocharc-self.json",
```

- [ ] **Step 4: Run the normal test suite to verify**

```bash
pnpm test
```

Expected: all tests pass (same result as before the change).

If tests fail, check:
- That `build/register.js` resolves `@danielx/civet` correctly (log `civetSourceResolved`)
- That the ESM hook `initialize` is called before any `.civet` files are loaded

- [ ] **Step 5: Commit**

```bash
git add .mocharc.json .mocharc-self.json package.json
git commit -m "build: switch mocharc files to use unified register.js"
```

---

## Task 4: Delete old files and final verification

**Files:**
- Delete: `build/hera-register.js`
- Delete: `build/hera-esm-hook.mjs`
- Delete: `build/civet-cache-register.js`
- Delete: `build/civet-esm-hook.mjs`

- [ ] **Step 1: Delete the four superseded files**

```bash
git rm build/hera-register.js build/hera-esm-hook.mjs build/civet-cache-register.js build/civet-esm-hook.mjs
```

- [ ] **Step 2: Verify nothing else references the deleted files**

```bash
grep -r "hera-register\|hera-esm-hook\|civet-cache-register\|civet-esm-hook" --include="*.json" --include="*.js" --include="*.mjs" --include="*.sh" --include="*.civet" .
```

Expected: no matches (other than possibly git history). If any matches are found, update those references to use `./build/register.js` or `./build/esm-hook.mjs` as appropriate.

- [ ] **Step 3: Run the full test suite one final time**

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git commit -m "build: remove superseded hera and civet loader files"
```
