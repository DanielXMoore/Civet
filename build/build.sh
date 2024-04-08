#!/bin/bash
set -euo pipefail

# clean build
rm -rf dist

# normal files
civet --no-config build/esbuild.civet "$@"

# cli
BIN="dist/civet"
echo "#!/usr/bin/env node" | cat - dist/cli.js > "$BIN"
chmod +x "$BIN"
rm dist/cli.js

# babel plugin
cp source/babel-plugin.mjs dist/babel-plugin.mjs

# types
cp types/types.d.ts dist/types.d.ts

# unplugin
node -e 'import("./node_modules/vite/dist/node/constants.js").then((c)=>console.log(`export const DEFAULT_EXTENSIONS = ${JSON.stringify(c.DEFAULT_EXTENSIONS)}`))' >./integration/unplugin/src/constants.ts
yarn --cwd ./integration/unplugin build
cp ./integration/unplugin/dist/* ./dist

# create browser build for docs
terser dist/browser.js --compress --mangle --ecma 2015 --output civet.dev/public/__civet.js

