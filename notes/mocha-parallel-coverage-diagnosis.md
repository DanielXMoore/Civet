# Mocha parallel + V8 coverage race — diagnosis update

Follow-up to `mocha-parallel-coverage-race.md` (same folder).  That
file captured the symptoms and the workaround that landed in PR #2060
(serialize coverage runs).  This file captures what we learned from
reading mocha's source, building reproducers, prototyping a fix, and
running the empirical-validation PR #2062.

Both docs are committed under `notes/` so future investigations can
pick up where we left off.

## TL;DR vs. the original hypothesis

The original write-up listed two candidate causes for the dropped
coverage hits:

1. "Hits generated after `afterAll`" are buffered in V8's counters but
   never flushed because the worker is terminated before clean exit.
2. "The worker is killed mid-flush" via SIGTERM from the parent.

**Synthetic reproducers rule out #1 and strongly support #2.**  Plain
`process.exit(0)` from inside an IPC `message` handler — which is what
mocha's worker does today — flushes V8 coverage reliably for everything
my reproducers throw at it, including hits generated *after* the task
returned (e.g., `toJSON` invoked during `process.send`).  But when a
worker takes longer than `workerTerminateTimeout` (default **1000 ms**)
to respond to the IPC terminate, the parent SIGTERMs it and **every
hit that worker accumulated is silently lost** — the parent reports
all tasks fulfilled, exit code 0, no error surface anywhere.

That matches Civet's observed symptoms exactly:

- Different files show partial coverage on different runs — different
  workers get killed each time, losing whichever files happened to be
  scheduled on them.
- `unplugin.civet` at 87.6 % under parallel, 100 % under sequential —
  when one of N workers is killed, c8's union-merge still has the
  contributions of the surviving workers, so the file shows partial
  rather than zero coverage.
- "`setTimeout` after `v8.takeCoverage()` in `afterAll` didn't help" —
  `afterAll` runs before the worker becomes idle in the pool, so it
  doesn't address the post-`afterAll` serialization phase that's what
  actually slows certain workers past 1 s.

## Reproducer matrix

All variants run 4 workers × 16 tasks, with `NODE_V8_COVERAGE` set.
Tallies count function entries in a 20-function `target2.js` whose
worker code path hits them all.

| Variant | Files | `target2.js` fns hit | Deterministic? | Result |
|---|---|---|---|---|
| **BAD** — workerpool default (`process.exit(0)` from IPC) | 5 (1 parent + 4 workers) | 104 / 104 | yes (5/5) | full coverage |
| **GOOD-naive** — `onTerminate: v8.takeCoverage()` then exit | 5–9, varying | 0 / 0 to 104 / 104 | **no** | sometimes loses entire workers' data |
| **DELAY** — `takeCoverage()` then `setImmediate + setTimeout(50)` | 9 (1 parent + 4 × 2) | 104 / 104 | yes (8/8) | full coverage |
| **STOP** — `takeCoverage()` + `stopCoverage()` | 5 (1 parent + 4 takeCoverage) | 104 / 104 | yes (8/8) | full coverage |
| **HANG** — `onTerminate` never resolves, parent SIGTERMs at 200 ms | 1 (parent only) | 0 / 0 | yes (5/5) | **all worker data lost** |
| **SLOW** — `onTerminate` awaits 1500 ms, default 1000 ms timeout | 1 (parent only) | 0 / 0 | yes (3/3) | **all worker data lost** |
| **POST-TASK** — task returns object with `toJSON` that hits project code | 5 | full | yes (5/5) | post-task hits *are* captured |

Scripts and analysis are under `/tmp/cov-race/` on the investigation
machine.  Workerpool versions tested: **6.5.1** (Civet's installed) and
**9.3.4** — identical behavior on the relevant code path.

Two interesting takeaways:

- **The naive upstream fix would make things worse.**  A hypothetical
  mocha PR that registered an `onTerminate` handler calling
  `v8.takeCoverage()` and then exiting would *introduce* the GOOD-naive
  race.  It's only safe if combined with a settle tick or with
  `stopCoverage()`.
- **The default exit path is fine in isolation.**  No need to touch
  `worker.cleanupAndExit` for the no-coverage case.  The bug is
  specifically about workers that don't get to that path in time.

## Where the 1 s timeout comes from

```
workerpool/src/Pool.js:34
  this.workerTerminateTimeout = options.workerTerminateTimeout || 1000;

workerpool/src/WorkerHandler.js:437-441
  var cleanExitTimeout = setTimeout(function() {
    if (me.worker) {
      me.worker.kill();    // <-- SIGTERM after the timeout
    }
  }, this.workerTerminateTimeout);
```

Mocha's `BufferedWorkerPool` (lib/nodejs/buffered-worker-pool.js) and
`ParallelBufferedRunner` (lib/nodejs/parallel-buffered-runner.js) do not
pass this option through, so it is stuck at workerpool's 1000 ms
default and is not overridable via `--jobs`, `mocharc.json`, or
anything else mocha exposes.

## Proposed mocha patch

Drafted but not yet merged or PR'd upstream.  Five-file diff (~28
lines) in a local clone of `~/apps/mocha`:

- `lib/cli/run.js` + `lib/cli/run-option-metadata.mjs` — add CLI flag
  `--worker-termination-timeout` (`number` type).
- `lib/nodejs/parallel-buffered-runner.js` — read
  `options.workerTerminationTimeout` and pass to the pool factory.
- `lib/nodejs/buffered-worker-pool.js` — already spreads the options
  bag into `workerpool.pool()`, so no change needed there once the
  field is in the bag.  (Note the mocha → workerpool name translation:
  `workerTerminationTimeout` → `workerTerminateTimeout`.)
- `lib/types.d.ts` — add to `MochaOptions`.
- `docs/src/content/docs/running/cli.mdx` — user-facing docs.

Verified end-to-end via a programmatic Mocha instance: passing
`{ workerTerminationTimeout: 7500 }` correctly reaches workerpool as
`workerTerminateTimeout: 7500`.  Omitting the flag is a no-op (workerpool
falls through to its 1 s default), so existing users are unaffected.

No new test added pending resolution of the existing rewiremock breakage
in mocha's `test/node-unit/parallel-buffered-runner.spec.js` (preexisting
on the 12.0.0-beta branch, unrelated to this patch).  Integration tests
(`test/integration/parallel.spec.js`, `test/integration/options/parallel.spec.js`)
still pass — 39 + 6 tests, all green.

## Empirical validation branch (PR #2062, draft)

`claude/diagnose-parallel-sigterm-20260514`, opened as a draft PR for
diagnostic-only CI runs.  Reverts the serialize-under-coverage
workaround so parallel runs again, and adds:

- `build/sigterm-trace.js` — a `--require` shim gated on
  `MOCHA_WORKER_ID`.  Only workers install the handler; on SIGTERM it
  appends the PID to `/tmp/civet-sigterm-trace.log`, then SIGKILLs
  itself (preserving the coverage-loss symptom so we can correlate
  "log has PIDs" with "coverage gate failed").
- Workflow tweak: clear the log before `pnpm coverage`, make the
  coverage step `continue-on-error`, then run a dedicated SIGTERM
  trace step that `exit 1`s when the log has any PIDs.

The outcome matrix the CI reruns are designed to populate:

| `pnpm coverage` | SIGTERM trace | Reading |
|---|---|---|
| pass | pass (no PIDs) | This run didn't trigger the bug; rerun. |
| fail | **fail (PIDs)** | **Hypothesis confirmed.** |
| pass | fail (PIDs) | SIGTERMs happen but didn't cause measurable loss; still confirms mechanism. |
| fail | pass (no PIDs) | Hypothesis wrong; bug is elsewhere. |

## Empirical results from PR #2062 (2026-05-14)

Four CI runs on `claude/diagnose-parallel-sigterm-20260514` with the
SIGTERM-trace shim wired in:

| Run | Timeout | Trace log | Coverage gate | Notes |
|---|---|---|---|---|
| 25868270111 | 1000 ms (default, no fork) | empty | pass 100 % | pre-fork baseline |
| 25869051389 | 30000 ms (fork) | empty | pass 100 % | proposed-fix run |
| 25869465384 | 1 ms (fork) | empty | pass 100 % | bug-forcing run |
| 25869887353 | 1 ms (fork, +`set -x`) | empty | pass 100 % | flag-reaching confirmed |

In the last run we have CI proof that mocha received the flag:

```
+ c8 mocha --parallel -j 4 --timeout 10000 --worker-termination-timeout 1
```

**This disproves the SIGTERM-fallback hypothesis.**  Even with the
parent's patience set to 1 ms — effectively zero — workers exited
cleanly via the IPC `__workerpool-terminate__` → `process.exit(0)`
path and full V8 coverage was written.  No worker hit SIGTERM, SIGINT,
or disconnect.

The reproducer in `/tmp/cov-race/` *did* show SIGTERM coverage loss
when an `onTerminate` handler was added that artificially delays the
worker.  But in real mocha use, no such delay exists: once tasks
resolve, workers are idle and snappy.  `pool.terminate()` only runs
after all tasks resolve, so workers are never busy when the IPC
terminate arrives.

## Local reproduction attempts (2026-05-14)

After the CI runs left the SIGTERM hypothesis dead, we tried to
reproduce the bug locally to refine the diagnosis.  Setup: this
branch with parallel re-enabled, default 1 s timeout, trace shim
wired, 14 workers per run on a Linux laptop.

| Configuration | Samples | Gate failures | SIGTERMs |
|---|---:|---:|---:|
| Current main (dual-compile fix intact), parallel | 5 | 0 | 0 |
| Same but with dual-compile fix locally reverted | 5 | 0 | 0 |
| Current main, parallel, larger loop | 20 | 0 | 0 |

Combined with the 5 CI samples that's **35 runs, zero failures,
zero SIGTERMs**.  Each local run averaged ~95 s; the 20-sample loop
took about 32 min wall.  Rule-of-three gives a 95 %-confidence upper
bound on the per-run failure rate of ≈ 3/35 ≈ **8.6 %**.

Surprising result from the dual-compile revert: the artifact PR #2060
documented (root mocha's `.civet` require hook compiling a second copy
of `ts-service/*` alongside the esbuild bundle) is still present in
that configuration — the per-process v8 records show
`file:///.../source/ts-service/*.civet` URLs in root workers — but
c8's merge produces a clean `coverage-final.json` with no phantom
function entries (`service.civet` reports 31/31 fns; no spurious
32nd).  Whatever made c8's merge produce the phantom entries
historically, it isn't happening on the current toolchain.

## Revised diagnosis

Neither half of PR #2060 reproduces a failure when reverted on the
current branch.  Most likely the bug from PRs #2052/#2055/#2057 has
been resolved by an environment change since then — a `c8`,
workerpool, `node`/`v8`, or Civet/parser revision — rather than by a
specific source edit Civet shipped.  PR #2060 may have been
belt-and-suspenders for a bug that the dependency stack had already
quietly fixed.

We can't prove that with 35 samples; we can say the per-run rate is
bounded above by ~9 % and is *much* lower than the rate that tripped
three back-to-back PRs.

## What the mocha patch is actually good for

The `--worker-termination-timeout` option we drafted and pinned via
fork (`STRd6/mocha#worker-termination-timeout`, branched from v10.8.2)
is still a legitimate improvement — it exposes a workerpool option
that mocha currently hides — but it doesn't address any Civet symptom
we've measured.  **Don't ship the fork pin to Civet `main`.**  The
mocha patch could be proposed upstream on its own merits (for
projects whose workers genuinely do delay on shutdown, or for CI
environments where 1 s is too aggressive under load); the reproducer
in `/tmp/cov-race/` shows that scenario.

## Resolution and recommendation

Revert only the `--no-parallel` half of PR #2060:

- `build/test.sh`: drop the `CIVET_COVERAGE=1 ⇒ threads=0` override.
- `lsp/server/package.json`: drop `--no-parallel` from `test:coverage`.

Keep the dual-compile fix in `test/infra/cache.civet` (no measured
benefit, but no measured downside, and the comment block explains
the reasoning for any future reader).  Cost saved: roughly 3 min of
CI per coverage run.

If the flake ever does come back, the cheap diagnostic playbook is:
re-add `build/sigterm-trace.js` from PR #2062's history, wire it into
both `.mocharc.json` files, and rerun.

## Useful pointers

- Original write-up: `mocha-parallel-coverage-race.md` (same folder).
- Mocha source paths cited above: `~/apps/mocha` (cloned at HEAD
  `6e91a8915e` of `main`, 12.0.0-beta-9.3).
- Mocha fork with the option patch: `STRd6/mocha` branch
  `worker-termination-timeout` (off v10.8.2).
- Civet workaround: PR #2060 (merged 2026-05-13).
- Diagnostic PR (closed after investigation): #2062.
- Industry precedent: vitest #2591, jest #15360, mochista readme — all
  arrived at "serialize under coverage" rather than fix the race.
