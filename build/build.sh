#!/bin/bash
set -euo pipefail

# normal files
coffee build/esbuild.coffee

# cli
BIN="dist/civet"
echo "#!/usr/bin/env node" | cat - dist/cli.js > "$BIN"
chmod +x "$BIN"
rm dist/cli.js

# esbuild-plugin
./dist/civet --js -c source/esbuild-plugin.civet -o dist/esbuild-plugin.js

# esm loader
./dist/civet --js -c source/esm.civet -o dist/esm.mjs

# types
cp types/types.d.ts dist/types.d.ts

# create browser build for docs
npx terser dist/browser.js --compress --mangle --ecma 2015 --output civet.dev/public/__civet.js
