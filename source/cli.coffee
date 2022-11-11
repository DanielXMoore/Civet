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

readLines readline.createInterface process.stdin
.then (input) ->
  process.argv.includes "--ast"
  js = process.argv.includes "--js"
  inlineMap = process.argv.includes "--inline-map"

  filename = "unknown"
  try
    filename = fs.realpathSync '/dev/stdin'

  if ast
    ast = prune parse(input, {
      filename
    })
    process.stdout.write JSON.stringify(ast, null, 2)
    process.exit(0)

  output = compile input, {filename, js, inlineMap}
  process.stdout.write output
.catch (e) ->
  console.error e
  process.exit 1
