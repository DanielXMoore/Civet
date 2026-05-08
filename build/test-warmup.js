'use strict';

// Mocha root hook plugin: runs once per worker before any test.
// Pays cold-start cost (V8 JIT on parser/codegen, Civet register chain,
// esbuild native binding init) inside a hook timeout instead of inside
// the first it()'s 5s budget. Without this, the first tiny test in a
// fresh worker can blow its timeout on Windows CI under scheduling jitter.
exports.mochaHooks = {
  async beforeAll() {
    this.timeout(30000);
    const { compile } = require('../source/main.civet');
    const esbuild = require('esbuild');
    esbuild.transformSync(await compile('1 + 1'), { loader: 'tsx' });
  },
};
