{parse} = require "./parser"
gen = require "./generate"

module.exports =
  parse: parse
  compile: (src) ->
    gen parse src
