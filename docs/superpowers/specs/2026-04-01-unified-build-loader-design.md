# Unified Build Loader Design

**Date:** 2026-04-01  
**Branch:** civet-in-hera  
**Status:** Approved

## Overview

Consolidate four build-time loader files into two: `build/register.js` and `build/esm-hook.mjs`. The unified loader handles both `.hera` and `.civet` files with disk caching, and supports a configurable Civet source for normal vs. self-test runs.

The compilation chain on this branch is: `.hera` → Civet source → `.js`

## Files

### Before (4 files)
- `build/hera-register.js` — CJS hook + ESM registration for `.hera`
- `build/hera-esm-hook.mjs` — ESM hook for `.hera` with disk cache
- `build/civet-cache-register.js` — ESM registration for `.civet` with caching (LIFO override)
- `build/civet-esm-hook.mjs` — ESM hook for `.civet` with disk cache

### After (2 files)
- `build/register.js` — CJS hooks for `.hera` and `.civet` + ESM hook registration
- `build/esm-hook.mjs` — ESM hook for both `.hera` and `.civet` with unified disk cache

## Configuration

Civet source is selected via environment variable:

| Env var | Default | Use case |
|---------|---------|----------|
| `CIVET_SOURCE` | `require.resolve('@danielx/civet')` | Published civet |
| `CIVET_SOURCE=./dist/main.js` | — | Local built civet (self-test) |

Hera is always the installed `@danielx/hera` — no override needed.

Cache directory: `<project-root>/.cache/build` (single shared cache for both file types).

## mocharc Changes

**.mocharc.json** (normal test run, published civet):
```json
{
  "require": ["./build/register.js"]
}
```

**.mocharc-self.json** (self-test, local built civet):
```json
{
  "require": ["./build/register.js"],
  "env": { "CIVET_SOURCE": "./dist/main.js" }
}
```

## `build/register.js`

1. Resolve `civetSource` from `process.env.CIVET_SOURCE ?? require.resolve('@danielx/civet')`
2. Resolve `cacheDir` to `path.resolve(__dirname, '../.cache/build')`
3. Load `civetCompile` from `civetSource` and `heraCompile` from `@danielx/hera/dist/main.js`
4. Register `require.extensions['.hera']`:
   - `heraCompile(source)` → `civetOutput` (Civet source string)
   - `civetCompile(civetOutput, { js: true, inlineMap: true, sync: true })` → JS
   - `module._compile(js, filename)`
5. Register `require.extensions['.civet']`:
   - `civetCompile(source, { js: true, inlineMap: true, sync: true })` → JS
   - `module._compile(js, filename)`
6. Call `module.register('./esm-hook.mjs', pathToFileURL(__filename), { data: { civetSource, cacheDir } })`

## `build/esm-hook.mjs`

### `initialize({ civetSource, cacheDir })`
- Load `civetCompile` from `civetSource`
- Load `heraCompile` from `@danielx/hera/dist/main.js`
- Capture `civetVersion` and `heraVersion` for cache keying

### `resolve(specifier, context, next)`
- `/\.hera$/` → `{ shortCircuit: true, format: 'hera', url }`
- `/\.civet$/` → `{ shortCircuit: true, format: 'civet', url }`
- Otherwise → `next()`

### `load(url, context, next)`

**format `'hera'`:**
- Read source from `fileURLToPath(url)`
- Cache key: `sha1(heraVersion + '\0' + civetVersion + '\0' + source + '\0' + filename + '\0hera')`
- Cache hit: return `{ format: 'module', source: cached, shortCircuit: true }`
- Cache miss:
  1. `heraCompile(source, { filename, module: true })` → Civet source
  2. `civetCompile(civetSource, { filename, js: true, inlineMap: true })` → JS
  3. Write cache atomically (`.tmp.PID` → rename), soft-fail
  4. Return `{ format: 'module', source: js, shortCircuit: true }`

**format `'civet'`:**
- Read source from `fileURLToPath(url)`
- Cache key: `sha1(civetVersion + '\0' + source + '\0' + filename + '\0civet')`
- Cache hit / miss: same pattern as above, skip Hera step
- Return `{ format: 'module', source: js, shortCircuit: true }`

**Other formats:** `next(url, context)`

## Cache

- Location: `.cache/build/` (gitignored)
- Files named `<sha1-hex>.mjs`
- Atomic writes: write `<hash>.mjs.tmp.<pid>`, rename to `<hash>.mjs`
- Cache writes soft-fail (network FS, permissions issues)
- Invalidated automatically when source, filename, hera version, or civet version changes
