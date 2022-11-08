if process.argv.includes "--version"
  process.stdout.write require("../package.json").version + "\n"
  process.exit(0)

{parse, compile, generate} = require "./main"
{prune} = generate

encoding = "utf8"
process.stdin.setEncoding encoding

fs = require "fs"
readline = require 'node:readline'

readLines = (rl) ->
  new Promise (resolve, reject) ->
    parts = []
    rl.on 'line', (buffer) -> parts.push buffer + '\n'
    rl.on 'SIGINT', ->
      rl.write '^C\n'
      reject()
    rl.on 'close', ->
      resolve parts.join ''

readLines readline.createInterface process.stdin, process.stdout
.then (input) ->
  process.argv.includes "--ast"
  js = process.argv.includes "--js"
  inlineMap = process.argv.includes "--inline-map"

  if ast
    ast = prune parse input
    process.stdout.write JSON.stringify(ast, null, 2)
    process.exit(0)

  output = compile input, {js, inlineMap}
  process.stdout.write output
.catch -> process.exit 1
