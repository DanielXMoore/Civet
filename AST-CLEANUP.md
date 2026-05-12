# AST Cleanup Plan

Make the parser AST a simple, type-accurate tree of typed objects: no bare
strings as nodes, no bare arrays as nodes, no `undefined` as `ASTNode`, no
drift between aliased fields and their children slots.

## Why

- **`undefined` in children.**  `[pattern, typeSuffix, initializer]` admits
  undefined where a node belongs.
- **Bare strings as nodes.**  ~341 grammar rules emit `"+"`, `" "`, `"else "`
  directly — no `$loc`, no identity.
- **Bare arrays as nodes.**  `StatementTuple[]` flows into `ASTNode` slots
  via `Children = ASTNode[]`.
- **Aliased-field drift.**  `existence.expression` and `children[0]` aren't
  enforced equal.
- **Parent-pointer drift.**  `{...node, children: [...]}` doesn't re-stitch
  child `.parent` pointers; manual `addParentPointers` calls compensate.
- **TS depth blowups.**  Spreads widen inferred types, driving TS2589/2590
  errors and `as typeof node` casts.

## End State

- `ASTNode` is a union of object types only.
- Every leaf carries `$loc`.
- Construction goes through `make*` helpers that enforce invariants.
- Structural mutation goes through `replaceChild` + per-node append helpers
  that re-stitch parent pointers.
- A dev/test-mode invariant walk asserts the rest.

## Migration Steps

Smallest blast radius first.  Each step lands independently, at or below
the typecheck baseline.

1. **Per-node tightening (in progress).**  Audit producers + consumers,
   tighten the type, fix the producer.  Existence done.  Candidates:
   Initializer, Argument, SpreadElement, AccessStart, Label.

2. **Constructor helpers.**  `make*` functions per tightened type — pure,
   returning plain object literals.  Adopt at new sites; inline literals
   keep working.

3. **Mutation helpers.**
   - `replaceChild(parent, old, new)` — formalize existing `replaceNode`
     (identity-matches `===` to also update aliased fields).
   - Per-node append helpers where it makes sense: `addStatement`,
     `addProperty`, `addBinding`, `addArgument`.

   *Not* in the plan:
   - Generic `addChild` — children layout varies too much per node type.
   - Generic `withChildren(node, fn)` — can't keep aliases in sync; bare
     `splice`/`filter` covers the cases.

4. **Promote keyword tokens to leaves.**  `"else "`, `"catch"`, `"finally"`,
   `"let "`, `"const "`, `"var "` become real `ASTLeaf` nodes with `$loc`.

5. **Promote delimiter tokens to leaves.**  `","`, `";"`, `"("`, `")"` etc.
   Largest grammar-side change; defer until (4) is proven.

6. **Remove `undefined` from `ASTNode`.**  After enough producers cleaned
   via (1)–(3).  ~70 sites today; expect fewer.

7. **Remove bare `Children` arm from `ASTNode`.**  Depends on
   `expressions: StatementTuple[]` and similar being wrapped as nodes.

8. **Post-parse invariant walk.**  Dev/test only.  Catches what types
   can't express (parent-pointer consistency, leaf `$loc`).

## Deferred

- **Class-based nodes with getter/setter aliasing.**  Incompatible with
  the codebase's spread idiom.  Revisit only if (3) is broadly adopted
  and spreads have actually shrunk.
- **Grammar DSL changes.**  Constructor helpers work fine from `.hera`
  action bodies.

## Working Practices

- One step (or node) per PR.  Stay at or below typecheck baseline.
- Per tightened node: audit producers (`type: "X"` literals + `makeNode`),
  audit consumers (property accesses, destructuring, narrowing), then
  update.  Existence is the reference.
- Prefer braced object literals (`{ ... }`) for AST node construction.
  Civet's shorthand property syntax (bare `field`, or access-path
  shorthand like `{ post.$loc }` → `{ $loc: post.$loc }`) only works
  inside braces.  Braceless indent-based literals parse bare `field` as
  a call.
- TS depth quirk: `children: Children & [tuple]` triggers TS2590 in
  `prepend`/`append` (Children's metadata intersection explodes).  Use
  bare `children: [ASTNode, ...]` tuple type instead.
- Inside `parser.hera` grammar actions: never mutate captured nodes in
  place.  PEG backtracking + memoization would re-serve a mutated
  cached object on retry.  Spread to a fresh object.  In-place mutation
  helpers (e.g. `addFields`) are post-parse only.
