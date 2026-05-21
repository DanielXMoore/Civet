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
   tighten the type, fix the producer.
   - **Done so far:** Existence, Initializer (3-tuple children),
     Argument, SpreadElement, AccessStart, Label, ReturnValue, ASTRef,
     NonNullAssertion, Identifier (via IdentifierName), TypeArgument,
     TypeFunction (incl. `returnType`), CommentNode (via Comment),
     Star, ParametersNode (via NonEmptyParameters), RangeEnd,
     ReturnTypeAnnotation (via ReturnType),
     Literal/NumericLiteral/StringLiteral, TypeArguments, TypeTuple,
     NamespaceDeclaration, BlockStatement (Block-tier rules),
     EmptyStatement, IterationExpression, EmptyCondition,
     PinPattern, Identifier (PrivateIdentifier, LengthShorthand,
     AtThis, IdentifierReference, LabelIdentifier).  Added
     RangeExpression to `ExpressionNode`.
   - **Next candidates:** ImportDeclaration / ImportClause family,
     CatchClause / CatchBinding, FieldDefinition, ClassExpression,
     CallExpression, MemberExpression.

2. **Constructor helpers.**  `make*` functions per tightened type — pure,
   returning plain object literals.  Adopt at new sites; inline literals
   keep working.  `makeNode` is the generic; per-type helpers are still
   sparse (`makeAmpersandFunction`, `makeGetterMethod`, `makeEmptyBlock`,
   `makeRef`, etc.).

3. **Mutation helpers.**
   - `replaceChild(parent, old, new)` — formalize existing `replaceNode`
     (identity-matches `===` to also update aliased fields).
   - Per-node append helpers where it makes sense: `addStatement`,
     `addProperty`, `addBinding`, `addArgument`.

   *Not* in the plan:
   - Generic `addChild` — children layout varies too much per node type.
   - Generic `withChildren(node, fn)` — can't keep aliases in sync; bare
     `splice`/`filter` covers the cases.

4. **Promote keyword tokens to leaves (largely done).**  `Keyword` AST
   node now exists with a `KeywordToken` literal union covering ~60
   keywords (`abstract`, `as`, `async`, `await`, …, `with`, `yield`).
   Trailing-space variants (`"abstract "`, `"static "`, `"if "`) are
   covered.  `Async`, `Loop`/`When`/`Static` token-rewriting rules
   emit `Keyword`.  Module/type-system keywords (`module`, `enum`,
   `interface`, `namespace`, `global`) folded in.
   - **Remaining:** audit `Else`/`Catch`/`Finally`/`Try` tokens that
     are downgraded to `ASTLeaf` in some paths; verify no producer
     still emits a bare `{$loc, token}` for a token that should be a
     `Keyword`.

5. **Promote delimiter tokens to leaves.**  `","`, `";"`, `"("`, `")"` etc.
   Largest grammar-side change; defer until (4) is fully proven.

6. **Remove `undefined` from `ASTNode`.**  After enough producers cleaned
   via (1)–(3).  ~70 sites today; expect fewer.

7. **Remove bare `Children` arm from `ASTNode`.**  Depends on
   `expressions: StatementTuple[]` and similar being wrapped as nodes.
   Block-tier rules now pin `expressions: StatementTuple[]` at producers
   but the shape still flows into `Children` downstream.

8. **Post-parse invariant walk.**  Dev/test only.  Catches what types
   can't express (parent-pointer consistency, leaf `$loc`).

## Long-term / deferred

Larger refactors that are tracked but not on the active path.  Move from
here to a numbered step when ready to take one on.

- **Per-node tuple `children` types.**  Most AST nodes declare
  `children: Children` (= `ASTNode[]`).  Tuple-typed children (e.g.
  `IfStatement.children: [IfKeyword, Whitespace, Condition,
  BlockStatement, ElseClause?]`) would let consumers destructure
  safely.  Initializer is the reference (3-tuple).  Do per-node when
  tightening that node's rule.

- **JSX attributes as structured nodes.**  Today `JSXAttribute` emits
  interleaved fragment arrays that the source-preserving renderer
  inlines into `JSXElement.children`.  A structured
  `JSXAttribute = {type, spread?, expression?, name?, value?}` (with
  `children` continuing to hold the rendered fragments) would mirror
  `Argument`, `BindingElement`, etc.  Touches ~8 grammar alternatives,
  `JSXAttributes` parent rule, and `convertObjectToJSXAttributes`
  (lib.civet).

- **Argument-carries-trailing-delim shape for list rules.**
  `ArgumentList`/`ElementList`/etc. emit `(Item | Delimiter)[]`
  interleaved arrays (see docstring at `parser.hera:576-579`).
  Long-term: flat `Argument[]` where each `Argument` carries
  `delim?: ASTNode`, mirroring `MethodDefinition.delim`,
  `BindingProperty.delim`, etc.  Update producers and consumers in one
  PR.

- **`ASTError` placement.**  Currently spliced inline into `children`.
  Alternative: a separate `errors?: ASTError[]` field.  No motivating
  need yet.

- **Type-tier and class/interface/namespace structured types.**
  `TypePrimary`/`TypeBullet`/`TypeConditional`/`InterfaceProperty`/
  `ClassSignatureElement`/etc. emit parse-time fragments rather than
  full nodes.  Same JSX-style refactor option (structured nodes +
  delegate rendering to generate.civet); not actionable yet.

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
- `civet scripts/audit-node.civet <NodeName>` dumps the type def, every
  producer with its `children: [...]` literal extracted, and grep
  starters for consumer-side accesses.  Run before tightening to see
  children-layout drift in one screenful, and after to confirm
  normalization.
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
