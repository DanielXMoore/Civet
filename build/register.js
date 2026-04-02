'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { getCachePath, readCache, writeCache, civetCompile, heraCompile } = require('./cache-utils.js');

function compileWithCache(type, source, filename) {
  const p = getCachePath({ type, source, filename });
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
  );
} catch {
  // Node version doesn't support module.register()
}
