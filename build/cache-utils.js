'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Compute cache file path for a compiled source file.
 *
 * type 'civet'    — ESM civet (shared key between CJS hook and ESM hook)
 * type 'hera'     — ESM hera  (ESM hook, module:true compilation)
 * type 'hera-cjs' — CJS hera  (CJS hook, different compile options)
 */
function getCachePath({ type, civetVersion, heraVersion = '', source, filename, cacheDir }) {
  let key;
  if (type === 'civet') {
    key = crypto.createHash('sha1')
      .update(civetVersion).update('\0')
      .update(source).update('\0')
      .update(filename).update('\0civet')
      .digest('hex');
  } else if (type === 'hera') {
    key = crypto.createHash('sha1')
      .update(heraVersion).update('\0')
      .update(civetVersion).update('\0')
      .update(source).update('\0')
      .update(filename).update('\0hera')
      .digest('hex');
  } else {
    // hera-cjs
    const hash = crypto.createHash('sha1');
    for (const part of [heraVersion, civetVersion, source, filename, 'hera-cjs']) {
      hash.update(part).update('\0');
    }
    key = hash.digest('hex');
  }
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

module.exports = { getCachePath, readCache, writeCache };
