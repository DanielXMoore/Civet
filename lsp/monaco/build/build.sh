#!/bin/bash
set -euo pipefail

rm -rf dist

${CIVET_BIN:-../../dist/civet} build/build.civet
