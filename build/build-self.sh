#!/bin/bash
# Try building Civet itself using the current Civet in dist
# Run via `yarn build:self`
# This tends to give better parse errors than `yarn test:self`

set -euo pipefail

if [ ! -f dist/civet ]; then
  echo "Missing dist/civet. Run yarn build first."
  exit 1
fi

export CIVET_SELF_BUILD=1
export CIVET_DIST=dist-self
export CIVET_BIN="./dist/civet"

bash ./build/build.sh "$@"

# diff old to new
echo
diff -ru --color=always dist dist-self
exit 0
