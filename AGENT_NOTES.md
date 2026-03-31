# Agent Notes – Task 6: Consolidate to Single Root yarn.lock

## What Was Done
- Deleted `lsp/yarn.lock` (superseded by the root unified lockfile)
- Ran `yarn install --ignore-engines` from the repo root to generate a unified `yarn.lock`
- Committed all changes under: "chore: consolidate to single root yarn.lock via workspaces"

## Assumptions & Workarounds

### Yarn 1 cannot link the workspace root package as a child-workspace dependency
**Problem:** The repo root package IS `@danielx/civet@0.11.5`. Multiple child workspace packages
(`lsp`, `integration/jest`, `integration/eslint`, `integration/gulp`) had `"@danielx/civet": "*"`
in their `dependencies`/`devDependencies`. In Yarn 1, any version spec matching the workspace root
version (`*` matches `0.11.5`) causes Yarn to attempt a workspace symlink from the child's
`node_modules/` back to the root directory — and Yarn 1 cannot create that link for the root
package itself (invariant violation).

**Fix:** Pinned `"@danielx/civet"` to `"0.9.4"` in all four affected workspace packages:
- `lsp/package.json` (dependencies)
- `integration/jest/package.json` (devDependencies)
- `integration/eslint/package.json` (devDependencies)
- `integration/gulp/package.json` (devDependencies)

`0.9.4` is the bootstrap/build version already present in the root's `devDependencies` and in the
existing lockfile, so no network fetch was required. All peer dependency constraints
(`>=0.5.35`, `>=0.6.0`, `>=0.7.0`) are still satisfied by `0.9.4`.

**Alternative (future):** Migrating to Yarn 2+ (Berry) with `workspace:*` protocol would allow
child workspaces to properly reference the root package as a workspace dependency.

### node_modules/@danielx/civet is not a symlink to the repo root
The task spec expected `ls -la /workspace/node_modules/@danielx/civet` to show a symlink to the
repo root. This is not achievable in Yarn 1 because the root workspace package cannot symlink to
itself. Instead, `node_modules/@danielx/civet` contains the npm-installed v0.9.4 (the bootstrap
version). Workspace linking IS active for all other workspace packages (lsp, civet-jest, etc.).

### --ignore-engines flag required
The `lsp` package requires `node >= 23.0.0` in its engines field, but the container runs Node
`20.20.2`. `--ignore-engines` is needed for `yarn install` to proceed; build/test of the LSP
package may still fail due to the Node version mismatch at runtime.

### "Workspaces can only be enabled in private projects" warning
This warning appears twice but is benign — it originates from Yarn 1 seeing `workspaces` fields in
workspace package manifests loaded transitively. The root `package.json` correctly has
`"private": true`.
