{parse} = require "./parser"
gen = require "./generate"

module.exports =
  parse: parse
  compile: (src, options) ->
    gen parse(src), options
