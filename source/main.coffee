{ parse } = require "./parser"
{ prune } = gen = require "./generate"
{ SourceMap, base64Encode } = util = require "./util.coffee"

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
        srcMapJSON = sm.json(filename, "")
        # NOTE: separate comment to prevent this string getting picked up as actual sourceMappingURL in tools
        return "#{code}\n#{"//#"} sourceMappingURL=data:application/json;base64,#{base64Encode JSON.stringify(srcMapJSON)}\n"
      else
        return {
          code,
          sourceMap: sm
        }

    gen ast, options
  generate: gen
  util: util
