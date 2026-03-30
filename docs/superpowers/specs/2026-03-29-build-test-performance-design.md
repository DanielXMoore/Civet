# Build & Test Performance Design

**Date:** 2026-03-29
**Goal:** Reduce developer iteration time and CI time for Civet's build and test steps through empirical measurement and targeted fixes.

---

## Baseline Measurements

| Step | Time |
|------|------|
| `yarn build` | ~6.5s |
| — esbuild step | ~5.25s |
| — terser/browser step | ~1.3s |
| `yarn test` (c8 + mocha) | ~28s |
| — c8 coverage overhead | ~14s |
| — mocha alone | ~13.7s |
| — parser.hera compilation (warm start) | ~5.7s |
| — actual test execution (3229 tests) | ~6s |
| `tsc --noEmit` | ~0.5s |

**Root causes identified:**

1. `parser.hera` (9555 lines) is compiled from scratch by hera's require hook on every test process start (~5.7s). In parallel mocha mode, each worker repeats this cost.
2. `c8` coverage instrumentation adds ~14s unconditionally, even for local dev runs.
3. The terser browser minification step (~1.3s) runs on every build, even when the docs site output isn't needed.
4. `--parallel` mocha is only enabled via `CIVET_THREADS`, and wasn't beneficial before because each worker paid the full parser.hera compilation cost.

---

## Architecture

Four independent changes, each targeting one root cause. All changes are in build/test infrastructure; no source files are modified.

### 1. Hera Compilation Disk Cache

**File:** `build/hera-register.js`

A custom CJS require hook that wraps hera's compiler with a persistent file cache. Replaces `@danielx/hera/register` in `.mocharc.json` and `.mocharc-self.json`.

**Cache logic:**
- Key = `sha1(file_content + hera_package_version)` — covers both content and compiler changes
- Cache directory = `.cache/hera/` (added to `.gitignore`)
- Cache file = `.cache/hera/{key}.js`
- On `.hera` require: check for cache file → if present, call `module._compile(cached_js, filename)`; if absent, run `heraCompile(source, opts)`, write result to cache file, then call `module._compile(result, filename)`
- No TTL: the key fully determines staleness

**Effect:** Cold run (first run, or after `parser.hera` changes) is unchanged (~5.7s). Warm run saves ~5.7s, loading the cached parser in ~50ms.

### 2. Optional c8 Coverage

**File:** `build/test.sh`, `package.json`

Gate `c8` on a `CIVET_COVERAGE=1` environment variable:

```bash
if [ "${CIVET_COVERAGE:-0}" = "1" ]; then
  runner="c8 mocha"
else
  runner="mocha"
fi
$runner $args "$@"
```

Add a `test:coverage` script to `package.json`:
```json
"test:coverage": "CIVET_COVERAGE=1 bash ./build/test.sh"
```

Update `prepublishOnly` to call `yarn test:coverage` instead of `yarn test`, ensuring coverage still runs before publishing.

**Effect:** `yarn test` saves ~14s for dev runs. CI/publishing still gets coverage via `test:coverage`.

### 3. Skip Browser/Terser in Dev Builds

**File:** `build/build.sh`

Add `CIVET_NO_BROWSER=1` support to skip the terser minification step:

```bash
if [ "${CIVET_NO_BROWSER:-}" != "1" ] && [ "${CIVET_SELF_BUILD:-}" != "1" ]; then
  terser "$out"/browser.js --compress --mangle --ecma 2015 --output civet.dev/public/__civet.js
fi
```

The existing `CIVET_SELF_BUILD=1` check already skips this step; the new flag makes it available independently for dev builds that don't need the docs site output.

**Effect:** `CIVET_NO_BROWSER=1 yarn build` saves ~1.3s.

### 4. Parallel Mocha by Default

**File:** `build/test.sh`

Enable `--parallel` mocha by default using the available CPU count, with `CIVET_THREADS` as an override:

```bash
threads="${CIVET_THREADS:-$(node -e 'process.stdout.write(String(require("os").cpus().length))')}"
if [ "$threads" != "0" ]; then
  args="--parallel -j $threads"
fi
```

`CIVET_THREADS=0` disables parallelism. The existing note about "Workers don't work within Mocha" referred to Node.js worker threads, not Mocha's `--parallel` mode (which uses separate child processes and is safe).

With the hera cache warm, each worker reads the cached parser in ~50ms instead of 5.7s, making parallelism beneficial rather than multiplying startup cost.

**Effect:** With cache warm and 4 workers: mocha time ~3–4s (down from ~13.7s).

---

## Data Flow

```
yarn test (dev)
  └─ build/test.sh
       ├─ CIVET_COVERAGE=0: mocha --parallel -j N
       │    ├─ worker 1: load .hera cache (~50ms) → run tests
       │    ├─ worker 2: load .hera cache (~50ms) → run tests
       │    └─ ...
       └─ tsc --noEmit (~0.5s, sequential)

yarn test:coverage (CI/publish)
  └─ CIVET_COVERAGE=1 build/test.sh
       └─ c8 mocha --parallel -j N
```

---

## Expected Results (Warm Cache)

| Step | Before | After |
|------|--------|-------|
| `yarn build` | ~6.5s | ~6.5s (unchanged) |
| `CIVET_NO_BROWSER=1 yarn build` | ~6.5s | ~5s |
| `yarn test` (dev, no coverage) | ~28s | ~4–5s |
| `yarn test:coverage` (CI) | ~28s | ~16s |

---

## Error Handling

- If the cache directory doesn't exist, create it before writing. If creation fails (permissions), fall through to normal compilation without caching.
- If a cache file is corrupt/unreadable, fall through to normal compilation and overwrite the cache entry.
- These are soft failures — caching is an optimization, not a correctness requirement.

---

## Testing

- Run `yarn test` before and after each change; verify all 3229 tests still pass.
- Verify cache is populated after first run (`ls .cache/hera/`).
- Verify warm run is faster by timing two consecutive `yarn test` runs.
- Verify `yarn test:coverage` still produces coverage output.
- Verify `prepublishOnly` still runs tests + coverage (dry run with `--dry-run`).
- Verify `CIVET_THREADS=0` disables parallelism.
