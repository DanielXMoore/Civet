#!/bin/bash
set -euo pipefail

export NODE_ENV=${1-}

rm -rf dist
mkdir dist

# Build lsp-server first so we can copy its output
(cd ../lsp-server && bash ./build/build.sh ${1-})

${CIVET_BIN:-../dist/civet} build/build.civet

# Copy server output from lsp-server
mkdir -p dist/lib
cp ../lsp-server/dist/server.js dist/server.js
cp -r ../lsp-server/dist/lib/. dist/lib/
