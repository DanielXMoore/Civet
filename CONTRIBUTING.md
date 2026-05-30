# Contributing to Civet

We welcome your contributions to Civet via pull requests!  Check out
[issues marked "good first issue"](https://github.com/DanielXMoore/Civet/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
for some reasonable starting points.

## Code Style

Source is written in Civet (`.civet`).  Beyond "match the surrounding code":

- **Prefer idiomatic Civet** over the TS spelling: `is` / `and` / `or` / `not`;
  `typeof x === 'string'` → `x <? 'string'` (and `!<?`); `x != null` → `x?`;
  `.length` → `#`; `for x of xs` with an indented body.  Single-param arrows
  still need parens: `map((x) => …)`.
- **Drop call parens** for single- and simple multi-arg calls — `wordAt doc, pos`,
  `traverse grammar`.  Keep them when the result is chained (`f(x).y`,
  `m.get(k)?.keys()`), nested as another call's argument, or inside an object
  literal, where they'd be ambiguous.
- **Document functions/types with a concise `/** */`** doc comment — only JSDoc
  surfaces in LSP hover, so a one-line summary belongs there.  Reserve `//` for
  inline *why* notes; avoid multi-line `//` headers above functions.
- **Semicolon trap:** never put `;` after a postfix `if`/`unless` or a concise
  arrow body (`=> expr`) — it silently changes the meaning.

## Parser

The Civet parser and most of the transpiler is defined by
[the `parser.hera` file](source/parser.hera),
which is written in [Hera](https://github.com/DanielXMoore/Hera).
Hera is a parser generator built on the theory of Parser Expression Grammars
(PEGs).
[This paper by Bryan Ford](https://bford.info/pub/lang/peg.pdf) gives an
academic perspective about PEGs, and forms the theoretical foundation of Hera.
You can read the [Hera docs](https://github.com/DanielXMoore/Hera#readme)
or try playing with the
[interactive Hera demo](https://danielx.net/hera/docs/README.html);
for example, the URL Parser demo should be fairly accessible.

An alternative interface to reading Civet's `parser.hera` is
[this railroad diagram](https://civet.dev/railroad.html),
generated with the
[Railroad Diagram Generator](https://www.bottlecaps.de/rr/ui).
You can click around to see how the rules are constructed from smaller rules.

Parsing is a big area and it can take a while to get comfortable.
We recommend trying out modifying the grammar, or simple grammars in the
[interactive Hero demo](https://danielx.net/hera/docs/README.html)
and seeing what happens.
Or feel free to ask us questions on [Discord](https://discord.gg/xkrW9GebBc).

As a pre-requisite, you should be pretty comfortable with
[regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions),
so maybe brush up on those depending on your pre-existing experience.

## Building

Civet gets built by the following simple commands:

```sh
pnpm install
pnpm build
```

To use multiple cores while building:

```sh
CIVET_THREADS=4 pnpm build
```

### Two Civet binaries

Civet is bootstrapped: the previously-released compiler builds the current
source. So the repo has two binaries with different roles:

* `./dist/civet` — the locally-built compiler. Reflects your changes after
  `pnpm build`. Use this to test source/parser edits.
* `./node_modules/.bin/civet` — the previously-released `@danielx/civet` from
  npm. Used to compile `source/` into `dist/` during the build, so it does
  *not* reflect your changes. Useful for perf comparisons (see below).

## Testing

You can run all tests via

```sh
pnpm test
```

To use multiple cores while testing:

```sh
CIVET_THREADS=4 pnpm test
```

A useful trick when developing is to pick one test and add
[the `.only` suffix](https://mochajs.org/#exclusive-tests)
so that it is the only test that runs.
For example:

```coffee
testCase.only """
  ...
"""
```

In particular, if you're fixing a bug or adding a feature, a good approach is
to add a broken test, and temporarily add `.only`, so that you can repeatedly
run the test via `pnpm test`. (You do not need to `pnpm build` in between.)
With only one test running, you can reasonably add `console.log` and other
debugging statements to figure out what's going on.

For a one-off run from the CLI without editing the test file:

```sh
pnpm test:grep "name of test"
```

## Coverage

CI gates this repo at 100% on every c8 metric (statements / branches /
functions / lines).  The local workflow:

```sh
pnpm coverage           # run all suites (root + lsp/server + lsp/vscode e2e)
                        # and emit a unified report at coverage/
pnpm coverage:check     # gate at 100% — exits non-zero with details if not
pnpm coverage:show <p>  # show uncovered regions for files matching <p>
                        # add --branches for per-arm hit counts
pnpm coverage:merge     # re-merge existing temp data without re-running tests
                        # (fast iteration when editing exclude patterns)
```

For defensive arms tests can't reach, c8-ignore the line with a comment
that explains *why* it's unreachable, e.g.:

```civet
/* c8 ignore next -- defensive: caller always passes non-null */
return defaults if value is null
```

The `-- <why>` part is required so the next reader can judge whether the
ignore should be replaced with a test.

### "Works locally, fails on CI" coverage divergence

GitHub Actions on `pull_request` builds the **merge of HEAD onto base**, not
your branch tip.  If `main` has changed a file your PR doesn't touch, CI's
`dist/` differs from local's and coverage shapes can diverge.  When that
happens, `git fetch && git merge origin/main` first — once `md5sum dist/main.js`
matches CI's, the failure reproduces locally and you can fix it properly.

## Typecheck

CI gates type errors against a baseline (`CI_TYPECHECK_MAX_ERRORS=N` in
[`.github/workflows/build.yml`](.github/workflows/build.yml)).  A PR must not
introduce new errors — fix them at the source rather than bumping the
baseline.  Identifying what's new can be tricky because adding code shifts
line numbers, so a naive `diff` flags every shifted preexisting error as
"new".  Use the diff helper instead:

```sh
git stash && git checkout origin/main -- '*.civet' '*.hera'
pnpm build
pnpm typecheck --max-errors 99999 &>/tmp/before.log
git checkout HEAD -- '*.civet' '*.hera' && git stash pop
pnpm build
pnpm typecheck --max-errors 99999 &>/tmp/after.log
civet scripts/typecheck-diff.civet /tmp/before.log /tmp/after.log
```

`typecheck-diff` matches by `(file, code, message)` ignoring line/column, so
shifted-but-otherwise-identical errors don't show as drift — only genuinely
new diagnostics appear under "Regressions".  Once those are at zero, no
baseline bump is needed.
CI also does this diff for you, so you can check its output for regressions
(and fixes).

For a one-off summary of where errors live, `bash scripts/typecheck-summary.sh`
prints per-file and per-error-code counts.

## Debugging

A useful trick is to add a `debugger` statement inside a rule handler in
`source/parser.hera`, or use the `DebugHere` rule to an expansion,
and then run Node in debug mode via `pnpm test --inspect-brk`.
You can attach a debugger as follows:

1. In Chrome, open up dev tools.
   A green Node icon will appear in the top left;
   click on that, and then connect to the Node process.
   Press F8 a couple times, and you should end up at your breakpoint.

2. In VSCode, run the
   [Attach to Node Process command](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_attaching-to-nodejs)
   (via the Command Palette / <kbd>Ctrl+Shift+P</kbd>).
   Then select the correct Node process.
   Press F5 a couple times, and you should end up at your breakpoint.

   Alternatively, turn on
   [Auto Attach](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_auto-attach)
   and just run `pnpm test --inspect` from the VSCode Terminal.
   You should immediately arrive at your breakpoint.

Then you can step through the parser and see what is going on in practice
as opposed to in theory.

## Parser Tracing

Sometimes you may want to check exactly what rules are checked in
detailed order. You can use `--trace tracefile`.

```sh
dist/civet --trace trace.out < some-small-test.civet
```

Since this logs every rule entry and exit as well as cache hit
it can quickly become quite large so it is best to use on as
minimal a test case as possible.

## CLI

A quick way to experiment with the parser (after building it with
`pnpm build`) is to run the CLI in compilation mode:

```sh
dist/civet -c
```

In this mode, you type a Civet snippet (terminated with a blank line)
and see what it compiles to (or the resulting error).
To see more detail into how parts of your expression get parsed,
prefix your Civet snippet with `"civet verbose"`.

You can also test quick one-liners like so:

```sh
dist/civet -ce 'this is a test'
```

You can also see what JavaScript (sans TypeScript) will be generated via

```sh
dist/civet -c --js
```

Alternatively, you can run the CLI in Abstract Syntax Tree (AST) mode to see
what tree your code parses into before being converted into TypeScript:

```sh
dist/civet --ast
```

Bugs in the compiler can often be caused by caching (which is done in
[`source/main.coffee`](source/main.coffee)).  You can temporarily disable
caching to see whether that's the issue, by adding the `--no-cache`
command-line option.

## Optimizing

A quick way to get an idea of how much work the parser is doing is to
use the `--hits hitsfile.txt` to get a count of every rule checked.

```sh
dist/civet --hits hits.out < source/lib.civet
```

This will output a sorted list of rules that were checked the most.
Focusing on the rules that have the most checks should have the most
impact on performance.

By making changes to the parser and comparing the total hit counts
the overall performance of the parser can be improved.

### Performance Comparison

To compare local changes to the previously used version of civet

```sh
bash build/perf-compare.sh
```

This will time 10 runs each of `dist/civet` and `./node_modules/.bin/civet`
and print out each time as well as the average time.

## Asking for Help

Feel free to ask us questions you have!
The easiest way is to join our
[Discord server](https://discord.gg/xkrW9GebBc) and send a message to the
relevant channel (e.g. `#compiler` for questions about the parser).

## Releasing

A single push to `main` releases four artifacts (whichever ones have a new
version):

* `@danielx/civet` (root) on npm
* `@danielx/civet-language-server` (`lsp/server`) on npm
* `@danielx/civet-monaco` (`lsp/monaco`) on npm
* the VS Code extension on VS Code Marketplace and Open VSX

To cut a release:

1. Increment `version` in `package.json` (e.g. `pnpm version patch`, or `minor`
   / `major` as appropriate). Bump the package(s) you actually want to release —
   unchanged packages are skipped automatically.
2. Run `pnpm release` to regenerate `CHANGELOG.md`, prompt for a release
   commit, and tag `vX.Y.Z`.
3. `git push --follow-tags` to push the commit and tag.
4. CI publishes via OIDC trusted publishing — no `NPM_TOKEN`.

Internally, the [Build workflow](.github/workflows/build.yml) runs on the push
to `main`. On success, [Publish](.github/workflows/publish.yml) fires via
`workflow_run` and:

* Runs `pnpm install --frozen-lockfile && pnpm build`.
* Runs `bash build/autorelease.sh . lsp/server lsp/monaco`. For each directory,
  it checks `npm view <name>@<version>` and runs `npm publish --access public`
  only if that version isn't already on the registry. The root's
  `prepublishOnly` hook gates the publish with
  `pnpm build && pnpm test:coverage && pnpm changelog --verify`. Pre-release
  versions (e.g. `0.11.7-rc.1`) publish under the `pre` dist-tag.
* Runs `lsp/vscode/build/autorelease.sh`, which packages the `.vsix` and
  publishes to VS Code Marketplace (via `VSCE_PAT`) and Open VSX (via
  `OVSX_PAT`); each marketplace step is skipped if that version is already up.
