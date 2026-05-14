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
# Temporarily re-enabled parallel under coverage to gather diagnostic data
# on the workerpool SIGTERM hypothesis (see MOCHA-PARALLEL-COVERAGE-RACE.md).
# build/sigterm-trace.js logs worker PIDs that hit SIGTERM; CI inspects the
# log after the run.  Revert this block (and the lsp/server --no-parallel
# removal) once we have empirical confirmation.
args=""
if [ "$threads" != "0" ]; then
  args="--parallel -j $threads"
fi
export CIVET_THREADS=

# Use sourcemaps so errors have correct line numbers.
export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--enable-source-maps"

# Each block below prepends to $args, so the LAST block listed ends up first
# in the final arg list — and mocha's CLI parser (yargs) uses last-wins for
# repeated --timeout flags.  Order matters: coverage's higher timeout must
# be appended last so it wins on Windows+coverage runs.

# Windows is slower; increase default mocha timeout (before $args so it's overridable).
if [[ "$OSTYPE" == msys* || "$OSTYPE" == cygwin* || "$OSTYPE" == win* ]]; then
  args="--timeout 5000 $args"
fi

# Sequential mode + c8 instrumentation slows subprocess-spawning tests
# (comptime, cli, etc.) past the default 2s.  This appears AFTER the Windows
# block so the higher timeout ends up later in the arg list and wins.
if [ "${CIVET_COVERAGE:-0}" = "1" ]; then
  args="$args --timeout 10000"
fi

# Worker-terminate timeout (requires the STRd6/mocha#worker-termination-timeout
# fork — pinned via pnpm.overrides).  Configurable via env so we can flip
# between "extreme low → force the bug" and "high → bypass the bug" without
# touching this file.  Default 30000 (30 s) is the proposed fix value.
if [ "${CIVET_COVERAGE:-0}" = "1" ] && [ "$threads" != "0" ]; then
  args="$args --worker-termination-timeout ${CIVET_WORKER_TERMINATE_TIMEOUT:-30000}"
fi

if [ "${CIVET_COVERAGE:-0}" = "1" ]; then
  c8 mocha $args "$@"
else
  node_modules/.bin/mocha $args "$@"
fi
