#!/usr/bin/env bash
# Summarize typecheck output: counts per file, per error code, totals.
# Usage: bash scripts/typecheck-summary.sh [logfile]
# If no logfile is given, runs `pnpm typecheck` and uses its output.

set -euo pipefail

if [ $# -ge 1 ]; then
  LOG="$1"
else
  LOG=$(mktemp -t typecheck-XXXXXX.log)
  CIVET_TYPECHECK_MAX_ERRORS=99999 pnpm typecheck &>"$LOG" || true
fi

CLEAN=$(mktemp -t typecheck-clean-XXXXXX.log)
sed 's/\x1b\[[0-9;]*m//g' "$LOG" > "$CLEAN"

echo "=== Per-file error counts ==="
grep -E "^source/[^:]+\.(civet|hera):[0-9]+:[0-9]+ - error" "$CLEAN" \
  | grep -oE "^source/[^:]+\.(civet|hera)" \
  | sort | uniq -c | sort -rn

echo
echo "=== Per-error-code counts ==="
grep -oE "error TS[0-9]+" "$CLEAN" | sort | uniq -c | sort -rn

echo
echo "=== Totals ==="
grep -E "^[0-9]+ problems? reported" "$CLEAN" || echo "(no totals line)"
