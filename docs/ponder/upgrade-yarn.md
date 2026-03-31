# Consider Upgrading to Yarn Berry

As of 2026-03-30, this repo uses Yarn Classic (v1.22) with workspaces. Yarn Berry (v4) offers meaningful improvements worth revisiting when the time is right:

- `yarn workspaces foreach --parallel` — run scripts across workspaces in parallel with concurrency control, topological ordering, and filtering (`--include`, `--exclude`)
- Plug'n'Play (PnP) — eliminates `node_modules` entirely; deps are resolved via a generated `.pnp.cjs` loader. Faster installs, strict dependency boundaries (no accidental use of unlisted deps)
- Zero-installs — commit `.yarn/cache` to the repo so `yarn install` is a no-op on CI; cuts install time to near zero
- Better `patch:` protocol — patch a dep inline without forking it
- Stricter workspace protocol — `"workspace:*"` as an explicit cross-package reference (more expressive than `"*"`)

**Migration considerations:**
- `vsce package` and other tools that shell out to yarn need testing under Berry/PnP
- PnP requires all packages to declare their deps explicitly — hoisting-reliant implicit deps surface as errors (this is a feature, but requires cleanup)
- `.yarnrc.yml` replaces `.npmrc`/`.yarnrc`

When ready, start with `yarn set version berry` and `nodeLinker: node-modules` (PnP opt-out) to get Berry's tooling without the PnP migration cost, then opt into PnP separately.
