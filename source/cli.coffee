if process.argv.includes "--version"
  process.stdout.write require("../package.json").version + "\n"
  process.exit(0)

{parse, compile, generate} = require "./main"
{prune} = generate

encoding = "utf8"
fs = require "fs"

input = fs.readFileSync process.stdin.fd, encoding

process.argv.includes "--ast"
js = process.argv.includes "--js"
inlineMap = process.argv.includes "--inline-map"

if ast
  ast = prune parse input
  process.stdout.write JSON.stringify(ast, null, 2)
  process.exit(0)

output = compile input, {js, inlineMap}
process.stdout.write output
