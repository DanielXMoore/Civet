if process.argv.includes "--version"
  process.stdout.write require("../package.json").version + "\n"
  process.exit(0)

{parse} = require "./main"
generate = require "./generate"

encoding = "utf8"
fs = require "fs"

input = fs.readFileSync process.stdin.fd, encoding

ast = parse input

js = process.argv.includes "--js"

if process.argv.includes "--ast"
  process.stdout.write JSON.stringify(ast, null, 2)
  return

output = generate ast, {js}
process.stdout.write output
