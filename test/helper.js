// Temporary cjs helper until everything is migrated to esm
const { parse } = require("../source/parser.hera")

const gen = require("../source/generate.coffee")
const assert = require("assert")

const verbose = false;

const compare = function (src, result, filename) {
  const ast = parse(src, { filename, verbose });
  assert.equal(gen(gen.prune(ast), {}), result);
};

const testCase = function (text) {
  const [desc, src, result] = text.split("\n---\n");

  it(desc, function () {
    compare(src, result, desc);
  });
};

const throws = function (text) {
  assert.throws(function () {
    gen(parse(text));
  });
};

module.exports = {
  compare,
  testCase,
  throws,
};
