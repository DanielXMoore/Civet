# tree-sitter-civet

Tree-sitter grammar for Civet, extending the TypeScript grammar with Civet-specific syntax.

## Added syntax

| Feature | Example |
|---------|---------|
| `@` this-shorthand | `@foo` → `this.foo` |
| `@@` decorators | `@@MyDecorator` |
| `\|>` pipe operator | `x \|> f` |
| `..` / `...` ranges | `1..10` |
| `unless` / `until` | `unless (cond)` |
| `->` thin arrow | `(x) -> x + 1` |
| `###` block comments | `### ... ###` |

## Generating the parser

```bash
cd lsp/tree-sitter
pnpm install
pnpm exec tree-sitter generate
```

The generated `src/parser.c` should be committed. `src/scanner.c` and `src/scanner.h` are copied from `tree-sitter-typescript` and should also remain committed.
