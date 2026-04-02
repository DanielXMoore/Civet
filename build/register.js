'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { getCachePath, readCache, writeCache } = require('./cache-utils.js');

const { compile: heraCompile } = require('@danielx/hera/dist/main.js');
const heraVersion = require('@danielx/hera/package.json').version;

const civetSourceRaw = process.env.CIVET_SOURCE ?? './node_modules/@danielx/civet';
const civetSourceResolved = civetSourceRaw.startsWith('.')
  ? require.resolve(path.resolve(process.cwd(), civetSourceRaw))
  : require.resolve(civetSourceRaw);

const civetSourceMtime = fs.statSync(civetSourceResolved).mtime;
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

function compileWithCache(type, source, filename) {
  const p = getCachePath({ type, civetVersion, heraVersion, source, filename, cacheDir });
  const cached = readCache(p);
  if (cached) return cached;

  let js;
  if (type === 'hera-cjs') {
    // TODO: Eventually compose the sourcemaps for more accurate remapping
    const civetOutput = heraCompile(source, { filename });
    js = civetCompile(civetOutput, { filename, js: true, inlineMap: true, sync: true });
  } else {
    js = civetCompile(source, { filename, js: true, inlineMap: true, sync: true });
  }

  writeCache(p, js);
  return js;
}

if (require.extensions) {
  require.extensions['.hera'] = function(module, filename) {
    const source = fs.readFileSync(filename, 'utf8');
    module._compile(compileWithCache('hera-cjs', source, filename), filename);
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
