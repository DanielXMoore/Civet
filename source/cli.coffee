{parse} = require "./main"
generate = require "./generate"

encoding = "utf8"
fs = require "fs"

input = fs.readFileSync process.stdin.fd, encoding

ast = parse input

if process.argv.includes "--ast"
  process.stdout.write JSON.stringify(ast, null, 2)
  return

output = generate ast
process.stdout.write output
