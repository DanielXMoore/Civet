#!/bin/bash
set -euo pipefail

# exit if git staged files are dirty
if [[ -n $(git status --porcelain | sed -e '/??/d') ]]; then
  echo "Git staged files are dirty. Please commit or stash them."
  exit 1
fi

# Bump the point version and publish to npm

coffee build/bump-version.coffee
npm publish
git add package.json
git commit -m "Bump version"
git push
