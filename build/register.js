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
  const hash = crypto.createHash('sha1');
  for (const part of parts) hash.update(part).update('\0');
  return path.join(cacheDir, hash.digest('hex') + '.mjs');
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
