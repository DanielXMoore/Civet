# Civet

Civet is a compiler that compiles itself: the released `@danielx/civet` builds `source/` into `dist/`. Procedures live in [CONTRIBUTING.md](CONTRIBUTING.md); this file has the commands and the traps.

## Commands

- Install: `pnpm install`
- Build: `pnpm build`
- Test: `pnpm test`; one test: `pnpm test:grep "name"`, or add `testCase.only` while iterating
- Self-test (compile Civet with itself): `pnpm test:self`
- Typecheck: `pnpm typecheck`
- Coverage: `pnpm coverage`, gated at 100% by `pnpm coverage:check`; `pnpm coverage:show <file>` lists uncovered regions
- Try the compiler: `./dist/civet -c -e 'code'` (add `--civet <flag>` for options)
- LSP server: `cd lsp/server && pnpm build`; LSP e2e: `cd lsp/vscode && pnpm build && pnpm test:e2e`

Don't run mocha directly, and don't use `npx`.

## Traps

- `./dist/civet` is your build. `node_modules/.bin/civet` is the released compiler, so it doesn't reflect your changes.
- Tests load `source/` (including `source/parser.hera`) through a register hook, not `dist/`. Editing source changes test results without a rebuild.
- `$loc` on AST nodes drives sourcemaps. A node without it produces unmapped output. For `makeRef` nodes, set `ref.$loc`.
- CI on a PR tests the merge of the branch into main. When CI fails but local passes, pull main first.
- The typecheck baseline is `CI_TYPECHECK_MAX_ERRORS` in `.github/workflows/build.yml`. Fix new errors at their source instead of raising it. Line shifts hide new errors, so compare with `scripts/typecheck-diff.civet` (see CONTRIBUTING.md § Typecheck) before finishing any change to `source/parser.hera`, `source/parser/lib.civet`, or `source/parser/types.civet`.
- Mark a branch tests can't reach with `/* c8 ignore next -- <why> */`, and always include the why. Read `notes/coverage-mechanics.md` before reasoning about why a line is or isn't covered.
- Before adding or changing an AST node type in `source/parser/types.civet`, read `notes/parser-types-guide.md`. Use the narrowest field type the producing rule emits, not `ASTNode`.

## Conventions

- Work red/green: write a failing test first, then fix the root cause.
- Use relative paths in commands (`./dist/civet`, `scripts/foo.civet`).
- PR descriptions: link the issue, then summarize the cause and the approach. Leave out test counts, "all tests pass", and rebase status.
