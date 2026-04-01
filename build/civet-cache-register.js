'use strict';

const path = require('path');

const cacheDir = path.resolve(__dirname, '../.cache/civet');

// Register ESM hook for .civet files (runs before old civet's hook due to LIFO)
try {
  const { register } = require('node:module');
  const { pathToFileURL } = require('node:url');
  register(
    pathToFileURL(path.resolve(__dirname, './civet-esm-hook.mjs')).href,
    pathToFileURL(__filename),
    { data: { cacheDir } }
  );
} catch {
  // Node version doesn't support module.register()
}
