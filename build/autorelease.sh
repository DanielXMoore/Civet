#!/bin/bash
# Publish to npm when package.json version is not yet published on the registry.
#
# GitHub Actions: configure Trusted Publishing on npm for workflow file publish.yml and use
# id-token: write; npm 11.5.1+ exchanges OIDC — no NODE_AUTH_TOKEN.
# Local/manual: use npm login or NODE_AUTH_TOKEN.
#
# Run from repo root: bash build/autorelease.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

NAME=$(node -p "require('./package.json').name")
LOCAL=$(node -p "require('./package.json').version")

echo "Checking $NAME@$LOCAL"

if npm view "$NAME@$LOCAL" version >/dev/null 2>&1; then
  echo "Skip: this version is already on npm."
else
  TAG_ARGS=()
  # Semver: drop +build, then '-' means prerelease (e.g. 1.0.0-rc.1); 1.0.0+meta is stable.
  if [[ "${LOCAL%%+*}" == *-* ]]; then
    TAG_ARGS=(--tag pre)
    echo "Pre-release version; publishing with dist-tag 'pre'."
  fi
  # npm publish performs OIDC trusted publishing on GitHub Actions; pnpm does not.
  npm publish --access public "${TAG_ARGS[@]}"
fi
