const { compile } = require('@danielx/hera')

module.exports = {
  process(sourceText, filename, options) {
    const { code, sourceMap } = compile(sourceText, {
      filename,
      sourceMap: true,
      module: true,
    });
    return { code, map: sourceMap.json() }
  },
}
