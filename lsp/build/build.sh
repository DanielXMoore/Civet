#!/bin/bash
set -euo pipefail

export NODE_ENV=${1-}

rm -rf dist

${CIVET_BIN:-../dist/civet} build/build.civet

mkdir -p dist/lib
cp node_modules/typescript/lib/lib.*.d.ts dist/lib
cp source/tsconfig-lib.json dist/lib/tsconfig.json

if [ "${NODE_ENV-}" = "development" ]; then
  # Copy TypeScript lib files so dist/server.js can resolve getDefaultLibFileName.
  mkdir -p dist/lib
  cp node_modules/typescript/lib/lib.*.d.ts dist/lib
  cp source/tsconfig-lib.json dist/lib/tsconfig.json

  # Rewrite source map sources to absolute paths so that v8-to-istanbul's
  # excludePath callback receives a path that test-exclude can match.
  # The source map uses relative paths like "../source/server.civet"
  # (relative to dist/) which test-exclude rejects because they start with "../".
  # Absolute paths are made relative to cwd by test-exclude and correctly
  # matched against include: ["source"].
  MAP=dist/server.js.map
  node -e "
    const fs = require('fs')
    const path = require('path')
    const map = JSON.parse(fs.readFileSync('$MAP', 'utf8'))
    const base = path.resolve('dist')
    map.sources = map.sources.map(s => path.resolve(base, s))
    fs.writeFileSync('$MAP', JSON.stringify(map))
  "
fi
