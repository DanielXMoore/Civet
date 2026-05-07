# tree-sitter-civet

Minimal tree-sitter grammar for Civet, written from scratch for syntax highlighting.
Covers all token types without inheriting the 300k-line TypeScript parser.

## Syntax coverage

| Feature | Example |
|---------|---------|
| `@` this-shorthand | `@foo` → `this.foo` |
| `@@` decorators | `@@MyDecorator` |
| `\|>` pipe operator | `x \|> f` |
| `..` / `...` ranges | `1..10` |
| `unless` / `until` | `unless (cond)` |
| `->` thin arrow | `(x) -> x + 1` |
| `:=` assignment | `x := 1` |
| `###` block comments | `### ... ###` |

## Generating the parser

```bash
cd lsp/tree-sitter
pnpm install
pnpm run generate
```

The generated `src/parser.c` should be committed alongside `grammar.js`.

## Testing

```bash
pnpm test
```
