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
./dist/civet --no-config --js -c source/esbuild-plugin.civet -o dist/esbuild-plugin.js

# esm loader
./dist/civet --no-config --js -c source/esm.civet -o dist/esm.mjs

# types
cp types/types.d.ts dist/types.d.ts

# unplugin
yarn --cwd ./integration/unplugin install
yarn --cwd ./integration/unplugin build
cp ./integration/unplugin/dist/* ./dist

# create browser build for docs
terser dist/browser.js --compress --mangle --ecma 2015 --output civet.dev/public/__civet.js
