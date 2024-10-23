#!/bin/bash
set -euo pipefail

export NODE_ENV=${1-}

rm -rf dist

node_modules/.bin/civet build/build.civet

mkdir -p dist/lib
cp node_modules/typescript/lib/lib.*.d.ts dist/lib
cp source/tsconfig-lib.json dist/lib/tsconfig.json
