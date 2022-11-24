if process.argv.includes "--version"
  process.stdout.write require("../package.json").version + "\n"
  process.exit(0)

if process.argv.includes "--help"
  process.stdout.write """
           ▄▄· ▪   ▌ ▐·▄▄▄ .▄▄▄▄▄
          ▐█ ▌▪██ ▪█·█▌▀▄.▀·•██       _._     _,-'""`-._
          ██ ▄▄▐█·▐█▐█•▐▀▀▪▄ ▐█.▪    (,-.`._,'(       |\\`-/|
          ▐███▌▐█▌ ███ ▐█▄▄▌ ▐█▌·        `-.-' \\ )-`( , o o)
          ·▀▀▀ ▀▀▀. ▀   ▀▀▀  ▀▀▀               `-    \\`_`"'-


    Usage:

        civet [options] < input.civet > output.ts

    Options:
      --help          Show this help message
      --version       Show the version number
      --ast           Output the AST instead of the compiled code
      --inline-map    Generate a sourcemap
      --js            Strip out all type annotations


  """
  process.exit(0)

{parse, compile, generate} = require "./main"
{prune} = generate

encoding = "utf8"
process.stdin.setEncoding encoding

fs = require "fs"
readline = try
  require 'node:readline'
catch
  require 'readline'

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
  ast =       process.argv.includes "--ast"
  cache =    !process.argv.includes "--no-cache"
  inlineMap = process.argv.includes "--inline-map"
  js =        process.argv.includes "--js"

  filename = "unknown"
  try
    filename = fs.realpathSync '/dev/stdin'

  output = compile input, {
    ast,
    cache,
    filename,
    inlineMap,
    js,
  }

  if ast
    output = JSON.stringify(output, null, 2)

  process.stdout.write output
.catch (e) ->
  console.error e
  process.exit 1
