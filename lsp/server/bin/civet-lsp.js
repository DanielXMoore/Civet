#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const serverPath = path.join(__dirname, '..', 'dist', 'server.js')

if (!fs.existsSync(serverPath)) {
  console.error('civet-lsp has not been built yet. Run `pnpm -C lsp/server build` first.')
  process.exit(1)
}

require(serverPath)
