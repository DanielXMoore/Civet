#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# No arguments: full suite (mocha via build/test.sh + tsc --noEmit).
if [ "$#" -eq 0 ]; then
  exec pnpm test
fi

# Comma-separated test file paths (paths relative to repo root).
# Root .mocharc.json sets spec: ["test"], so CLI paths alone still run the full
# suite; use a temporary config without `spec` so only the listed files run.
IFS=',' read -ra FILES <<<"$1"
if [ "${#FILES[@]}" -eq 0 ]; then
  echo "run-tests-eval.sh: no paths after splitting: $1" >&2
  exit 1
fi

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
export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--enable-source-maps"

node_modules/.bin/mocha --config "$MOCHARC_EVAL" "${args[@]}" "${FILES[@]}"
node_modules/.bin/tsc --noEmit
