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
 */
function getCachePath({ source, filename, module }) {
  const hash = crypto.createHash('sha1');
  const parts = [heraVersion, civetVersion, civetSourceMtime, source, filename, module.toString()];
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
    // TODO: Eventually compose the sourcemaps for more accurate remapping
    const civetOutput = heraCompile(source, { filename, module });
    js = civetCompile(civetOutput, { filename, js: true, inlineMap: true, sync: true });
  } else {
    js = civetCompile(source, { filename, js: true, inlineMap: true, sync: true });
  }

  writeCache(p, js);
  return js;
}

module.exports = { compileWithCache };
