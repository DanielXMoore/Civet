#!/bin/bash

set -euo pipefail

# Translate CIVET_THREADS into Mocha's --parallel
# In particular, CIVET_THREADS Workers don't work within Mocha
args=""
if [ "${CIVET_THREADS:-0}" != 0 ]; then
  args="--parallel -j $CIVET_THREADS"
  export CIVET_THREADS=
fi

c8 mocha $args "$@"
tsc --noEmit
