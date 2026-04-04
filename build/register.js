'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { compileWithCache } = require('./cache-utils.js');

if (require.extensions) {
  require.extensions['.hera'] = function(module, filename) {
    const source = fs.readFileSync(filename, 'utf8');
    module._compile(compileWithCache(source, filename, false), filename);
  };

  require.extensions['.civet'] = function(module, filename) {
    const source = fs.readFileSync(filename, 'utf8');
    module._compile(compileWithCache(source, filename, false), filename);
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
