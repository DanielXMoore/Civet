if process.argv.includes "--version"
  process.stdout.write require("../package.json").version + "\n"
  process.exit(0)

{parse, compile, generate} = require "./main"
{prune} = generate

encoding = "utf8"
fs = require "fs"

read = (stream, encoding) ->
  new Promise (resolve, reject) ->
    parts = []
    stream.resume()
    stream.on 'data', (buffer) -> parts.push buffer
    stream.on 'error', reject
    stream.on 'end', ->
      resolve Buffer.concat(parts).toString(encoding)

read(process.stdin, encoding).then (input) ->
  process.argv.includes "--ast"
  js = process.argv.includes "--js"
  inlineMap = process.argv.includes "--inline-map"

  if ast
    ast = prune parse input
    process.stdout.write JSON.stringify(ast, null, 2)
    process.exit(0)

  output = compile input, {js, inlineMap}
  process.stdout.write output
