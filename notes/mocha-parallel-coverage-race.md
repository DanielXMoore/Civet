# Mocha parallel mode + V8 coverage flush race

Working notes for a potential upstream investigation / fix in mocha. Created
while debugging Civet's flaky coverage gate; the workaround landed in PR
#2060 (serialize all suites under coverage).

> **Update 2026-05-14.**  We investigated this in depth; see
> `mocha-parallel-coverage-diagnosis.md` (same folder) for the
> follow-up.  TL;DR: the SIGTERM-fallback hypothesis below was
> empirically *disproven* by 35 parallel coverage runs (5 CI + 30
> local) showing zero force-kills.  The bug as documented here no
> longer reproduces on the current toolchain.

This file is preserved as the original symptom + hypothesis writeup;
treat the hypotheses below as the starting point we set out from, not
as the resolved state.

## TL;DR

When mocha runs in `--parallel` mode under c8 / `NODE_V8_COVERAGE`, some V8
coverage hits generated near the end of a worker's lifetime never make it
to disk. The result is a flaky coverage report: percentages bounce between
two or three values across runs, with different files reporting missed
arms each time. The variance is per-worker, not per-test, and persists
across CI and local environments.

This is *not* the same as the bundling / multi-compile artifact we also
hit (a separate finding documented in the PR description). After
eliminating that, three back-to-back coverage runs under `--parallel`
still varied by ~30 hits; the same configuration with
`--no-parallel` was perfectly deterministic.

## Reproducer surface area

Confirmed in Civet's CI and local Linux runs with:

- mocha **11.x** (root suite) and **11.x** (lsp/server) via `pnpm`-managed
  versions
- c8 **^11**
- Node **22.x** (local) and Node **24.x** (CI ubuntu-latest)

Has been seen periodically in the project's CI for at least months
(see PRs #2052, #2055, #2057 — multiple retries to land what should have
been deterministic coverage gates).

The pattern is independent of OS or hardware (CI's GitHub-hosted Ubuntu
runners and a local Linux laptop both reproduce).

## Symptoms

1. `pnpm coverage` followed by `pnpm coverage:check` (which gates at
   100%) fails non-deterministically.
2. Coverage percentages oscillate between a small set of values:
   typical observations were **99.56% → 99.69% → 99.99%** across
   three back-to-back runs with no code changes.
3. The *specific* files that show as partially-covered change each run
   — sometimes `unplugin.civet` (~87% under parallel, 100% under
   sequential), sometimes `service.civet`, sometimes others.
4. The pattern is *partial-arm misses*: c8 reports rows like
   `branch 39 line 165 (branch) arms [0] missed [0]` — a single-arm
   branch whose only arm has a zero hit count. This matches "data was
   collected but a function/arm was never recorded as executed."
5. Running the *same test files* with c8 under sequential mocha gives
   100% coverage of the same code paths.

## Why we believe it's an exit-time race

Node's `NODE_V8_COVERAGE` mechanism writes coverage profile data to
disk at process exit. c8 invokes mocha as a child process and inherits
this env var, so each *parallel mocha worker* is a separate Node
process that should write its own profile JSON when it exits.

`v8.takeCoverage()` exists as a way to flush mid-process. Civet had a
mocha root hook calling it in `afterAll` (since removed in PR #2060 once
sequential mode made it redundant). The hook is documented to be
synchronous (`writeFileSync` under the hood). Adding a 50 ms `setTimeout`
**after** the call did not change the flakiness — neither did adding an
`await`. That argues the race is **not** between `takeCoverage()`
returning and worker exit; it's somewhere else.

The plausible candidates:

- **Hits generated after `afterAll`** — mocha's own teardown (reporters,
  IPC frame sending, suite cleanup) executes JS in the worker after
  `afterAll` hooks resolve. That code's coverage data is buffered in
  V8's counters but never flushed because the worker is then terminated
  via IPC `disconnect()` or similar before a clean exit.
- **Parent-side worker termination via `kill`** — if the parent process
  signals workers rather than letting them `process.exit(0)` after IPC
  message acknowledgement, V8's exit-time write hook never runs.

Without instrumenting mocha itself, we can't yet tell which path
actually fires for which workers. The observable from our side is that
*some* hits are gone but *others* near them are intact, which is
consistent with a worker dying mid-buffer-flush.

## Why the upstream landscape supports this diagnosis

- **vitest** ([PR #2591](https://github.com/vitest-dev/vitest/pull/2591))
  hit a similar shape of flake and serialized the parallel step
  (`Promise.all` → `for`).
- **jest** ([#15360](https://github.com/jestjs/jest/issues/15360))
  acknowledges the v8 provider is "not reliable" and points users at
  istanbul / ODZ instead.
- **mochista** ([readme](https://github.com/laggingreflex/mochista))
  explicitly avoids parallel-with-coverage: *"c8 uses Node's built in
  coverage functionality which only outputs coverage data once the
  Node processes has exited, tests now need to be run in a separate
  (forked) process."*
- **nodejs/node #46378** / **#49344** track other coverage-vs-IPC
  edge cases at the node level.

No project has a working "parallel mocha + reliable c8" combo that we
could find. The consistent industry choice is to **serialize the
coverage step**.

## Concrete next steps if we ever pursue this

These are roughly in order of "do this first":

1. **Build a minimal external reproducer.** Maybe ~100 lines of
   mocha-only project (no Civet, no LSP), N test files, each
   exercising a different file's branch arms. Run under c8 with
   `--parallel`. Hash the coverage-final.json across runs; show that
   the hash differs. This is the artifact needed before opening a
   mocha issue — without it the maintainers can't help.
2. **Identify which exit path is racing.** Stub
   `process.on('exit', ...)` and `process.on('disconnect', ...)` in
   the mocha worker (via a `--require` shim) and log timestamps to a
   file. Then look at which event fires before V8's profile JSON
   appears in `NODE_V8_COVERAGE`'s output directory. This tells us
   whether the worker is being killed by the parent or self-exiting.
3. **Read mocha's parallel worker shutdown.** Likely files:
   `lib/nodejs/parallel-buffered-runner.js`,
   `lib/nodejs/worker.js`, and the buffered-worker-pool variants.
   Specifically look for any `worker.kill()`, `child.disconnect()`,
   or `process.exit(...)` call that fires after a worker reports
   it's done. Compare against how `mocha-parallel-tests` (the
   older third-party impl) handles the same shutdown — it doesn't
   have this issue per the vitest/mochista accounts.
4. **Prototype a fix.** Two candidate shapes:
   - **a.** Add an opt-in `beforeWorkerExit` hook in mocha, mirroring
     `mochaHooks.afterAll`, that runs in the worker *after* mocha
     considers the worker's work complete but *before* it disconnects.
     Coverage tools can hook this to call `v8.takeCoverage()`.
   - **b.** Make mocha aware of `process.env.NODE_V8_COVERAGE` and
     call `require('v8').takeCoverage()` itself before issuing the
     worker shutdown. Less invasive than (a) but adds knowledge of a
     coverage-tool-specific env var.
5. **File an issue first, not a PR.** Mocha is in slow maintenance
   mode (last release months back as of 2026-05). Drop the
   reproducer, the diagnosis from step 2, and a "are you open to one
   of these patches?" question. Don't draft cold — risk wasting
   maintainer time on a shape they don't want.

## Useful artifacts from the Civet investigation

Pieces of analysis we already produced that would shortcut a future
deep-dive:

- **Direct evidence of dropped hits.** A python script that opens all
  `coverage/tmp/*.json` files for a single run, finds the v8 record
  for `source/ts-service/plugins/hera.civet`, and prints the hit
  count for `getHeraVersion`. Under parallel, root's tmp data
  contains `count=5` for that function — but the merged
  `coverage-final.json` reports it as 0 hits. So the hit data
  *exists at the v8 layer*, it's the merge / fnMap reconciliation
  that loses it. (This was actually a separate dual-compilation
  artifact, not the parallel race — useful to distinguish them in
  any future repro.)
- **Direct evidence of parallel-only loss.** Running the full root
  test suite with `CIVET_THREADS=0` (sequential) gave 100% on
  `unplugin.civet`; under default parallel, the same source/tests
  gave 87.6%. Same v8 / c8 / node versions; only difference was
  parallel mode.
- **Negative result on `setTimeout` after `takeCoverage`.** Adding
  `await new Promise(r => setTimeout(r, 50))` after the synchronous
  `v8.takeCoverage()` in mocha's `afterAll` hook did not reduce
  variance across three runs. This rules out a "give libuv time to
  drain" fix and points the diagnosis at the worker-shutdown phase
  rather than the takeCoverage call itself.

## Decision log

We chose **option: serialize under coverage** for Civet PR #2060
because:

- Reliable (3+ deterministic runs at 100%).
- Tiny diff (~15 line changes across two files).
- Matches the industry pattern, so future maintainers won't be
  surprised by it.
- Cost: ~2-3× longer coverage runs (~3 min → ~5-7 min on CI). The
  coverage gate runs once per PR; serial is fine.

We rejected:

- **Patching mocha now** — too speculative without diagnosis;
  release pace makes the patch slow to land.
- **Switching to istanbul/nyc** — much larger change; loses v8's
  native coverage advantages (no source transformation needed for
  the .civet → .js compilation step).
- **Accepting a relaxed gate** — defeats the purpose of having
  the gate.

## When to revisit

Trigger for picking this up:

- Coverage CI step becomes a noticeable bottleneck (e.g., >10 min
  consistently), and bringing it back to ~3 min would meaningfully
  save developer wait time.
- A volunteer wants a self-contained "weird systems bug" project.
- Mocha 12 (or similar major) ships and the parallel runner changes
  shape — diagnosis-from-scratch becomes easier.
