'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { compile: heraCompile } = require('@danielx/hera/dist/main.js');
const heraVersion = require('@danielx/hera/package.json').version;
const cacheDir = path.resolve(__dirname, '../.cache/hera');

function getCachePath(source, filename) {
  const key = crypto
    .createHash('sha1')
    .update(heraVersion)
    .update('\0')
    .update(source)
    .update('\0')
    .update(filename || '')
    .digest('hex');
  return path.join(cacheDir, key + '.js');
}

function ensureCacheDir() {
  try {
    fs.mkdirSync(cacheDir, { recursive: true });
  } catch {
    // ignore — soft failure, caching is optional
  }
}

function compileWithCache(source, options) {
  const cachePath = getCachePath(source, options.filename);

  try {
    return fs.readFileSync(cachePath, 'utf8');
  } catch {
    // cache miss — compile and store
  }

  const compiled = heraCompile(source, options);
  ensureCacheDir();
  try {
    const tmpPath = cachePath + '.tmp.' + process.pid;
    fs.writeFileSync(tmpPath, compiled);
    fs.renameSync(tmpPath, cachePath);
  } catch {
    // ignore write failure — soft failure
  }
  return compiled;
}

// CJS hook (for require() of .hera files)
if (require.extensions) {
  try {
    require('@cspotcode/source-map-support/register-hook-require');
  } catch {
    // optional dependency
  }

  require.extensions['.hera'] = function(module, filename) {
    const source = fs.readFileSync(filename, 'utf8');
    const compiled = compileWithCache(source, { filename, inlineMap: true });
    return module._compile(compiled, filename);
  };
}

// Register ESM hook for .hera files
try {
  const { register } = require('node:module');
  const { pathToFileURL } = require('node:url');
  const heraMainPath = pathToFileURL(require.resolve('@danielx/hera/dist/main.js')).href;
  register(
    pathToFileURL(require.resolve('./hera-esm-hook.mjs')).href,
    pathToFileURL(__filename),
    { data: { cacheDir, heraMainPath } }
  );
} catch {
  // Node version doesn't support module.register(), ESM hook unavailable
}
