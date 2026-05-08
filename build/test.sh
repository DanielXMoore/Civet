#!/bin/bash

set -euo pipefail

# Enable parallel mocha by default, capped to avoid oversubscribing large machines.
# Set CIVET_THREADS=N to override, or CIVET_THREADS=0 to disable.
# Note: CIVET_THREADS refers to Mocha --parallel workers (separate processes),
# not Node.js worker_threads, which don't work within Mocha.
# GH-hosted Windows runners have 4 vCPUs; running 4 workers leaves no
# headroom and produces flaky 5s timeouts on tiny tests under scheduling
# jitter. Cap to 2 there so each worker has slack. Local Windows boxes
# with more cores don't have the oversubscription, so gate on $GITHUB_ACTIONS.
cap=4
if [[ "${GITHUB_ACTIONS:-}" == "true" && ( "$OSTYPE" == msys* || "$OSTYPE" == cygwin* || "$OSTYPE" == win* ) ]]; then
  cap=2
fi
threads="${CIVET_THREADS:-$(node -e "const cpus = require('os').cpus().length; process.stdout.write(String(Math.min(cpus, $cap)))")}"
args=""
if [ "$threads" != "0" ]; then
  args="--parallel -j $threads"
fi
export CIVET_THREADS=

# Use sourcemaps so errors have correct line numbers.
export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--enable-source-maps"

# Windows is slower; increase default mocha timeout (before $args so it's overridable).
if [[ "$OSTYPE" == msys* || "$OSTYPE" == cygwin* || "$OSTYPE" == win* ]]; then
  args="--timeout 5000 $args"
fi

if [ "${CIVET_COVERAGE:-0}" = "1" ]; then
  c8 mocha $args "$@"
else
  node_modules/.bin/mocha $args "$@"
fi
