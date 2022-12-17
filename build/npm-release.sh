#!/bin/bash
set -euo pipefail

# exit if current branch is not master
if [[ $(git branch --show-current) != "master" ]]; then
  echo "Current branch is not master. Please switch to master branch."
  exit 1
fi

# exit if git staged files are dirty
if [[ -n $(git status --porcelain | sed -e '/??/d') ]]; then
  echo "Git staged files are dirty. Please commit or stash them."
  exit 1
fi

# Bump the point version and publish to npm

coffee build/bump-version.coffee
npm publish --otp $1
git add package.json
git commit -m "Bump version"
git push
