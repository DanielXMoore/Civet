'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const { compile: heraCompile } = require('@danielx/hera/dist/main.js');
const heraVersion = require('@danielx/hera/package.json').version;

const civetSourceRaw = process.env.CIVET_SOURCE ?? './node_modules/@danielx/civet';
const civetSourceResolved = civetSourceRaw.startsWith('.')
  ? require.resolve(path.resolve(process.cwd(), civetSourceRaw))
  : require.resolve(civetSourceRaw);

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
function getCachePath({ type, source, filename }) {
  const hash = crypto.createHash('sha1');
  const parts = [civetVersion, civetSourceMtime, source, filename];
  if (type === 'civet') {
    for (const part of parts) {
      hash.update(part).update('\0');
    }
  } else if (type === 'hera') {
    for (const part of [heraVersion, ...parts]) {
      hash.update(part).update('\0');
    }
  } else {
    throw new Error(`Invalid type: ${type}`);
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

module.exports = { getCachePath, readCache, writeCache, civetCompile, heraCompile };
