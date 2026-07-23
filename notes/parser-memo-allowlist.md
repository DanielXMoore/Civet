# Selective memoization + traversal rewrite: measured 22% compile speedup

Investigated 2026-06-11. Follow-up to the parser-anatomy work (2026-05-24) that
established cache machinery ≈52% of parse self-time and ruled out micro-level
changes (V8 already inlines/SROAs the hot frames; reorder/prefix-factor/predicate
gating are all no-ops). This round measured *which rules' memoization actually
pays* and A/B'd removing the rest.

## Key data (instrumented `StateCache`, compile of `source/parser/lib.civet`)

- 2.74M cacheable rule enters → only **29.6% cache hit rate**; 1.93M misses,
  each paying `getStateKey` ×2, key-array alloc ×2, 4-layer `Map` has+set, and a
  `{...result}` clone for successes.
- **583K of 813K hits return cached *failures*** — for single-token rules
  (`AtThis` 17.5K hits / 0 successes, `Hash`, `Async`, `OpenParen`…) the cache
  "saves" re-running a 1-byte check that is cheaper than the lookup itself.
- Corpus run (57 files, 15.2M lookups): **529 of 764 rules never reach 1% hit
  rate in any file**, yet carry 20.7% of all lookups. They are interior rules
  shadowed by memoized ancestors — when a backtrack re-tries, the topmost
  memoized rule hits and children are never re-entered (classic packrat result:
  a small memo set captures nearly all the benefit).
- The rules that genuinely earn their memo cost (corpus-wide success hits):
  `_` (128K), `EOS` (136K), `NewlineBinaryOpAllowed`, `Indent`, `__`,
  `InsertOpenBracket`, `IdentifierName`, `NotDedented`, `Parameters`, `EOL`,
  `Identifier`, `UpdateExpression`, `Nested` — ~235 rules carrying 79% of
  lookups.

## A/B results (alternating rounds, methodology per parser-anatomy notes)

| variant | lib.civet compile (mean) | Δ |
|---|---|---|
| baseline | 990 ms (n=100) | — |
| nomemo1: 23 curated cheap rules incl. `_`/`__` | ~3% faster | mostly paid back by re-running `_`'s children (82% hit rate) |
| **nomemo2: 529 corpus-zero-hit + 21 cheap leaves, keep `_`/`__`/`EOS`** | **841 ms (n=100)** | **−15.1%** |
| traversal rewrite alone (see below) | 997 vs 1064 baseline (n=60) | **−6.3%** |
| **nomemo2 + traversal combined** | **825 vs 1064 baseline (n=60)** | **−22.5%** |
| `--max-semi-space-size=64` (GC) | noise | dead end |

types.civet confirmation (nomemo2 only): 144.8 → 132.8 ms (−8.3%). Output
byte-identical on every file checked, for every variant. Full test suite run
with the nomemo2 bundle (see below).

## Traversal rewrite (−6.3% alone, additive with nomemo2)

`gatherRecursiveAll` / `gatherRecursive` in `source/parser/traversal.civet`
allocate an array per visited AST node (`flatMap` recursion returning fresh
`[]` / `[node]` at every level). processProgram runs ~20 passes, nearly all
doing full-tree walks → millions of throwaway arrays per compile. Profile:
walkers ~10% self + share of 7.5% GC. Fix is a mechanical accumulator-passing
rewrite (closure over a `results` array, `visit` helper; preserves post-order
for `gatherRecursiveAll`, pre-order short-circuit + skipPredicate for
`gatherRecursive`). `gatherNodes` has the same shape and could get the same
treatment (smaller traffic).

Lesson recorded: un-memoizing a high-hit-rate composite rule (`_`, 82% hits)
loses most of the win because its successful re-runs re-enter child rules and
their cache cycles. Zero-hit rules have no such payback — they are free.

## Implementation

- `source/nomemo-rules.civet` — the generated list (533 rules after widening
  the corpus to 126 files including lsp/; 17 of the session's 550 dropped out
  with >1% hits somewhere). Distinct from `uncacheable` in `source/main.civet`,
  which exists for *correctness* on state-mutating rules; the two are merged
  into one `skipCache` set at module load so `makeCache` still does a single
  `Set.has` per enter/exit.
- `scripts/generate-nomemo-rules.mjs` — regenerates the list: instruments a
  copy of `dist/main.js` (counting per-rule lookups/hits in `StateCache`,
  neutralizing the current nomemo list so dropped rules can re-qualify),
  compiles the corpus, tracks each rule's **max** per-file hit rate (the
  safety-relevant number — hit rates are input-dependent), and emits rules
  with max hit rate < 1% everywhere plus the curated cheap-leaf list.
- Un-memoizing is strictly safe semantically (memoization is transparent for
  pure rules; impure rules are already in `uncacheable`), so a stale list can
  only cost performance, never correctness.
- `source/parser/traversal.civet` — `gatherRecursive`/`gatherRecursiveAll`
  rewritten accumulator-style (see below).

## Remaining ranked opportunities (not yet implemented)

1. **Allowlist tuning / threshold sweep** — nomemo2 used a conservative 1%
   threshold. Sweeping (e.g. expected-value criterion: hits×body-cost vs
   lookups×cycle-cost) may squeeze a few % more. Diminishing.
2. **`getStateKey` once per rule, reuse at exit** — for cacheable rules, state
   at exit always equals state at enter (net-state-modifying rules are
   uncacheable by construction), so exit's `getStateKey()` + key alloc is
   redundant. `$EVENT` already plumbs `enter → {data} → exit(…, eventData)`.
   Saves ~1 key computation+alloc per miss (1.9M/compile) minus one small
   object alloc per miss to carry it. A/B needed; likely low single digits.
3. **Move memo into Hera codegen** (already on TODO) — with ~550 rules
   un-memoized, most rule invocations still pay `$EVENT` dispatch +
   2 × `Set.has(ruleName)` for nothing. Generating cache code per-rule (or
   omitting it per-rule) at grammar-compile time removes that. Unlocks the
   allowlist living in the grammar (`# nomemo` rule annotation) instead of
   main.civet.
4. **Cache layout** — remaining memoized traffic still does 4 nested `Map`
   lookups per op keyed `[jsxTag, stateInt, pos, ruleName]`. Options: cache the
   inner map across calls while (tag,state) is stable; or flat map keyed
   `pos * nRules + ruleId` (needs rule→int table from Hera). Untested.
5. **Per-rule state masks** (big, risky) — `stateInt` packs indent level + 11
   Allow/Forbid flags; every flag flip partitions the memo space even for rules
   that read none of those flags, which is *why* hit rates are so low. Keying
   each rule by only the bits it (transitively) depends on would both raise hit
   rates and share entries. Requires a rule→flag dependency analysis in Hera.
6. **Hera combinator allocations** (~11% self time, upstream in
   `@danielx/hera` machine.js): `$S` (sequence) allocates a fresh
   `{input, pos}` object *per term per attempt* — probably the single largest
   allocation source in the parse; `$L` compares via `input.substring()` even
   for 1-char literals (`charCodeAt` is alloc-free); `$R` allocates a match
   array per success. Same-owner upstream fix; A/B end-to-end per the V8
   lessons before trusting any of it.
7. **Fuse transform walks** — after the accumulator rewrite, the next step for
   the ~15% transform share is structural: one tree walk dispatching by node
   `type` to all interested passes instead of ~20 separate full walks. Pass
   ordering is semantic (comments in processProgram say so) — needs care.
8. **Sourcemap generation ≈ 8% of compile** (990 → 911 ms without
   `sourceMap`). `updateSourceMap` regex-splits every emitted token even when
   it has no newline (the common case); a fast path could halve this layer.
9. **Incremental memo reuse across LSP edits** — the only identified >2× parser
   lever, but cached results embed absolute `$loc` positions throughout, so
   reuse requires position-shifting every cached node (or a relative-position
   representation). Major architectural effort; parked.

Phase split for context: generate is ~free; `ast only` ≈ `code no map` ≈ 92%
of compile; sourcemap adds ~8%. Parse dominates everything.
