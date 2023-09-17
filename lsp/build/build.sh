#!/bin/bash
set -euo pipefail

rm -rf dist

node_modules/.bin/civet build/build.civet

mkdir -p dist/lib
cp node_modules/typescript/lib/lib.*.d.ts dist/lib
