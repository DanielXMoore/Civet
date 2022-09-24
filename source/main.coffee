{ parse } = require "./parser"
{ prune } = gen = require "./generate"
{ SourceMap } = util = require "./util"

defaultOptions = {}

module.exports =
  parse: parse
  compile: (src, options=defaultOptions) ->
    filename = options.filename or "unknown"
    ast = prune parse(src, {
      filename: filename
    })

    if options.ast
      return ast

    if options.sourceMap or options.inlineMap
      sm = SourceMap(src)
      options.updateSourceMap = sm.updateSourceMap
      code = gen ast, options

      if options.inlineMap
        srcMapJSON = sm.json(filename, filename.replace(/(?:\.civet$)?/, ".ts"))
        return "#{code}\n//# sourceMappingURL=data:application/json;base64,#{base64Encode JSON.stringify(srcMapJSON)}\n"
      else
        return {
          code,
          sourceMap: sm
        }

    gen ast, options
  generate: gen
  util: util

# Note: currently only works in node
base64Encode = (src) ->
  return Buffer.from(src).toString('base64')
