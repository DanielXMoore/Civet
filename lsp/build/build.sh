#!/bin/bash
set -euo pipefail

export NODE_ENV=${1-}

rm -rf dist

node_modules/.bin/civet build/build.civet

mkdir -p dist/lib
TS_LIB_DIR=$(node -p "require('path').dirname(require.resolve('typescript'))")
cp "$TS_LIB_DIR"/lib.*.d.ts dist/lib
cp source/tsconfig-lib.json dist/lib/tsconfig.json
