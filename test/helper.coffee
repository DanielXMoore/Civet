{parse} = require "../source/parser"
gen = require "../source/generate"

assert = require "assert"

verbose = false

compare = (src, result, filename) ->
  assert.equal gen(parse(src, {filename, verbose})), result

testCase = (text) ->
  [desc, src, result] = text.split("\n---\n")

  it desc, ->
    compare src, result, desc

throws = (text) ->
  assert.throws ->
    gen(parse(text))

module.exports = {
  compare
  testCase
  throws
}
