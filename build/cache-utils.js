/**
 * Bootstrap shim for the build-time Civet/Hera loaders (register.js,
 * esm-hook.mjs, esbuild.civet).  Cache primitives (hashing, disk backend)
 * live in source/cache.civet; this file is the CJS entry that loads them
 * and wires in compiler-version inputs for the hash.
 *
 * Compiled output is stored in .cache/build/ keyed by a SHA1 of the
 * compiler version(s), civet mtime, source text, filename, and mode, so
 * cache entries are invalidated automatically when any of those change.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const { compile: heraCompile } = require('@danielx/hera/dist/main.js');
const heraVersion = require('@danielx/hera/package.json').version;

// Pick the civet source.  Preference order:
//   1. CIVET_SOURCE env var (explicit override).
//   2. The workspace's locally-built ./dist/main.js if it exists — keeps
//      compileWithCache aligned with `import from '@danielx/civet'`, which
//      resolves via the workspace package self-reference to the same file.
//      Aligning the two avoids c8 merge ambiguity: when the installed
//      package and the workspace differ on codegen (e.g., if/then/else
//      assignment ⇒ ternary in 0.11.9 vs let-ref in 0.11.6), compiling the
//      same .civet source via both paths produces JS with slightly different
//      fnMap byte ranges.  Both end up attributed to the same source URL via
//      source maps, but c8's merge can't reconcile two records under one URL
//      with different fnMaps — phantom uncovered functions, flaky 99.x% gate.
//   3. ./node_modules/@danielx/civet — the installed package, used during
//      first-time bootstrap before dist/main.js exists.
const distMainJs = path.resolve(__dirname, '../dist/main.js');
const civetSourceRaw = process.env.CIVET_SOURCE
  ?? (fs.existsSync(distMainJs) ? distMainJs : './node_modules/@danielx/civet');
const civetIsPath = civetSourceRaw.startsWith('.') || path.isAbsolute(civetSourceRaw);
const civetSourceResolved = require.resolve(civetIsPath ? path.resolve(civetSourceRaw) : civetSourceRaw);
const civetSourceMtime = fs.statSync(civetSourceResolved).mtime.getTime().toString();
const { compile: civetCompile } = require(civetSourceResolved);

const { makeCacheKey, createDiskCache } = require('../dist/cache.js');

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
const diskCache = createDiskCache(cacheDir);

/**
 * Build a CacheKeyInput for a single file compile.  The compiler-name + the
 * primary compiler version disambiguate civet vs hera; civetVersion +
 * civetSourceMtime are always included so the hera path (which runs civet
 * as its second stage) re-keys when either compiler changes.
 */
function keyInput(source, filename, isHera, options) {
  return {
    source,
    sourcePath: filename,
    compilerName: isHera ? 'hera' : 'civet',
    compilerVersion: isHera ? heraVersion : civetVersion,
    civetVersion,
    civetMtime: civetSourceMtime,
    options,
  };
}

function compileWithCache(source, filename, module = true) {
  const isHera = filename.endsWith('.hera');
  const compileOptions = { js: true, inlineMap: true, sync: true, module };
  const key = makeCacheKey(keyInput(source, filename, isHera, compileOptions)) + '.mjs';
  const cached = diskCache.get(key);
  if (cached != null) {
    tap('hit', filename, module, key, cached);
    return cached;
  }

  let js;
  if (isHera) {
    const civetOutput = heraCompile(source, { filename, module, inlineMap: true });
    js = civetCompile(civetOutput, { filename, ...compileOptions });
  } else {
    js = civetCompile(source, { filename, ...compileOptions });
  }

  diskCache.set(key, js);
  tap('miss', filename, module, key, js);
  return js;
}

/**
 * Diagnostic tap: log compile invocations so CI can correlate which
 * filename/module/key produced which output.  Enabled by CIVET_COMPILE_TAP
 * env var (path to log file).  Each line: `<pid> <event> <md5> <len> <module> <keyTail> <filename>`.
 */
let _tapPath;
let _tapResolved = false;
function tap(event, filename, module, key, js) {
  if (!_tapResolved) {
    _tapPath = process.env.CIVET_COMPILE_TAP || null;
    _tapResolved = true;
  }
  if (!_tapPath) return;
  try {
    const md5 = require('crypto').createHash('md5').update(js).digest('hex').slice(0, 12);
    const keyTail = key.slice(0, 12);
    fs.appendFileSync(_tapPath, `${process.pid} ${event} ${md5} ${js.length} module=${module} key=${keyTail} ${filename}\n`);
  } catch {}
}

/**
 * Compile a .civet or .hera file to TypeScript (for type-checking), returning
 * `{ code, sourceMapLines }`.  TS-mode options (`js: false`, `sourceMap: true`,
 * `parseOptions.rewriteCivetImports`) put this in a different cache slot from
 * `compileWithCache` automatically — the only manual disambiguation is the
 * `.ts` / `.map.json` key suffix that lets us store code and lines separately.
 */
function compileToTS(source, filename, module = true) {
  const isHera = filename.endsWith('.hera');
  const compileOptions = {
    js: false, sourceMap: true, sync: true, module,
    parseOptions: { rewriteCivetImports: '.civet.tsx' },
  };
  const baseKey = makeCacheKey(keyInput(source, filename, isHera, compileOptions));
  const codeKey = baseKey + '.ts';
  const mapKey = baseKey + '.map.json';
  const cachedCode = diskCache.get(codeKey);
  const cachedMap = diskCache.get(mapKey);
  if (cachedCode != null && cachedMap != null) {
    return { code: cachedCode, sourceMapLines: JSON.parse(cachedMap) };
  }

  let result;
  if (isHera) {
    const heraResult = heraCompile(source, { filename, module, sourceMap: true });
    result = civetCompile(heraResult.code, {
      filename, ...compileOptions,
      upstreamSourceMap: heraResult.sourceMap,
    });
  } else {
    result = civetCompile(source, { filename, ...compileOptions });
  }

  const lines = result.sourceMap?.lines ?? result.sourceMap?.data?.lines ?? [];
  // Civet's rewriteTsImports only rewrites .civet imports; do the same for .hera
  // so TS's module resolver finds our virtual .hera.tsx siblings.
  const code = result.code.replace(/(\.hera)(?!\.tsx)(["'])/g, '$1.tsx$2');
  diskCache.set(codeKey, code);
  diskCache.set(mapKey, JSON.stringify(lines));
  return { code, sourceMapLines: lines };
}

module.exports = { compileWithCache, compileToTS };
