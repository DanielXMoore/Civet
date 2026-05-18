#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const args = process.argv.slice(2)
const pkg = require('../package.json')

if (args.includes('--version') || args.includes('-v')) {
  console.log(pkg.version)
  process.exit(0)
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(`${pkg.name} ${pkg.version}`)
  console.log(pkg.description)
  console.log()
  console.log('Usage: civet-lsp [options]')
  console.log()
  console.log('Options:')
  console.log('  -v, --version  Print version and exit')
  console.log('  -h, --help     Print this help and exit')
  console.log('  --stdio        Communicate over stdio (default)')
  console.log()
  console.log('Run without arguments to start the language server on stdio.')
  console.log(`See ${pkg.repository.url} for documentation.`)
  process.exit(0)
}

const serverPath = path.join(__dirname, '..', 'dist', 'node.js')

if (!fs.existsSync(serverPath)) {
  console.error('civet-lsp has not been built yet. Run `pnpm -C lsp/server build` first.')
  process.exit(1)
}

// vscode-languageserver demands an explicit connection mode; default to --stdio
// when none of --stdio / --node-ipc / --socket / --pipe is present.
const hasConnectionMode = args.some(a =>
  a === '--stdio' || a === '--node-ipc' ||
  a === '--socket' || a.startsWith('--socket=') ||
  a === '--pipe' || a.startsWith('--pipe=')
)
if (!hasConnectionMode) process.argv.push('--stdio')

require(serverPath)
