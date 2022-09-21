{ parse } = require "./parser"
{ prune } = gen = require "./generate"
{ SourceMap } = util = require "./util"

defaultOptions = {}

module.exports =
  parse: parse
  compile: (src, options=defaultOptions) ->
    ast = prune parse(src, {
      filename: options.filename
    })

    if options.sourceMap
      sm = SourceMap(src)
      options.updateSourceMap = sm.updateSourceMap
      code = gen ast, options
      return {
        code,
        sourceMap: sm
      }

    gen ast, options
  generate: gen
  util: util
