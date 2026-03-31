# Yarn 1 Workspace Limitations

Discovered during the yarn workspaces migration (2026-03-30).

## Root package cannot be a child workspace dependency

The repo root IS `@danielx/civet`. Yarn 1 throws an invariant violation when a child workspace
declares `"@danielx/civet": "*"` — it tries to symlink the child's `node_modules/@danielx/civet`
back to the root directory, which is circular.

**Workaround:** `lsp`, `integration/jest`, `integration/eslint`, and `integration/gulp` pin
`@danielx/civet` to `0.9.4` (the bootstrap version already in the root lockfile). This means
children use the npm-installed version, not the local build.

**Real fix:** Yarn Berry's `workspace:*` protocol handles this correctly. See `upgrade-yarn.md`.

## Benign "Workspaces can only be enabled in private projects" warning

Yarn 1 emits this warning twice when it loads workspace package manifests that contain a
`workspaces` field without `private: true`. It is harmless — the root already has `"private": true`.
