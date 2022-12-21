#!/bin/bash
set -euo pipefail

for f in civet.dev/*.md
do
  marked < "$f" > "${f%.md}.html"
done
