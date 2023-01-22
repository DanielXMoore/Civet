# Contributing to Civet

We welcome your contributions to Civet via pull requests!  Check out
[issues marked "good first issue"](https://github.com/DanielXMoore/Civet/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
for some reasonable starting points.

## Parser

The Civet parser and most of the transpiler is defined by
[the `grammar.hera` file](source/grammar.hera),
which is written in [Hera](https://github.com/DanielXMoore/Hera).
Hera is a parser generator built on the theory of Parser Expression Grammars
(PEGs).
[This paper by Bryan Ford](https://bford.info/pub/lang/peg.pdf) gives an
academic perspective about PEGs, and forms the theoretical foundation of Hera.
You can read the [Hera docs](https://github.com/DanielXMoore/Hera#readme)
or try playing with the
[interactive Hera demo](https://danielx.net/hera/docs/README.html);
for example, the URL Parser demo should be fairly accessible.

An alternative interface to reading Civet's `grammar.hera` is
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

A useful trick is then to add a `debugger` statement inside a rule handler in
`source/parser.hera`, then run `yarn test --inspect-brk`,
then open up Chrome dev tools.
A green node icon will appear in the top left; click on that,
connect to the node process, press F8 a couple times,
and you should end up at your breakpoint.
Then you can step through and see what is going on in practice
as opposed to in theory.

## Asking for Help

Feel free to ask us questions you have!
The easiest way is to join our
[Discord server](https://discord.gg/xkrW9GebBc) and send a message to the
relevant channel (e.g. `#compiler` for questions about the parser).
