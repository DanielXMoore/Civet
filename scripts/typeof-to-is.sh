#!/bin/bash
# Transforms `typeof EXPR is 'TYPE'` and `typeof EXPR === 'TYPE'` to `EXPR <? 'TYPE'`
#
# Usage: ./lsp/scripts/typeof-to-is.sh [files...]
# If no files given, processes .civet source files under lsp/ (excluding vendored/test dirs)

set -euo pipefail

files=("$@")
if [ ${#files[@]} -eq 0 ]; then
  mapfile -t files < <(find lsp/server/source lsp/vscode/source lsp/vscode/e2e lsp/vscode/scripts \
    -name '*.civet' -not -path '*/node_modules/*')
fi

for f in "${files[@]}"; do
  sed -i -E "s/typeof ([a-zA-Z_][a-zA-Z0-9_.]*) (===|is) (['\"])/\1 <\? \3/g" "$f"
done
