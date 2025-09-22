---
title: Config
---

# {{ $frontmatter.title }}

Civet offers many configuration options
to adjust the language to your liking.
We start with the various options,
and then show the various ways that they can be specified.

[[toc]]

## General Options

| Configuration         | What it enables |
|-----------------------|------------------------------------------|
| `tab=`*N*             | treat tab like *N* spaces (default=1) |

## Import Options

TypeScript only allows importing `.ts` files as `.js`;
see [this issue](https://github.com/microsoft/TypeScript/issues/42151).
As a workaround,
Civet automatically rewrites imports to `.ts` into imports to `.js`.
Some environments, such as Deno, allow importing `.ts` directly,
and following ESM, require importing files with the correct extension.

| Configuration         | What it enables |
|-----------------------|------------------------------------------|
| `rewrite-civet-imports=.ext` | Rewrite `import "file.civet"` to `import "file.ext"` |
| `-rewrite-ts-imports` | disable rewriting `.ts` → `.js` in imports to avoid [this issue](https://github.com/microsoft/TypeScript/issues/42151) (useful in environments supporting direct imports of `.ts`) |

## Language Options

| Configuration       | What it enables |
|---------------------|---------------------------------------|
| [`autoConst`](reference#autoconst) | automatically declare undeclared variables with `const` |
| [`autoLet`](reference#autolet) | automatically declare undeclared variables with `let` |
| [`autoVar`](reference#autovar) | automatically declare undeclared variables with `var` |
| [`defaultElement=tag`](reference#implicit-element) | specify default JSX tag: `<.foo>` → `<tag class="foo">` |
| [`globals=foo,bar`](reference#globals) | avoid automatically declaring listed global variables |
| [`iife`](reference#iife-wrapper) | wrap the program in an IIFE to shield globals |
| [`jsxCode`](reference#automatic-code-children) | treat all JSX children as Civet code |
| [`jsxCodeNested`](reference#automatic-code-children) | treat indented JSX children as Civet code |
| [`jsxCodeSameLine`](reference#automatic-code-children) | treat same-line JSX children as Civet code |
| [`objectIs`](reference#object-is) | implement the `is` operator via `Object.is` |
| [`operators=foo,bar`](reference#functions-as-infix-operators) | declare [`operator`s](reference#functions-as-infix-operators) global to the project |
| [`repl`](reference#iife-wrapper) | wrap the program in an IIFE that exposes globals |
| [`strict`](reference#strict) | enable JavaScript strict mode (equivalent to `"use strict"`) |
| [`symbols=foo,bar`](reference#symbols) | declare well-known symbols so `:foo` refers to `Symbol.foo` |

## ECMAScript Compatibility

Eventually, we plan a `jsCompat` compatibility flag to modify Civet to be
closer to pure ECMAScript, removing the
[few places where Civet is not a superset of ECMAScript](comparison).
For now, we have the following related options:

| Configuration       | What it enables |
|---------------------|---------------------------------------|
| [`-implicit-returns`](reference#no-implicit-returns) | turn off implicit return of last value in functions |

## CoffeeScript Compatibility

| Configuration       | What it enables |
|---------------------|---------------------------------------|
| [`coffeeCompat`](reference#coffeescript-compatibility) | enable all of the following CoffeeScript compatibility flags |
| [`autoVar`](reference#autovar) | automatically declare undeclared variables with `var` |
| [`coffeeBinaryExistential`](reference#coffeescript-operators) | `x ? y` → `x ?? y` |
| [`coffeeBooleans`](reference#coffeescript-booleans) | `yes`, `no`, `on`, `off` |
| [`coffeeClasses`](reference#coffeescript-classes) | CoffeeScript-style `class` methods via `->` functions |
| [`coffeeComment`](reference#coffeescript-comments) | `# single line comments` |
| [`coffeeDiv`](reference#coffeescript-comments) | `x // y` integer division instead of JS comment |
| [`coffeeDo`](reference#coffeescript-do) | `do ->`; disables [ES6 `do...while` loops](reference#do-while-until-loop) and [Civet `do` blocks](reference#do-blocks) |
| [`coffeeEq`](reference#coffeescript-operators) | `==` → `===`, `!=` → `!==` |
| [`coffeeForLoops`](reference#coffeescript-for-loops) | `for in`/`of`/`from` loops behave like they do in CoffeeScript (like Civet's `for each of`/`in`/`of` respectively) |
| [`coffeeInterpolation`](reference#double-quoted-strings) | `"a string with #{myVar}"`, `///regex #{myVar}///` |
| [`coffeeIsnt`](reference#coffeescript-operators) | `isnt` → `!==` |
| [`coffeeJSX`](reference#indentation) | JSX children ignore indentation; tags need to be explicitly closed |
| [`coffeeLineContinuation`](reference#coffeescript-line-continuations) | `\` at end of line continues to next line |
| [`coffeeNot`](reference#coffeescript-operators) | `not` → `!`, disabling Civet extensions like [`is not`](reference#humanized-operators) |
| [`coffeeOf`](reference#coffeescript-operators) | `a of b` → `a in b`, `a not of b` → `!(a in b)`, `a in b` → `b.indexOf(a) >= 0`, `a not in b` → `b.indexOf(a) < 0` |
| [`coffeePrototype`](reference#coffeescript-operators) | `x::` -> `x.prototype`, `x::y` -> `x.prototype.y` |
| [`coffeeRange`](reference#coffeescript-range-literals) | `[a..b]` increases or decreases depending on whether `a < b` or `a > b` |

## Environment Options

Running in a particular environment?  Try one of these options:

| Configuration         | What it enables |
|-----------------------|------------------------------------------|
| `client`              | Code may run on client (default unless you specify `server`, currently just for [Solid](reference#solidjs)) |
| `deno`                | `-rewrite-ts-imports` |
| `react`               | Use `className` instead of `class` in [JSX class shorthand](reference#class) |
| `server`              | Code may run on server (currently just for [Solid](reference#solidjs)) |
| [`solid`](reference#solidjs) | Automatic type casting of JSX |

## Local Configuration via Directives

At the top of any Civet file (possibly after a `#!` line, comments,
triple slash directives, and other string directives such as `"use strict"`),
you can specify one or more configurations with a `"civet"` directive.
For example:

```js
"civet objectIs -implicit-returns tab=2"
```

This directive specifies that:
* [The `is` operator should be implemented via `Object.is`](reference#object-is)
* [Implicit returns](reference#implicit-returns) are disabled
* Tab characters should be treated like 2 spaces

In general, a word like `objectIs` or `object-is` enables a feature;
a negated word like <span style="display:inline-block">`-implicitReturns`</span>
or `-implicit-returns` disables a feature;
and an assignment like `tab=2` specifies a value for a feature (in rare cases).
You can use `camelCase` or `kebab-case` as you prefer.

## Global Configuration via Config Files

In the root directory of your project, or in a `.config` subdirectory,
you can add one of the following files:

* `🐈.json`
* `civetconfig.json`
* `civet.config.json`
* `package.json` with a `"civetConfig"` property
* Any of the above with `.yaml` or `.yml` extension
  * Requires [yaml](https://eemeli.org/yaml) to be `install`ed as optional
  [`peerDependencies`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies)
  * In particular, supports [`package.yaml`](https://github.com/pnpm/pnpm/issues/1100) with a `"civetConfig"` property
* Any of the above with a `.civet` or `.js` extension,
  with code that `export default`s an object equivalent to a JSON file.

The JSON data should consist of an object with a `"parseOptions"` property,
which should be an object specifying one of more directives in the natural way.
For example, the [directive](#local-configuration-via-directives)
`"civet objectIs -implicit-returns tab=2"` is equivalent to:

```js
{
  "parseOptions": {
    "objectIs": true,
    "implicitReturns": false,
    "tab": 2
  }
}
```

The `globals`, `symbols`, and `operators` options should be specified as an
array of strings (not a comma-separated string).  For example:

```js
{
  "parseOptions": {
    "globals": ["React", "JSX"],
    "operators": ["min", "max"]
  }
}
```

The `operators` option can also be an object mapping operator names to a
string specifying [operator behavior](reference#functions-as-infix-operators).
For example:

```js
{
  "parseOptions": {
    "operators": {
      "dot": "looser (*)",
      "mult": "arguments tighter (+)",
      "normal": ""
    }
  }
}
```

## Global Configuration within Build Tools

The [unplugin](https://github.com/DanielXMoore/Civet/blob/main/source/unplugin)
offers [options](https://github.com/DanielXMoore/Civet/tree/main/source/unplugin#options)
to specify global config directives (overriding even config files) and
to specify or disable a config file.  For example:

```js
civetPlugin({
  parseOptions: {
    objectIs: true,
    implicitReturns: false,
    tab: 2,
  },
})
```

## Configuration via API

The Civet compilation API (`compile`) offers a similar `parseOptions`
for specifying config directives:

```js
import {compile} from "@danielx/civet"
const code = await compile(civetCode, {
  parseOptions: {
    objectIs: true,
    implicitReturns: false,
    tab: 2,
  },
})
```

`compile` does not look at config files.  Instead, you can use the `config`
module to look for and parse config files:

```js
import { findInDir, findConfig, loadConfig } from "@danielx/civet/config"
// Look for standard name for config file in specified directory
const path1 = await findInDir(process.cwd())
// Look for standard name for config file in specified directory or ancestors
const path2 = await findConfig(process.cwd())
// Load config file from specified path
const config = await loadConfig(path)
// Pass config to compile
const code = await compile(civetCode, config)
```

## Configuration via CLI

By default, the Civet CLI searches all ancestor directories of the current
directory for a [configuration file](#global-configuration-via-config-files)
with a standard name.
It also options to specify config directives and to override config files:

```sh
# Specify a directive
civet --civet "objectIs -implicit-returns tab=2" ...
# Specify a config file
civet --config custom-config.civet ...
# Disable config files
civet --no-config ...
```

## Compiler Options

In addition to the "parse options" described above, there are a few
top-level options (above `parseOptions`):

- `threads`: Use specified number of Node worker threads to compile Civet files faster. Default: `0` (don't use threads), or `CIVET_THREADS` environment variable if set.
