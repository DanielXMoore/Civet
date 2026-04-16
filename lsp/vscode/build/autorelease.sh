#!/bin/bash
# Publish VS Code extension to Visual Studio Marketplace and Open VSX Registry
# when the local version is not yet published.
#
# Requires VSCE_PAT and/or OVSX_PAT secrets in GitHub Actions.
# Run from lsp/vscode: bash build/autorelease.sh
set -euo pipefail

VERSION=$(node -p "require('./package.json').version")
PUBLISHER=$(node -p "require('./package.json').publisher")
NAME=$(node -p "require('./package.json').name")
QUALIFIED="${PUBLISHER}.${NAME}"

echo "Checking $QUALIFIED@$VERSION"

# Build once and package .vsix for both marketplaces
pnpm package
VSIX="${NAME}-${VERSION}.vsix"
if [ ! -f "$VSIX" ]; then
  echo "Error: expected $VSIX not found"
  exit 1
fi

# Publish to VS Code Marketplace
if [ -n "${VSCE_PAT:-}" ]; then
  PUBLISHED=$(node_modules/.bin/vsce show "$QUALIFIED" --json 2>/dev/null | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).versions?.[0]?.version" 2>/dev/null || echo "")
  if [ "$PUBLISHED" = "$VERSION" ]; then
    echo "Skip: $QUALIFIED@$VERSION is already on VS Code Marketplace."
  else
    echo "Publishing $QUALIFIED@$VERSION to VS Code Marketplace..."
    node_modules/.bin/vsce publish --packagePath "$VSIX"
  fi
else
  echo "Skip VS Code Marketplace: VSCE_PAT not set."
fi

# Publish to Open VSX Registry
if [ -n "${OVSX_PAT:-}" ]; then
  PUBLISHED=$(node_modules/.bin/ovsx get "$QUALIFIED" --metadata 2>/dev/null | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).version" 2>/dev/null || echo "")
  if [ "$PUBLISHED" = "$VERSION" ]; then
    echo "Skip: $QUALIFIED@$VERSION is already on Open VSX."
  else
    echo "Publishing $QUALIFIED@$VERSION to Open VSX..."
    node_modules/.bin/ovsx publish "$VSIX" -p "$OVSX_PAT"
  fi
else
  echo "Skip Open VSX: OVSX_PAT not set."
fi
