Civet
=====

[![Build Status](https://img.shields.io/github/actions/workflow/status/DanielXMoore/Civet/build.yml?branch=master&logo=github&style=for-the-badge)](https://github.com/DanielXMoore/Civet/actions/workflows/build.yml)
[![NPM Version](https://img.shields.io/npm/v/@danielx/civet.svg?style=for-the-badge)](https://www.npmjs.com/package/@danielx/civet)
[![NPM Downloads](https://img.shields.io/npm/dm/@danielx/civet.svg?style=for-the-badge)](https://www.npmjs.com/package/@danielx/civet)
[![Coverage Status](https://img.shields.io/coverallsCoverage/github/DanielXMoore/Civet?style=for-the-badge)](https://coveralls.io/github/DanielXMoore/Civet?branch=main)
[![Discord](https://img.shields.io/discord/933472021310996512?style=for-the-badge)](https://discord.com/invite/xkrW9GebBc)
[![Open Collective](https://img.shields.io/opencollective/all/civet?style=for-the-badge)](https://opencollective.com/civet)

The modern way to write TypeScript.

- [Documentation](https://civet.dev/)
- [Design Philosophy](https://civet.dev/philosophy)
- [Civet Playground](https://civet.dev/playground)
- [Civet VSCode Extension](https://marketplace.visualstudio.com/items?itemName=DanielX.civet)
- [Discord Server](https://discord.gg/xkrW9GebBc)
- Plugins for
  [Vite, esbuild, Rollup, Webpack, Rspack](integration/unplugin)
  (including metaframeworks such as Astro),
  <!--
  [esbuild](source/esbuild-plugin.civet),
  [Vite](https://github.com/edemaine/vite-plugin-civet),
  -->
  [Babel](source/babel-plugin.mjs),
  [Gulp](integration/gulp),
  [ESM module resolution](source/esm.civet),
  [CJS](register.js),
  [Bun](source/bun-civet.civet)
- Starter templates for [Solid](https://github.com/orenelbaum/solid-civet-template) and [Solid Start](https://github.com/orenelbaum/solid-start-civet-template)

Quickstart Guide
---

```bash
# Install
npm install -g @danielx/civet
# Run Civet code directly in a REPL
civet
# Transpile typed Civet code into TypeScript in a REPL
civet -c
# Compile Civet source file to TypeScript
civet < source.civet > output.ts
# Execute a .civet script
civet source.civet ...args...
# Execute a .civet source file in node using ts-node
node --loader ts-node/esm --loader @danielx/civet/esm source.civet
```

![image](https://user-images.githubusercontent.com/18894/184558519-b675a903-7490-43ba-883e-0d8addacd4b9.png)

Code Sample
---

```typescript
ts, {CompilerOptions} from typescript

DefaultCompilerOptions : CompilerOptions :=
  allowNonTsExtensions: true
  allowJs: true
  target: ts.ScriptTarget.Latest
  moduleResolution: ts.ModuleResolutionKind.NodeJs
  module: ts.ModuleKind.CommonJS
  allowSyntheticDefaultImports: true
  experimentalDecorators: true

fileCache : Record<string, any> := {}

createCompilerHost := (options: CompilerOptions, moduleSearchLocations : string[]) ->
  fileExists := (fileName: string) : boolean ->
    fileCache[fileName]?

  readFile := (fileName: string) ->
    fileCache[fileName]
```

Overview
---

Civet is essentially a tasteful superset of TypeScript.

### Implementations of New and Proposed ES Features

See the [documentation](https://civet.dev/) for examples of these
and other features.

- Pattern matching (based on [TC39 proposal](https://github.com/tc39/proposal-pattern-matching))
  - `switch` can match patterns like `[{type: "text", name}, ...rest]`
- Pipe operator (based on [F# pipes](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/symbol-and-operator-reference/#function-symbols-and-operators), [Hack pipes](https://docs.hhvm.com/hack/expressions-and-operators/pipe) and the [TC39 proposal](https://github.com/tc39/proposal-pipeline-operator))
  - `data |> Object.keys |> console.log` equivalent to
    `console.log(Object.keys(data))`
  - Use single-argument arrow functions or `&` shorthand
    to specify how to use left-hand side
  - `|> await`, `|> yield`, and `|> return` (at end)
    for wrapping left-hand side with that operation
- Short function block syntax like [Ruby symbol to proc](https://ruby-doc.org/core-3.1.2/Symbol.html#method-i-to_proc), [Crystal](https://crystal-lang.org/reference/1.6/syntax_and_semantics/blocks_and_procs.html#short-one-parameter-syntax), [Elm record access](https://elm-lang.org/docs/records#access)
  - Access: `x.map &.name` or `x.map .name` → `x.map(a => a.name)`
  - Nested access + slices: `x.map &.profile?.name[0...3]` → `x.map(a => a.profile?.name.slice(0, 3))`
  - Function call: `x.map &.callback a, b` → `x.map($ => $.callback(a, b))`
  - Unary operators: `x.map !!&` → `x.map($ => !!$)`
  - Binary operators: `x.map &+1` → `x.map($ => $+1)`
- Object literal shorthand
  - `{foo()}` → `{foo: foo()}`, `{props.foo}` → `{foo: props.foo}`
  - ``{`${x}${y}`: z}`` → ``{[`${x}${y}`]: z}``
  - `data.{x,y}` or `data{x,y}` → `{x: data.x, y: data.y}`
  - Flagging shorthand based on [from LiveScript](https://livescript.net/#literals-objects):
    `{+debug, -live, !verbose}` → `{debug: true, live: false, verbose: false}`
- Custom infix operators from any two-argument function
- `do` expressions, `if` expressions, `for` expressions

### Convenience for ES6+ Features

- Const assignment shorthand: `a := b` → `const a = b`, `{a, b} := c` → `const {a, b} = c`
- Let assignment shorthand: `a .= b` → `let a = b`
- Typed versions of above: `a: number .= 5` → `let a: number = 5`
  (but note that `a: number = 5` is the object literal `{a: (number = 5)}`).
- `@#id` → `this.#id` shorthand for private identifiers
- `import` shorthand: `x from ./x` → `import x from "./x"`
- Dynamic `import` shorthand: `import './x'` not at top level
  (e.g. `await import './x'` or inside a function) →
  `import('./x')`
- Optional import rename syntax that corresponds to destructuring rename
  `import {x: y} from "./z"` → `import {x as y} from "./z"`. You can still
  use `as` to be compatible with existing ES imports.
- `export` shorthand: `export x, y` → `export {x, y}`
- Triple backtick Template Strings remove leading indentation for clarity
- Class constructor shorthand `@( ... )`
- ClassStaticBlock `@ { ... }`
- `<` as `extends` shorthand
- `///` Block RegExp [like Python re.X](https://docs.python.org/3/library/re.html#re.X)

### JSX Enhancements

Inspired by [solid-dsl discussions](https://github.com/solidjs-community/solid-dsl/discussions)
and [jsx spec issues](https://github.com/facebook/jsx/issues)

- Indentation: instead of explicitly closing `<tag>`s or `<>`s,
  you can indent the children and Civet will close your tags for you
- Multiple adjacent elements and/or fragments get automatically
  combined into a fragment.
- Arrow function children do not need to be wrapped in braces
  (assuming they are not preceded by text); this is unambiguous because
  `>` isn't valid JSX text. For example, `<For> (item) => ...`
  (where function body can be indented).
- `#foo` shorthand for `id="foo"`;
  also `#"foo bar"`, `` #`foo ${bar}` ``, `#{expr}`
- `.foo` shorthand for `class="foo"` (but must be at least one space after
  tag name); also `.foo.bar`, `."foo bar"`, `` .`foo ${bar}` ``, `.{expr}`
  - `"civet react"` flag uses `className` instead of `class`
- `+foo` shorthand for `foo={true}`, `-foo`/`!foo` shorthand for `foo={false}`
- Any braced object literal can be used as an attribute:
  `{foo}` → `foo={foo}`, `{foo: bar}` → `foo={bar}`,
  `{...foo}` remains as is; methods and getters/setters work too.
- Attribute `...foo` shorthand for `{...foo}`
- Attribute values without whitespace or suitably wrapped
  (parenthesized expressions, strings and template strings,
  regular expressions, array literals, braced object literals)
  do not need braces:
  `foo=bar` → `foo={bar}`, `count=count()` → `count={count()}`,
  `sum=x+1` → `sum={x+1}`, `list=[1, 2, 3]` → `list={[1, 2, 3]}`
- Attributes can use computed property names:
  `[expr]={value}` → `{...{[expr]: value}}`
- `"civet solid"` flag adds correct types for JSX elements and fragments.
  Use `"civet solid client"` (default) for client-only code,
  `"civet solid server"` for server-only code (SSR only), or
  `"civet solid client server"` for isomorphic code that runs on
  client and server (SSR + hydration).
- XML comments: `<!-- ... -->` → `{/* ... */}`

### TypeScript Enhancements

- Auto-rewrite `.[mc]ts` → `.[mc]js` in imports (workaround for: https://github.com/microsoft/TypeScript/issues/37582)
- `:=` readonly class field initializer
  ```typescript
    class A
      x := 3
  ```
  ```typescript
    class A {
      readonly x = 3
    }
  ```
- Proposal: [Typed Destructuring](https://github.com/DanielXMoore/Civet/discussions/126)
- Proposal: [Dot Notation for Types](https://github.com/DanielXMoore/Civet/discussions/190)
- Proposal: [Module Interfaces](https://github.com/DanielXMoore/Civet/discussions/179) https://github.com/microsoft/TypeScript/issues/38511
- TODO: [Type Declaration Shorthand](https://github.com/DanielXMoore/Civet/issues/176)

### Changes from ES6

- Implicit returns, even for multi-statement functions
  (avoid by specifying a `void` return type, adding a trailing `;` or
  explicit `return`, or via the directive `"civet -implicitReturns"`)
- Disallow no parens on single argument arrow function. `x => ...` must become `(x) => ...`
  The reasoning is `x -> ...` => `x(function() ...)` in CoffeeScript and having `->` and `=>`
  behave more differently than they already do is bad. Passing an anonymous function to an
  application without parens is also convenient.
- `for(i of x) ...` defaults to const declaration → `for(const i of x) ...`
- Disallow comma operator in conditionals and many other places. `if x, y` is not allowed. But `for i = 0, l = a.length; i < l; i++, i *= 2` is allowed.
- Comma operator in `case`/`when` instead becomes multiple conditions.
- Numbers can't end with a dot (otherwise would be ambiguous with CoffeeScript slices `y[0..x]`). This also implies that you can't access properties
of numbers with `1..toString()` use `1.toString()` instead. When exponent follows a dot it is treated as a property access since an exponent
could be a valid property `1.e10` → `1..e10`. The workaround is to add a trailing zero `1.0e10` or remove the dot before the exponent `1e10`.
- Additional reserved words `and`, `or`, `loop`, `until`, `unless`
- Experimental decorator syntax is `@@` instead of `@` because `@` is premium real estate and `@id` → `this.id`, and `@` is also static fields/methods, etc.
  ```
  @@classDecorator
  class X
    @@methodDecorator
    method() {}
  ```
- `when` inside switch automatically breaks and adds block scope.
- `else` inside switch adds block scope.
- No whitespace between unary operators and operands. Mandatory whitespace between condition and ternary `?` ex. `x ? a : b` since `x?` is the unary existential operator.
- Labels written `:label` (except for special case `$:` for Svelte)

### Scripting Improvements

- Shebang line is kept unmodified in output
  ```civet
  #!./node_modules/.bin/ts-node
  console.log "hi"
  ```

Comparison to CoffeeScript
---

Take a look at this [detailed Civet // CoffeeScript comparision](./notes/Comparison-to-CoffeeScript.md)

ECMAScript Compatibility
---

You can specify `"civet"` prologue directives to increase
compatibility with ECMAScript/TypeScript:

| Configuration       | What it enables |
|---------------------|---------------------------------------|
| -implicit-returns   | turn off implicit return of last value in functions |

Put them at the top of your file:

```
"civet -implicit-returns"
```

Your can separate multiple options with spaces.

Deno Compatibility
---

TypeScript only allows importing `.ts` files as `.js`. Deno follows ESM and requires importing files with the correct extension.

Civet automatically rewrites imports to work around [this issue](https://github.com/microsoft/TypeScript/issues/42151) in TS.

When Civet detects it is running in Deno rewriting imports is turned off. If for some reason Civet fails to detect running in Deno
you can turn off rewriting imports manually with these configuration options:

| Configuration         | What it enables |
|-----------------------|------------------------------------------|
| -rewrite-ts-imports   | disable rewriting .ts -> .js in imports  |
| deno                  | currently just disables rewriting imports but could add more deno specific options in the future |

Other Options
---

The `"civet"` prologue directive can also specify the following options:

| Configuration       | What it enables |
|---------------------|---------------------------------------|
| tab=NNN             | treat tab like NNN spaces (default=1) |

For example, `"civet tab=2"` or `"civet tab=4"` lets you mix tabs and spaces
in a file and be treated like they'd render in VSCode with `editor.tabSize`
set accordingly.

Using Civet in your Node.js Environment
---

You have now been convinced that Civet is right for your current/next project. Here is how
to set up your environment to get productive right away and have a Good Time℠.

### Testing

Code coverage with [c8](https://github.com/bcoe/c8) "just works" thanks to their source map
integration and Civet's source maps.

Currently Civet's ESM loader depends on [ts-node](https://www.npmjs.com/package/ts-node)

#### c8 + Mocha

`package.json`
```json
  "scripts": {
    "test": "c8 mocha",
    ...
  },
  "c8": {
    "extension": [
      ".civet"
    ]
  },
  "mocha": {
    "extension": [
      "civet"
    ],
    "loader": [
      "ts-node/esm",
      "@danielx/civet/esm"
    ],
    ...
  ...
```

`ts-node` must be configured with `transpileOnly` (it can't resolve alternative extensions). Also I think `module` needs to be at least `ES2020` for the Civet ESM loader to work.

`tsconfig.json`
```json
  ...
  "ts-node": {
    "transpileOnly": true,
    "compilerOptions": {
      "module": "ES2020"
    }
  }
```

If you don't care for code coverage you can skip c8 (but it is so easy why not keep it?).

You can also add `.js` and `.ts` extensions if you want to mix and match! Even `.coffee` will work if you require `coffeescript/register` or add a loader for it.

Execute the tests

```bash
yarn test
```

Step 4: Enjoy!

### Developing

Use the alpha version of [Civet Language Server](https://marketplace.visualstudio.com/items?itemName=DanielX.civet)

The language server provides syntax highlighting, completions, hover documentation, symbols outline, red squigglies, and go to definition.

---

*Q?* Why can't I just use the built-in VSCode TypeScript LSP?

*A:* VSCode's built in TypeScript LSP can't resolve non `.ts/.js`, not even with plugins. Maybe one day they'll allow for
plugins that let you adjust the resolver and insert a transpilation step but until then a separate language server is necessary.

---

*Q?* Sometimes the file outline disappears and the red squigglies are all in the wrong place and maybe a notification pops up
about some kind of LSP error.

*A:* I'm sorry that happened to you but the Civet Language Server is still alpha and improving rapidly. Please let me know
exactly what happened and I'll try to do better next time.

It may happen when there is a syntax error in your Civet file. You can check and see if it compiles using the CLI tool in the meantime.

Please do submit bug reports / feature requests.

### Building

I strongly recommend using [esbuild](https://esbuild.github.io/) for building / packaging your Civet project.

```javascript
import esbuild from 'esbuild'
import civetPlugin from '@danielx/civet/esbuild-plugin'

esbuild.build({
  ...,
  plugins: [
    civetPlugin
  ]
}).catch(() => process.exit(1))
```

It's super fast and works great!

Code Coverage
---

[![Coverage Status](https://coveralls.io/repos/github/DanielXMoore/Civet/badge.svg?branch=main)](https://coveralls.io/github/DanielXMoore/Civet?branch=main)

Sponsorship
---
If you are so inclined, you can sponsor Civet on [Open Collective](https://opencollective.com/civet).
