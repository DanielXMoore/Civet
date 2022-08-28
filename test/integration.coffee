fs = require "fs"

{parse} = require "../source/parser"
gen = require "../source/generate"

assert = require "assert"

compile = (src) ->
  Function gen (parse src), {}

describe "integration", ->
  it "should parse CoffeeScript 2 files", ->
    src = fs.readFileSync("integration/example/generate.coffee", "utf8")

    assert compile(src)

  # TODO: CoffeeScript single line comments
  it.skip "should parse CoffeeScript 2 files", ->
    src = fs.readFileSync("integration/example/util.coffee", "utf8")

    assert compile(src)
