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

const civetSourceRaw = process.env.CIVET_SOURCE ?? './node_modules/@danielx/civet';
const civetSourceResolved = require.resolve(path.resolve(civetSourceRaw));
const civetSourceMtime = fs.statSync(civetSourceResolved).mtime.getTime().toString();
const { compile: civetCompile } = require(civetSourceResolved);

const { hashParts, createDiskCache } = require('../dist/cache.js');

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
 * Compute cache key for a compiled source file.
 * `mode` is included in the hash so JS and TS outputs land in separate slots.
 */
function makeKey({ source, filename, module, mode = 'js' }) {
  return hashParts([heraVersion, civetVersion, civetSourceMtime, source, filename, module.toString(), mode]);
}

function compileWithCache(source, filename, module = true) {
  const key = makeKey({ source, filename, module }) + '.mjs';
  const cached = diskCache.get(key);
  if (cached != null) return cached;

  const type = filename.endsWith('.hera') ? 'hera' : 'civet';
  let js;
  if (type === 'hera') {
    const civetOutput = heraCompile(source, { filename, module, inlineMap: true });
    js = civetCompile(civetOutput, { filename, js: true, inlineMap: true, sync: true });
  } else {
    js = civetCompile(source, { filename, js: true, inlineMap: true, sync: true });
  }

  diskCache.set(key, js);
  return js;
}

/**
 * Compile a .civet or .hera file to TypeScript (for type-checking), returning
 * `{ code, sourceMapLines }`.  Caches code and sourcemap lines on disk keyed
 * the same way as `compileWithCache` but in a separate TS slot.
 */
function compileToTS(source, filename, module = true) {
  const baseKey = makeKey({ source, filename, module, mode: 'ts' });
  const codeKey = baseKey + '.ts';
  const mapKey = baseKey + '.map.json';
  const cachedCode = diskCache.get(codeKey);
  const cachedMap = diskCache.get(mapKey);
  if (cachedCode != null && cachedMap != null) {
    return { code: cachedCode, sourceMapLines: JSON.parse(cachedMap) };
  }

  const type = filename.endsWith('.hera') ? 'hera' : 'civet';
  let result;
  if (type === 'hera') {
    const heraResult = heraCompile(source, { filename, module, sourceMap: true });
    result = civetCompile(heraResult.code, {
      filename, js: false, sourceMap: true, sync: true,
      parseOptions: { rewriteCivetImports: '.civet.tsx' },
      upstreamSourceMap: heraResult.sourceMap,
    });
  } else {
    result = civetCompile(source, {
      filename, js: false, sourceMap: true, sync: true,
      parseOptions: { rewriteCivetImports: '.civet.tsx' },
    });
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
