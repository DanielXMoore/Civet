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
./dist/civet < source/esbuild-plugin.civet > dist/esbuild-plugin.js

# esm loader
./dist/civet --js < source/esm.civet > dist/esm.mjs

# types
cp types/types.d.ts dist/types.d.ts
