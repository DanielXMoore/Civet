# Build & Test Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce `yarn test` from ~28s to ~5s (dev) and `yarn build` by ~1.3s through four targeted infrastructure changes.

**Architecture:** (1) A custom hera require hook wraps the hera compiler with a sha1-keyed disk cache; (2) c8 coverage is made opt-in via `CIVET_COVERAGE=1`; (3) terser browser build is skippable via `CIVET_NO_BROWSER=1`; (4) mocha `--parallel` is enabled by default once the cache makes per-worker startup cheap.

**Tech Stack:** Node.js (crypto, fs), Mocha `--parallel`, c8, esbuild, bash

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `build/hera-register.js` | Disk-caching require hook for `.hera` files |
| Modify | `.mocharc.json` | Use `build/hera-register.js` instead of `@danielx/hera/register` |
| Modify | `.mocharc-self.json` | Same |
| Modify | `.gitignore` | Ignore `.cache/` directory |
| Modify | `build/test.sh` | Optional c8, parallel mocha by default |
| Modify | `build/build.sh` | `CIVET_NO_BROWSER=1` to skip terser |
| Modify | `package.json` | Add `test:coverage` script, update `prepublishOnly` |

---

## Task 1: Establish a timing baseline

**Files:**
- No file changes

- [ ] **Step 1: Record baseline timings**

Run each command and note the wall-clock time:

```bash
time yarn build 2>&1 | tail -3
time yarn test 2>&1 | tail -5
```

Expected output shape:
```
real  0m6.6s    # build
real  0m28s     # test
3229 passing
```

Save these numbers — you'll compare against them after each task.

- [ ] **Step 2: Commit nothing — this is observation only**

No commit needed.

---

## Task 2: Add `.cache/` to `.gitignore`

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add the cache dir to .gitignore**

Append to `.gitignore`:
```
.cache/
```

The file currently ends with `register-noconfig.js`. Add the new line after that.

- [ ] **Step 2: Verify**

```bash
git check-ignore -v .cache/hera/anything.js
```

Expected: `.gitignore:8:.cache/	.cache/hera/anything.js`

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .cache/ directory"
```

---

## Task 3: Create the hera compilation disk cache

**Files:**
- Create: `build/hera-register.js`

The hera require hook compiles `parser.hera` (9555 lines) from scratch on every mocha process start, costing ~5.7s. This task wraps that hook with a file cache keyed on `sha1(file_content + hera_version)`.

- [ ] **Step 1: Verify the baseline cost of loading parser.hera**

```bash
time node -e "
  require('@danielx/hera/register');
  require('./node_modules/@danielx/civet/register');
  require('./source/main.civet');
" 2>&1 | tail -3
```

Expected: `real  0m5.xxxxxs`

- [ ] **Step 2: Create `build/hera-register.js`**

```javascript
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { compile: heraCompile } = require('@danielx/hera/dist/main.js');
const heraVersion = require('@danielx/hera/package.json').version;

const cacheDir = path.resolve(__dirname, '../.cache/hera');

function getCachePath(source) {
  const key = crypto
    .createHash('sha1')
    .update(heraVersion)
    .update('\0')
    .update(source)
    .digest('hex');
  return path.join(cacheDir, key + '.js');
}

function ensureCacheDir() {
  try {
    fs.mkdirSync(cacheDir, { recursive: true });
  } catch {
    // ignore — soft failure, caching is optional
  }
}

if (require.extensions) {
  try {
    require('@cspotcode/source-map-support/register-hook-require');
  } catch {
    // optional dependency
  }

  require.extensions['.hera'] = function(module, filename) {
    const source = fs.readFileSync(filename, 'utf8');
    const cachePath = getCachePath(source);

    let compiled;
    try {
      compiled = fs.readFileSync(cachePath, 'utf8');
    } catch {
      // cache miss — compile and store
      compiled = heraCompile(source, { filename, inlineMap: true });
      ensureCacheDir();
      try {
        fs.writeFileSync(cachePath, compiled);
      } catch {
        // ignore write failure — soft failure
      }
    }

    return module._compile(compiled, filename);
  };
}
```

- [ ] **Step 3: Verify the module loads without error**

```bash
node -e "require('./build/hera-register')"
```

Expected: no output, exit 0.

- [ ] **Step 4: Verify it compiles parser.hera (cold cache)**

Remove any existing cache first, then time it:

```bash
rm -rf .cache/hera
time node -e "
  require('./build/hera-register');
  require('./node_modules/@danielx/civet/register');
  require('./source/main.civet');
" 2>&1 | tail -3
```

Expected: similar to baseline (~5s), and `.cache/hera/` now contains a `.js` file:

```bash
ls .cache/hera/
```

Expected: one file like `a3f2...8b.js`

- [ ] **Step 5: Verify warm cache is fast**

```bash
time node -e "
  require('./build/hera-register');
  require('./node_modules/@danielx/civet/register');
  require('./source/main.civet');
" 2>&1 | tail -3
```

Expected: `real  0m0.3s` or less (was ~5.7s before).

- [ ] **Step 6: Commit**

```bash
git add build/hera-register.js
git commit -m "perf: add disk cache for hera compilation"
```

---

## Task 4: Wire the cache into mocharc

**Files:**
- Modify: `.mocharc.json`
- Modify: `.mocharc-self.json`

- [ ] **Step 1: Update `.mocharc.json`**

Change the `require` array from:
```json
"require": [
  "@danielx/hera/register",
  "./node_modules/@danielx/civet/register"
]
```
to:
```json
"require": [
  "./build/hera-register",
  "./node_modules/@danielx/civet/register"
]
```

- [ ] **Step 2: Update `.mocharc-self.json`**

Change the `require` array from:
```json
"require": [
  "@danielx/hera/register",
  "./register.js"
]
```
to:
```json
"require": [
  "./build/hera-register",
  "./register.js"
]
```

- [ ] **Step 3: Run tests to verify nothing broke**

```bash
rm -rf .cache/hera
node_modules/.bin/mocha 2>&1 | tail -5
```

Expected:
```
3229 passing (Xs)
19 pending
```

- [ ] **Step 4: Run tests again to measure warm cache speedup**

```bash
time node_modules/.bin/mocha 2>&1 | tail -5
```

Expected: wall time notably faster than baseline (mocha alone was ~13.7s; warm should be ~8s).

- [ ] **Step 5: Commit**

```bash
git add .mocharc.json .mocharc-self.json
git commit -m "perf: use caching hera register in mocha"
```

---

## Task 5: Make c8 coverage opt-in

**Files:**
- Modify: `build/test.sh`
- Modify: `package.json`

- [ ] **Step 1: Update `build/test.sh`**

Replace the current content:
```bash
#!/bin/bash

set -euo pipefail

# Translate CIVET_THREADS into Mocha's --parallel
# In particular, CIVET_THREADS Workers don't work within Mocha
args=""
if [ "${CIVET_THREADS:-0}" != 0 ]; then
  args="--parallel -j $CIVET_THREADS"
  export CIVET_THREADS=
fi

c8 mocha $args "$@"
tsc --noEmit
```

With:
```bash
#!/bin/bash

set -euo pipefail

# Translate CIVET_THREADS into Mocha's --parallel
# In particular, CIVET_THREADS Workers don't work within Mocha
args=""
if [ "${CIVET_THREADS:-0}" != 0 ]; then
  args="--parallel -j $CIVET_THREADS"
  export CIVET_THREADS=
fi

if [ "${CIVET_COVERAGE:-0}" = "1" ]; then
  c8 mocha $args "$@"
else
  node_modules/.bin/mocha $args "$@"
fi
tsc --noEmit
```

- [ ] **Step 2: Update `package.json`**

Add `"test:coverage"` to the `"scripts"` section and update `"prepublishOnly"`:

Change:
```json
"prepublishOnly": "yarn build && yarn test && yarn changelog --release",
"test": "bash ./build/test.sh",
```

To:
```json
"prepublishOnly": "yarn build && yarn test:coverage && yarn changelog --release",
"test": "bash ./build/test.sh",
"test:coverage": "CIVET_COVERAGE=1 bash ./build/test.sh",
```

- [ ] **Step 3: Verify `yarn test` runs without coverage**

```bash
time yarn test 2>&1 | tail -5
```

Expected: faster than before (no c8 overhead), all 3229 tests pass. No coverage report printed.

- [ ] **Step 4: Verify `yarn test:coverage` still produces coverage**

```bash
yarn test:coverage 2>&1 | grep -E "passing|All files"
```

Expected: `3229 passing` and a coverage table with `All files` row.

- [ ] **Step 5: Commit**

```bash
git add build/test.sh package.json
git commit -m "perf: make c8 coverage opt-in via CIVET_COVERAGE=1"
```

---

## Task 6: Skip browser/terser build in dev

**Files:**
- Modify: `build/build.sh`

- [ ] **Step 1: Update `build/build.sh`**

Find the terser line near the bottom of the file:
```bash
# create browser build for docs
if [ "${CIVET_SELF_BUILD:-}" != "1" ]; then
  terser "$out"/browser.js --compress --mangle --ecma 2015 --output civet.dev/public/__civet.js
fi
```

Replace it with:
```bash
# create browser build for docs
if [ "${CIVET_SELF_BUILD:-}" != "1" ] && [ "${CIVET_NO_BROWSER:-}" != "1" ]; then
  terser "$out"/browser.js --compress --mangle --ecma 2015 --output civet.dev/public/__civet.js
fi
```

- [ ] **Step 2: Verify the default build still works**

```bash
time yarn build 2>&1 | tail -3
```

Expected: completes successfully, `dist/` populated, `civet.dev/public/__civet.js` updated.

- [ ] **Step 3: Verify `CIVET_NO_BROWSER=1` skips terser**

```bash
time CIVET_NO_BROWSER=1 yarn build 2>&1 | tail -3
```

Expected: faster by ~1.3s, no terser output.

- [ ] **Step 4: Commit**

```bash
git add build/build.sh
git commit -m "perf: add CIVET_NO_BROWSER=1 to skip terser in dev builds"
```

---

## Task 7: Enable parallel mocha by default

**Files:**
- Modify: `build/test.sh`

- [ ] **Step 1: Update `build/test.sh`**

Replace the parallel section in `build/test.sh`:
```bash
# Translate CIVET_THREADS into Mocha's --parallel
# In particular, CIVET_THREADS Workers don't work within Mocha
args=""
if [ "${CIVET_THREADS:-0}" != 0 ]; then
  args="--parallel -j $CIVET_THREADS"
  export CIVET_THREADS=
fi
```

With:
```bash
# Enable parallel mocha by default using available CPU count.
# Set CIVET_THREADS=N to override, or CIVET_THREADS=0 to disable.
# Note: CIVET_THREADS refers to Mocha --parallel workers (separate processes),
# not Node.js worker_threads, which don't work within Mocha.
threads="${CIVET_THREADS:-$(node -e 'process.stdout.write(String(require("os").cpus().length))')}"
args=""
if [ "$threads" != "0" ]; then
  args="--parallel -j $threads"
fi
export CIVET_THREADS=
```

- [ ] **Step 2: Run full test suite and verify correctness**

```bash
yarn test 2>&1 | tail -5
```

Expected:
```
3229 passing (Xs)
19 pending
```

(Tests must all pass — parallel mode can expose order-dependent tests if any exist.)

- [ ] **Step 3: Verify CIVET_THREADS=0 disables parallelism**

```bash
CIVET_THREADS=0 yarn test 2>&1 | tail -5
```

Expected: same pass count, sequential execution.

- [ ] **Step 4: Time the full optimized stack**

```bash
time yarn test 2>&1 | tail -5
```

Expected: wall time ~4–5s (was ~28s before all changes).

Also verify coverage still works:
```bash
time yarn test:coverage 2>&1 | grep -E "passing|All files" | head -3
```

Expected: `3229 passing`, coverage table, wall time ~16s (was ~28s).

- [ ] **Step 5: Commit**

```bash
git add build/test.sh
git commit -m "perf: enable parallel mocha by default"
```

---

## Task 8: Final verification

**Files:**
- No changes

- [ ] **Step 1: Clean state full build + test**

```bash
rm -rf dist .cache
time yarn build 2>&1 | tail -3
time yarn test 2>&1 | tail -5
```

Expected: build succeeds, all 3229 tests pass, cold-cache test run takes ~8–10s (hera recompiles once), then:

- [ ] **Step 2: Warm state test**

```bash
time yarn test 2>&1 | tail -5
```

Expected: ~4–5s wall time.

- [ ] **Step 3: Verify test:self still works**

```bash
yarn test:self 2>&1 | tail -5
```

Expected: 3229 passing (uses `./register.js` and `build/hera-register.js`).

- [ ] **Step 4: Summarise results**

Print a before/after table:

| Step | Before | After (cold) | After (warm) |
|------|--------|--------------|--------------|
| `yarn build` | ~6.5s | ~6.5s | ~6.5s |
| `CIVET_NO_BROWSER=1 yarn build` | ~6.5s | ~5s | ~5s |
| `yarn test` (dev) | ~28s | ~10s | ~4–5s |
| `yarn test:coverage` | ~28s | ~18s | ~16s |
