const { compile } = require('./')

module.exports = {
  process(sourceText, filename, options) {
    const { code, sourceMap } = compile(sourceText, {
      filename,
      js: true,
      sync: true,
      sourceMap: true,
    });
    return { code, map: sourceMap.json() }
  },
  async processAsync(sourceText, filename, options) {
    const { code, sourceMap } = await compile(sourceText, {
      filename,
      js: true,
      sourceMap: true,
    });
    return { code, map: sourceMap.json() }
  },
};
