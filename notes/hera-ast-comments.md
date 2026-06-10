# Hera AST: associate leading comments with rules

Enhance `@danielx/hera`'s token AST so a rule's leading `#` doc-comment is
queryable from the rule node (with `$loc`), instead of being folded into
surrounding whitespace. Then the Civet LSP can surface rule docs in hover
and completion. **Deferred** until the Hera change ships; tracked here so the
consumer work isn't lost.

## Why

The Civet LSP answers `.hera` grammar-level hover/completion from a Hera-parsed
AST (`lsp/server/source/lib/hera-analyzer.civet`). PR #2127 made hover show a
rule's name + productions. The natural next step — show the rule's doc comment,
the way TS hover shows JSDoc — has no clean source in today's AST.

## Current behavior (investigated during #2127)

Grammar-level comments are `#` line comments. Findings from `parseTokens`:

- **No `Comment` node type.** Comment text is absorbed into `EOS` / whitespace
  as a raw string; the AST node-type set is
  `Grammar, Statement, EOS, Rule, Name, RuleBody, Indent, Choice, Sequence,
  Expression, Suffix, Primary, Literal, StringValue, Handling` — no `Comment`.
- **First rule's leading comment** lands in that `Statement`'s leading `EOS`
  child (`statement.children[0]`).
- **Inter-rule comments attach to the *preceding* statement.** A `#` line
  visually above rule B is consumed by rule A's trailing `EOS` / `RuleBody`
  whitespace, not B's `Statement`. So you cannot reliably get "the comment
  above rule X" from X's own node.
- **`Rule.loc` starts at the name token** and excludes any leading comment.

```
# doc for Greeting        <- in Statement[0].EOS (first rule: leading)
Greeting
  "hi"

# doc for Name            <- swallowed by Greeting's trailing whitespace,
Name                         NOT Name's Statement
  "world"
```

## Why not work around it in the LSP

A text-based backward scan from the rule name (collect contiguous `#` lines,
stop at a blank/non-comment line) does work and is arguably more correct than
the AST grouping. But it:

- re-implements comment lexing the parser already does,
- is fragile if Hera's comment syntax evolves (block comments, etc.),
- splits the source of truth across two codebases.

We own Hera, so fix it at the source.

## Proposed Hera enhancement

Expose leading comments as structured, located data. Either:

- **A — emit `Comment` tokens** with `$loc` in the AST (don't fold them into
  `EOS`), letting consumers walk them; and/or
- **B — attach `leadingComments` to the `Rule` (or `Statement`) node** via a
  doc-comment association: the run of contiguous `#` lines immediately above
  the rule, with no intervening blank line.

Recommend **B** (optionally built on A) so consumers get a stable, queryable
association rather than re-deriving adjacency.

### Acceptance criteria

- A rule preceded by one or more contiguous `#` lines (no blank line between)
  exposes those lines, in order, associated with that rule, each with `$loc`.
- A blank line between the comment and the rule ⇒ not associated.
- First-rule and inter-rule positions behave identically.
- Position info round-trips for sourcemap / hover use.

## Deferred downstream work (this repo)

Once a Hera release carries the enhancement:

1. Bump the `@danielx/hera` dependency.
2. `lsp/server/source/lib/hera-analyzer.civet`: extend `Declaration` (or
   `ruleSignature`) to prepend the rule's leading comments to the
   hover/completion signature.
3. Tests in `lsp/server/test/lsp-features.test.civet`: single-line comment,
   multi-line comment block, blank-line-separated (excluded), inter-rule
   comment correctly attributed to the following rule.

## Tracking

- Origin: PR #2127 (`lsp-hera-grammar-level`), hover/completion docs review.
- Needs a corresponding issue in the Hera repo for the AST change.
