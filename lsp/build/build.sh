#!/bin/bash
set -euo pipefail

rm -rf dist

node build/build.mjs

mkdir dist/lib
cp node_modules/typescript/lib/lib.*.d.ts dist/lib
