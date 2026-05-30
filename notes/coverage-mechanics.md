# Coverage mechanics — how c8 actually sees Civet code

Hard-won facts. Check these before claiming a coverage gap is (or isn't) real.
The trap that motivated this doc: assuming a single-line conditional "hides" a
branch from c8, "fixing" it in the compiler, and only later discovering c8 was
reporting the branch correctly all along.

## The gate

- `pnpm coverage` runs all three suites (root + `lsp/server` + `lsp/vscode` e2e)
  and merges to `coverage/`. `pnpm coverage:check` gates the **summed** totals
  at 100% on statements / branches / functions / lines (see
  `scripts/coverage-check.civet`). It is a global sum, not per-file — a few
  uncovered lines anywhere fail it.
- To judge a single file, read its entry in `coverage/coverage-final.json`
  directly (per-file `s`/`b`/`f` hit maps) rather than the aggregate pass/fail.

## Which compiler compiles what (this is the subtle one)

- The **register hook** (`build/register.js` → `build/cache-utils.js`) compiles
  `.civet`/`.hera` at test time with the package resolved from
  `./node_modules/@danielx/civet` — a pnpm symlink to the **installed previous
  release**, NOT your `dist/` build. So a change to `source/parser/**` does
  **not** affect the sourcemaps c8 sees for `source/**` in root coverage until
  it's released and the dep is bumped.
- `lsp/server` is the exception: its build uses `../../dist/civet` (your build),
  so compiler changes *do* affect lsp/server coverage.
- To run your **local** compiler through the register hook (e.g. to test a
  compiler change against coverage): `CIVET_SOURCE=./dist/main.js`.

## How c8 reads sourcemaps — and why `remapPosition` lies about it

- c8 / v8-to-istanbul map generated positions to source with
  `@jridgewell/trace-mapping`'s `originalPositionFor`: the mapping segment with
  the **greatest generated column ≤ the query**, no interpolation.
- Civet's own `remapPosition` (`source/ts-diagnostic.civet`) is **different** —
  it interpolates and may pick the segment at/after the column. Do **not** use
  it to predict what c8 will report. If you want to know where c8 lands a
  position, use `originalPositionFor` (it's a devDependency).

## Branch vs statement/line coverage for single-line conditionals

A postfix `stmt unless cond` (also `if`/`while`/`for`) compiles to a single-line
`if (!cond) { stmt }`.

- **Branch coverage already works.** c8 reports the consequent arm as *missed*
  when `cond` is never falsy. v8-to-istanbul derives the branch from the
  consequent's inner statement, independent of the synthetic brace's `$loc`.
  Adding a `$loc` to the generated `{` does **not** change c8 output (verified:
  byte-identical `coverage-final.json` with and without).
- **Statement/line coverage does *not* flag it.** The single-line consequent's
  statement is attributed to the (covered) condition line, so it reads as hit
  even when never executed. Writing the consequent on its **own line**
  (multi-line block) makes that line show up as an uncovered statement.
- Net for the 100% gate: an untested single-line consequent **passes**
  statement/line coverage but **fails** branch coverage. To satisfy the gate,
  either test the arm, or — for a genuinely unreachable defensive arm —
  `/* c8 ignore … -- why */` it (see CLAUDE.md → Coverage).

## Verifying whether a *compiler* change affects coverage

Reason from c8 output, never from sourcemap segments alone. Compile the same
fixture with the old and new `dist/civet` and diff the c8 result:

```bash
# 1. fixture with an untested arm
printf 'export f := (y) ->\n  return 0 unless y\n  y * 2\n' > /tmp/g.civet
# 2. compile + run under c8 with each compiler (or via the register hook with
#    CIVET_SOURCE=./dist/main.js), then diff the per-file s/b/f maps in
#    coverage-final.json. Identical maps ⇒ the change is coverage-neutral.
```

A synthetic-brace `$loc` is at most a sourcemap-*accuracy* improvement (helps
`remapPosition`-based LSP features like hover at that column); it is **not** a
coverage fix.
