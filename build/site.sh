#!/bin/bash
set -euo pipefail

for f in `ls civet.dev/*.md`; do
  marked < $f > ${f%.md}.html
done
