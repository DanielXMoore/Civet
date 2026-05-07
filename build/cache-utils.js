/**
 * Shared disk cache for the build-time Civet and Hera loaders
 * (register.js / esm-hook.mjs when testing, esbuild.civet when building).
 * Compiled output is stored in .cache/build/ keyed by a SHA1 of the compiler version(s),
 * civet mtime, source text, and filename, so cache entries are automatically invalidated
 * when any of those change.
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const { compile: heraCompile } = require('@danielx/hera/dist/main.js');
const heraVersion = require('@danielx/hera/package.json').version;

const civetSourceRaw = process.env.CIVET_SOURCE ?? './node_modules/@danielx/civet';
const civetSourceResolved = require.resolve(path.resolve(civetSourceRaw))

const civetSourceMtime = fs.statSync(civetSourceResolved).mtime.getTime().toString();
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

/**
 * Compute cache file path for a compiled source file.
 * `mode` is included in the hash so JS and TS outputs land in separate slots.
 */
function getCachePath({ source, filename, module, mode = 'js' }) {
  const hash = crypto.createHash('sha1');
  const parts = [heraVersion, civetVersion, civetSourceMtime, source, filename, module.toString(), mode];
  for (const part of parts) {
    hash.update(part).update('\0');
  }
  const key = hash.digest('hex');
  return path.join(cacheDir, key + '.mjs');
}

function readCache(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch {}
}

function writeCache(p, content) {
  try { fs.mkdirSync(path.dirname(p), { recursive: true }); } catch {}
  try {
    const tmp = p + '.tmp.' + process.pid;
    fs.writeFileSync(tmp, content);
    fs.renameSync(tmp, p);
  } catch {}
}

function compileWithCache(source, filename, module = true) {
  const p = getCachePath({ source, filename, module });
  const cached = readCache(p);
  if (cached) return cached;

  const type = filename.endsWith('.hera') ? 'hera' : 'civet';

  let js;
  if (type === 'hera') {
    const civetOutput = heraCompile(source, { filename, module, inlineMap: true });
    js = civetCompile(civetOutput, { filename, js: true, inlineMap: true, sync: true });
  } else {
    js = civetCompile(source, { filename, js: true, inlineMap: true, sync: true });
  }

  writeCache(p, js);
  return js;
}

/**
 * Compile a .civet or .hera file to TypeScript (for type-checking), returning
 * `{ code, sourceMapLines }`.  Caches code and sourcemap lines on disk keyed the
 * same way as `compileWithCache` but in a separate TS slot.
 */
function compileToTS(source, filename, module = true) {
  const p = getCachePath({ source, filename, module, mode: 'ts' });
  const codePath = p.replace(/\.mjs$/, '.ts');
  const mapPath = p.replace(/\.mjs$/, '.map.json');
  const cachedCode = readCache(codePath);
  const cachedMap = readCache(mapPath);
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
  writeCache(codePath, code);
  writeCache(mapPath, JSON.stringify(lines));
  return { code, sourceMapLines: lines };
}

module.exports = { compileWithCache, compileToTS };
