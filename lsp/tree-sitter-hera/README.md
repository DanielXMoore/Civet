# tree-sitter-hera

Minimal tree-sitter grammar for [Hera](https://github.com/DanielXMoore/Hera).

## Architecture

Line-oriented token grammar.  Lines at column 0 or 2 are the Hera grammar
surface and parse as flat sequences of grammar tokens.  Lines at column 4+
(handler / embedded code bodies) are opaque `handler_line` nodes and routed
through `queries/injections.scm` to the Civet tree-sitter for highlighting.
When the LSP is up its semanticTokens override the injected colouring with
full type information.

The "pop on outdent" works for free: a line at column 0 or 2 fails to match
the `_indent` token (which requires 4+ spaces), so the lexer falls back to
the Hera-grammar tokens.  No external scanner.

## Syntax coverage

| Feature | Example |
|---------|---------|
| Comments | `# this is a comment` |
| Strings | `"hello"` |
| Regex literals | `/[a-z]+/` |
| Character classes | `[A-Z]+`, `[^abc]` |
| Code blocks | ```` ```handler body``` ```` (content injected) |
| Type marker | `:: SomeType` |
| Arrow | `-> handler` |
| Prefix operators | `$expr`, `&expr`, `!expr` |
| Suffix quantifiers | `expr+`, `expr*`, `expr?` |
| Choice | `A / B / C` |
| Handler body | indent ≥ 4 → injected as Civet |

## Generating the parser

```bash
cd lsp/tree-sitter-hera
pnpm install
pnpm run generate
```

The generated `src/parser.c` is committed alongside `grammar.js`.

## Testing

```bash
pnpm test
```

Real-world sanity check across the Hera samples + `source/parser.hera`:

```bash
TS=node_modules/.pnpm/node_modules/.bin/tree-sitter
for f in /path/to/Hera/samples/*.hera; do
  "$TS" parse "$f" 2>/dev/null | grep -c ERROR
done
```
