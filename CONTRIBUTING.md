# Contributing to Civet

We welcome your contributions to Civet via pull requests!  Check out
[issues marked "good first issue"](https://github.com/DanielXMoore/Civet/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
for some reasonable starting points.

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
yarn
yarn build
```

To use multiple cores while building:

```sh
CIVET_THREADS=4 yarn build
```

## Testing

You can run all tests via

```sh
yarn test
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

### Debugging

A useful trick is to add a `debugger` statement inside a rule handler in
`source/parser.hera`, or use the `DebugHere` rule to an expansion,
and then run Node in debug mode via `yarn test --inspect-brk`. (Use Node 20.14
until [this issue is fixed](https://github.com/nodejs/node/issues/53681))
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
   and just run `yarn test --inspect` from the VSCode Terminal.
   You should immediately arrive at your breakpoint.

Then you can step through the parser and see what is going on in practice
as opposed to in theory.

### Parser Tracing

Sometimes you may want to check exactly what rules are checked in
detailed order. You can use `--trace tracefile`.

```sh
dist/civet --trace trace.out < some-small-test.civet
```

Since this logs every rule entry and exit as well as cache hit
it can quickly become quite large so it is best to use on as
minimal a test case as possible.

### CLI

A quick way to experiment with the parser (after building it with
`yarn build`) is to run the CLI in compilation mode:

```sh
dist/civet -c
```

In this mode, you type a Civet snippet (terminated with a blank line)
and see what it compiles to (or the resulting error).

To see more detail into how parts of your expression get parsed,
prefix your Civet snippet with `"civet verbose"`.

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

## Releasing to NPM

1. Increment `version` in `package.json` (e.g. by running `yarn version`)
2. Run `npm publish`, which will:
   * `yarn build` to build for release
   * `yarn test` to make sure nothing is broken
   * `yarn changelog --release` to update `CHANGELOG.md`
     and (ask to) create a release commit and tag it
   * Submit files to NPM (usually requiring 2FA)
3. `git push --follow-tags` to push new commit and tag
