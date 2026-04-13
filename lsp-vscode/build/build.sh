#!/bin/bash
set -euo pipefail

export NODE_ENV=${1-}

rm -rf dist

# Build lsp-server first so we can copy its output
(cd ../lsp-server && bash ./build/build.sh ${1-})

${CIVET_BIN:-../dist/civet} build/build.civet

# Copy server output from lsp-server
mkdir -p dist/lib
cp ../lsp-server/dist/server.js dist/server.js
cp -r ../lsp-server/dist/lib/. dist/lib/

# Rewrite source map paths to absolute so c8 can remap e2e coverage back to
# lsp-server/source/ correctly (relative paths would resolve to lsp-vscode/source/).
node -e "
  const fs = require('fs'), path = require('path');
  const src = '../lsp-server/dist/server.js.map';
  if (!fs.existsSync(src)) process.exit(0);
  const map = JSON.parse(fs.readFileSync(src, 'utf8'));
  const base = path.resolve('../lsp-server/dist');
  map.sources = map.sources.map(s => path.resolve(base, s));
  fs.writeFileSync('dist/server.js.map', JSON.stringify(map));
"
