#!/bin/bash
# probe-coverage.sh — compile a Civet snippet under c8 and report
# per-statement / per-branch hit counts for a file + line range.
#
# Snippet source: stdin (piped) or /tmp/probe-src.civet (if stdin empty).
#
# Usage:
#   printf 'SRC' | scripts/probe-coverage.sh FILE LSTART[-LEND]
#   scripts/probe-coverage.sh FILE LSTART[-LEND]   # after writing /tmp/probe-src.civet
#
# Examples:
#   printf 'return\n  break\n' | scripts/probe-coverage.sh parser.hera 5864-5866
#   scripts/probe-coverage.sh parser.hera 7287     # uses existing /tmp/probe-src.civet
#
# Uncovered entries are marked with ×.
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 FILE LSTART[-LEND]  (reads snippet from stdin or /tmp/probe-src.civet)" >&2
  exit 1
fi

file="$1"
range="$2"

cd "$(dirname "$0")/.."

# If stdin is piped (not a terminal), capture it only when non-empty —
# avoid wiping the previously-written snippet when invoked with no stdin.
if [ ! -t 0 ]; then
  captured="$(cat)"
  if [ -n "$captured" ]; then
    printf '%s' "$captured" > /tmp/probe-src.civet
  fi
fi

if [ ! -f /tmp/probe-src.civet ]; then
  echo "No snippet — pipe one via stdin or write /tmp/probe-src.civet." >&2
  exit 1
fi

rm -rf coverage/tmp coverage/coverage-final.json
CIVET_COVERAGE=1 ./node_modules/.bin/c8 --reporter=json \
  node -e '
    const src = require("fs").readFileSync("/tmp/probe-src.civet", "utf8");
    require("./build/register.js");
    require("./source/main.civet").compile(src).then(
      x => { if (process.env.PROBE_VERBOSE) console.log(x); },
      e => { if (process.env.PROBE_VERBOSE) console.error("# compile threw:", e.message); }
    );
  ' >/dev/null 2>&1 || true

node -e '
  const [file, range] = process.argv.slice(1);
  const [s, e] = range.includes("-") ? range.split("-").map(Number) : [+range, +range];
  const data = require("./coverage/coverage-final.json");
  for (const [path, entry] of Object.entries(data)) {
    if (!path.includes(file)) continue;
    const rel = require("path").relative(process.cwd(), path);
    console.log(`\n## ${rel}  (lines ${s}–${e})`);
    for (const [id, cnt] of Object.entries(entry.s)) {
      const sm = entry.statementMap[id];
      if (sm.start.line >= s && sm.start.line <= e) {
        const mark = cnt === 0 ? "×" : " ";
        console.log(`  stmt   L${String(sm.start.line).padStart(5)} ${mark} ${cnt}`);
      }
    }
    for (const [id, counts] of Object.entries(entry.b)) {
      const bm = entry.branchMap[id];
      const line = bm.loc?.start?.line ?? bm.line;
      if (line >= s && line <= e) {
        const col = bm.locations?.[0]?.start?.column ?? bm.loc?.start?.column ?? "?";
        const mark = counts.some(c => c === 0) ? "×" : " ";
        console.log(`  branch L${String(line).padStart(5)} ${mark} col${col} counts=${JSON.stringify(counts)}`);
      }
    }
  }
' "$file" "$range"
