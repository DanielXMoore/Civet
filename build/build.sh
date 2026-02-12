#!/bin/bash
set -euo pipefail

out="${CIVET_DIST:-dist}"
civet_bin="${CIVET_BIN:-civet}"

# clean build
rm -rf "$out"
mkdir "$out"

# tree-shake needed constants from Vite
if [ "${CIVET_SELF_BUILD:-}" != "1" ]; then
  node -e 'import("./node_modules/vite/dist/node/constants.js").then((c)=>console.log(`export const DEFAULT_EXTENSIONS = ${JSON.stringify(c.DEFAULT_EXTENSIONS)}`))' >./source/unplugin/constants.mjs
fi

# types (these get used for type checking during esbuild, so must go first)
cp types/types.d.ts types/config.d.ts "$out"/
cp types/config.d.ts "$out"/config.d.mts

# register-noconfig.js is made from register.js
sed 's#//NOCONFIG//##g' register.js >register-noconfig.js

# normal files
"$civet_bin" --no-config build/esbuild.civet "$@"

# built types
for name in astro esbuild farm rolldown rollup rspack unplugin vite webpack; do
  sed 's/\.civet"/\.js"/' "$out"/unplugin/source/unplugin/$name.d.ts >"$out"/unplugin/$name.d.ts
done
rm -rf "$out"/unplugin/source

# cli
out_bin="$out/civet"
(
  echo "#!/usr/bin/env node"
  echo '"use strict"'
  echo "try { require('node:module').enableCompileCache() } catch {}"
) | cat - "$out"/cli.js > "$out_bin"
echo "cli()" >> "$out_bin"
chmod +x "$out_bin"
rm "$out"/cli.js

# create browser build for docs
if [ "${CIVET_SELF_BUILD:-}" != "1" ]; then
  terser "$out"/browser.js --compress --mangle --ecma 2015 --output civet.dev/public/__civet.js
fi
