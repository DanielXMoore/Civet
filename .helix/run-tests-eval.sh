#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Docker/CI can be slower than local dev; Mocha default 2s flakes on coverage runs.
MOCHA_TIMEOUT_FLAG=(--timeout 10000)

run_full() {
  if [ -f pnpm-lock.yaml ]; then
    exec pnpm test -- "${MOCHA_TIMEOUT_FLAG[@]}"
  elif [ -f yarn.lock ]; then
    exec yarn test -- "${MOCHA_TIMEOUT_FLAG[@]}"
  else
    exec npm test -- "${MOCHA_TIMEOUT_FLAG[@]}"
  fi
}

# No arguments: full suite (build/test.sh + tsc where applicable).
if [ "$#" -eq 0 ]; then
  run_full
fi

IFS=',' read -ra FILES <<<"$1"
if [ "${#FILES[@]}" -eq 0 ]; then
  echo "run-tests-eval.sh: no paths after splitting: $1" >&2
  exit 1
fi

export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--enable-source-maps"

# Legacy Civet: mocha options live under package.json "mocha", including spec: ["test"].
# Drop `spec` so only the listed files run (same issue as .mocharc spec in modern Civet).
if [ ! -f .mocharc.json ]; then
  MOCHARC_EVAL="$(mktemp)"
  PKG_STUB="$(mktemp)"
  trap 'rm -f "$MOCHARC_EVAL" "$PKG_STUB"' EXIT
  node -e "const fs=require('fs'); const p=require('./package.json'); const c={...p.mocha}; delete c.spec; fs.writeFileSync(process.argv[1], JSON.stringify(c));" "$MOCHARC_EVAL"
  printf '%s\n' '{"name":"mocha-targeted","private":true}' >"$PKG_STUB"
  PATH="$ROOT/node_modules/.bin:$PATH"
  node_modules/.bin/c8 node_modules/.bin/mocha --config "$MOCHARC_EVAL" --package "$PKG_STUB" "${MOCHA_TIMEOUT_FLAG[@]}" "${FILES[@]}"
  node_modules/.bin/tsc --noEmit
  exit 0
fi

# Modern Civet: .mocharc.json sets spec: ["test"], so restrict with a temp config without `spec`.
MOCHARC_EVAL="$(mktemp)"
trap 'rm -f "$MOCHARC_EVAL"' EXIT
cat <<'EOF' >"$MOCHARC_EVAL"
{
  "extension": ["civet"],
  "require": ["./build/register.js"],
  "reporter": "./build/dot-batch-reporter.js",
  "recursive": true
}
EOF

threads="${CIVET_THREADS:-$(node -e 'const cpus = require("os").cpus().length; process.stdout.write(String(Math.min(cpus, 4)))')}"
args=()
if [ "$threads" != "0" ]; then
  args=(--parallel -j "$threads")
fi

node_modules/.bin/mocha --config "$MOCHARC_EVAL" "${MOCHA_TIMEOUT_FLAG[@]}" "${args[@]}" "${FILES[@]}"
node_modules/.bin/tsc --noEmit
