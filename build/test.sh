#!/bin/bash

set -euo pipefail

# Enable parallel mocha by default, capped to avoid oversubscribing large machines.
# Set CIVET_THREADS=N to override, or CIVET_THREADS=0 to disable.
# Note: CIVET_THREADS refers to Mocha --parallel workers (separate processes),
# not Node.js worker_threads, which don't work within Mocha.
threads="${CIVET_THREADS:-$(node -e 'const cpus = require("os").cpus().length; process.stdout.write(String(Math.min(cpus, 4)))')}"
args=""
if [ "$threads" != "0" ]; then
  args="--parallel -j $threads"
fi
export CIVET_THREADS=

if [ "${CIVET_COVERAGE:-0}" = "1" ]; then
  c8 mocha $args "$@"
else
  node_modules/.bin/mocha $args "$@"
fi
tsc --noEmit
