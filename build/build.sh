#!/bin/bash
set -euo pipefail

# normal files
civet --no-config build/esbuild.civet

# cli
BIN="dist/civet"
echo "#!/usr/bin/env node" | cat - dist/cli.js > "$BIN"
chmod +x "$BIN"
rm dist/cli.js

# babel plugin
cp source/babel-plugin.mjs dist/babel-plugin.mjs

# types
cp types/types.d.ts dist/types.d.ts

# create browser build for docs
terser dist/browser.js --compress --mangle --ecma 2015 --output civet.dev/public/__civet.js
