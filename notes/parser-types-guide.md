# Parser Type-Annotation Guide

How to add `::Type` annotations to `source/parser.hera` rules. The goal: **accurate** types that match what the rule emits, **narrow enough to catch consumer mistakes**, and **simple enough not to obscure the rule**. Distilled from the work tightening types after the Hera 0.9.6+ bump exposed mutual-recursion cycles.

## Why this exists

Hera 0.9.6+ emits real TypeScript types for each grammar rule's return value. Long mutual-recursion chains (e.g. `Expression → AssignmentExpression → … → Expression`) defeat TS inference and produce TS7022/7023/2502 cycle errors. Adding `::Type` annotations on cycle-breaker rules pins the return type and clears the cluster.

## Core principles

1. **Annotate where it helps; leave good inference alone.** Add `::Type` to break a cycle, pin a misinferred return, or document a non-obvious shape. Skip rules where TS already infers the right type — extra annotations are noise.

2. **Type matches what the producer actually returns.** Not `::ASTNode`, not a convenient superset — exactly what the action's `return` expression yields. We control both `parser.hera` and `source/parser/types.civet`; if no existing type fits, **add a new one** to types.civet.

   This applies **inside type definitions too**, not just at the `::` annotation site. When you write a new type, the field types should be as specific as what the producer actually puts in them. If the grammar rule sets `id` from `IdentifierName:id`, then in `types.civet` the field should be `id: Identifier`, not `id: ASTNode`. Same lens for `expression`, `name`, `value`, etc. Defaulting to `ASTNode` for fields is the structural equivalent of defaulting to `::ASTNode` for rules: it throws away the type info we already have.

   Example — bad: `id: ASTNode`; good: `id: Identifier`. Bad: `expression: ASTNode`; good: `expression: ExpressionNode` (or narrower). Walk back to the grammar to see what's actually produced when in doubt.

3. **Same-named-as-type rules are the cheapest wins.** Rules called `IfStatement`, `Declaration`, `CaseBlock` etc. typically emit a node with `type: "<RuleName>"` — annotate with the same-named type from `types.civet`. Add the type to the import block when introducing.

4. **Per-alternative annotation when alternatives differ.** Multi-alt rules where each alt produces a different node type — annotate each alt with its specific type. Example:
   ```
   CaseClause
     PatternExpressionList:patterns … ::PatternClause -> {…}
     Case CaseExpressionList:cases … ::CaseClause -> {…}
     When CaseExpressionList:cases … ::WhenClause -> {…}
   ```
   Reach for a union annotation only when the union is itself a meaningful named type in `types.civet`.

5. **Parse-time intermediates may have looser shapes than the eventual AST.** Some rules emit nodes that exist only briefly before a later pass rewrites them:
   - `IfClause` emits `{type: "IfStatement", children, condition, negated}` — a partial IfStatement. It's consumed by either the `IfStatement` rule's 2nd alt or the postfix-if path (`_PostfixStatement IfClause ::IfStatement` → `attachPostfixStatementAsExpression`). The discriminant is shared with `IfStatement` *on purpose* — load-bearing.
   - `FinallyClause` is a `Statement`-rule alternative; `processFinallyClauses` (lib.civet) rewrites standalone occurrences into TryStatements.

   Don't model these strictly. Don't introduce a separate `IfClause` type just to be "accurate" — it breaks the postfix path. Don't add `FinallyClause` to `StatementNode` — post-pass consumers don't see it there.

6. **Increasing the visible error count is acceptable if annotations reveal real producer/consumer mismatches.** The goal is type correctness, not minimizing the number. Real bugs masked by `any` should surface. Fix them in the same PR (or a focused follow-up) — don't paper over with widening.

7. **Synthetic nodes constructed in `.civet` code must match the same shapes the parser emits.** When both the parser action and a transform in `source/parser/*.civet` produce e.g. an `AssignmentExpression`, the shapes must match. Reuse shared constructor helpers (e.g. `makeNode`) so the producer set converges on one canonical shape. Add a helper when you find a synth-node literal that's structurally repeated.

## Workarounds for Hera/TS quirks

- **`as const` to pin literal types.** Append `as const` so TS infers the discriminant (`type: "Foo"`) as a literal instead of widening to `string`. Two options:
  - **Whole-object** (`{...} as const`) — stricter; freezes every field. Default to this when the node isn't mutated downstream. Always appropriate for tuple intermediates: `return [$1, condition] as const` produces a fixed-arity tuple instead of a wide union array.
  - **Discriminant-only** (`type: "Foo" as const`) — when later passes mutate other fields and need them writable.

- **Vague array types in unions are a refactoring signal.** When `children` is part of a union (`Children | Foo | undefined`), TS won't expose `.push`/`.slice`/`.indexOf` because the brand on `Children` doesn't lift through union members. A cast to `ASTNode[]` at the call site unblocks immediate work, but the better long-term move is replacing the vague `ASTNode[]`/`Children` arm with a fixed-arity tuple of known types. Treat each cast as a marker for a follow-up refactor.

- **`is` / `is not` are real TS narrowing.** Civet's `is` compiles to `===` (`is not` → `!==`), so TypeScript narrows discriminated unions on them exactly like any other equality check. `arr.filter .type is "Foo"` or `arr.find (item) => item.type is "Foo"` produce a typed `Foo[]` / `Foo | undefined` with no `as Extract<…>` cast or explicit `: item is Foo` predicate needed. If you find yourself adding one, check whether your input array type is the problem instead — the right fix is usually annotating the source array, not papering over the filter result.

## Workflow

### Build / typecheck

```sh
pnpm build                                                        # compile parser.hera → dist
CIVET_TYPECHECK_MAX_ERRORS=99999 pnpm typecheck &>/tmp/after.log   # full error log
```

Don't clear `.cache/` reflexively. The disk cache is keyed by compiler-version × source-hash × filename × options and self-invalidates. Clear it only when you have evidence of staleness (e.g. errors persist after fixes that should clear them).

### Diff two typecheck runs

Naive line-by-line diffs flag every shifted preexisting error as new. Use the bundled diff script:

```sh
civet scripts/typecheck-diff.civet /tmp/before.log /tmp/after.log
```

It fuzz-matches diagnostics by `(file, code, normalized message)` so only genuine new errors show under "Regressions". For full before/after comparison across branches, see `CONTRIBUTING.md` "Typecheck" and the workflow recipe in `notes/mcp-lsp-type-fix-workflow.md`.

### Switching branches

Hera version may differ between branches. After `git checkout <other-branch>`, run `pnpm i` before `pnpm build` — otherwise the wrong Hera version is used and the parser may fail to compile.

### Verifying changes

- `pnpm test` runs the full suite (currently 4016 passing, 19 pending).
- For one-off compilation checks, `./dist/civet -c file.civet -o /tmp` produces the .tsx that TS sees during typecheck.
- `pnpm coverage:check` runs the 100% gate.  Adding a non-null assertion or removing a guard can leave behind a dead branch that fails the gate — drop the now-unreachable arm (e.g. `?? []` after `flatMap()` is always-array).

## Common pitfalls

- **Reverting a `parser.hera` annotation that broke things.** `parser.hera` builds `dist/civet`, which is the compiler that processes everything else (including `parser.hera` on the next typecheck pass). A bad annotation can produce a broken `dist/civet` that fails to parse its own source. If `pnpm typecheck` reports "File `*.tsx` not found" for many files, suspect a `dist/civet` self-compile failure. `git stash; pnpm build; pnpm typecheck` to confirm; revert the offending edit.

- **MCP LSP diagnostics can mislead.** The language server may run TypeScript directly on `.hera` content and report bogus parse errors (`Expression expected` at unrelated positions). Trust `pnpm typecheck` output over MCP diagnostics for `.hera` files.

- **Renaming a `type:` discriminant breaks downstream code.** ~16 sites in `source/parser/*.civet` match on `node.type === "IfStatement"` etc. Changing what a rule emits (e.g. from `"IfStatement"` to `"IfClause"`) requires updating every consumer. Usually not worth it for parse-time intermediates (see principle 5).

- **Hera grammar action body uses Civet indentation.** Action bodies are embedded Civet code inside a JS function wrapper hera generates. Civet's compiler then parses the embedded body. If you write something Civet can't parse cleanly, the error surfaces deep in the build with a runtime stack trace rather than a clean grammar error.

- **Dead defensive arms break the coverage gate.** The repo enforces 100% branch coverage in CI.  Adding `!` to silence "possibly undefined" can render a `?? fallback` or `if (x)` arm unreachable — delete it.

- **`any` masks type errors instead of explaining them.** If you reach for `any`, the right move is usually a more specific type at the producer or a `!` at the consumer.  Reserve `any` for truly unknown shapes (third-party plugin contexts, scratch tuples in tests).

## Related references

- [`ast-cleanup.md`](ast-cleanup.md) — overall plan, per-node tightening recipe, and long-term deferred refactors (per-node tuple children, JSX-attributes-as-nodes, etc.).
- [`mcp-lsp-type-fix-workflow.md`](mcp-lsp-type-fix-workflow.md) — using the MCP LSP for iteration on `.civet` files (not `.hera`).
- [`source/parser/types.civet`](../source/parser/types.civet) — canonical AST type definitions.
- `scripts/typecheck-diff.civet` — the fuzz-matching diff tool.
- `scripts/typecheck-summary.sh` — per-file / per-code totals from a typecheck log.
- `scripts/audit-node.civet` — per-node tightening audit (producers + children layout + consumer grep starters).
