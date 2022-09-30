Civet
=====

[![Build](https://github.com/DanielXMoore/Civet/actions/workflows/build.yml/badge.svg)](https://github.com/DanielXMoore/Civet/actions/workflows/build.yml)

The CoffeeScript of TypeScript. Much closer to ES2015+ (for better or worse).

- [Online Civet Playground](https://civet-web.vercel.app/)
- [Civet VSCode Extension](https://marketplace.visualstudio.com/items?itemName=DanielX.civet)

Quickstart Guide
---

```bash
# Install
npm install -g @danielx/civet
# Compile civet source file to typescript
civet < source.civet > output.ts
# Execute a civet source file in node using ts-node
node --loader ts-node/esm --loader @danielx/civet/esm source.civet
```

![image](https://user-images.githubusercontent.com/18894/184558519-b675a903-7490-43ba-883e-0d8addacd4b9.png)

Code Sample
---

```typescript
import ts, {CompilerOptions} from "typescript"

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
    return fileCache[fileName]?

  readFile := (fileName: string) ->
    return fileCache[fileName]
```

ESBuild Plugin
---

```coffee
esbuild = require "esbuild"
civetPlugin = require "@danielx/civet/esbuild-plugin"

esbuild.build
  entryPoints: ['source/main.civet']
  bundle: true
  platform: 'node'
  outfile: 'dist/main.js'
  plugins: [
    civetPlugin
  ]
.catch -> process.exit 1

```

Things Kept from CoffeeScript
---

- `is` -> `===`
- `or` -> `||`
- `and` -> `&&`
- `loop` -> `while(true)`
- `unless` conditional (without the `else`)
- `until condition` -> `while(!condition)`
- Object literal syntax
  ```coffee
  x =
    a: 1
    b: 2
    c:
      x: "pretty"
      y: "cool"
  ```
- Optional semi-colons
- Indentation based block syntax
- OptionalChain shorthand for index and function application `a?[b]` -> `a?.[b]`, `a?(b)` -> `a?.(b)`
- `?=` null-coalescing assignment shorthand
- `@` `this` shorthand `@` -> `this`, `@id` -> `this.id`
- Prototype shorthand `X::` -> `X.prototype`, `X::a` -> `X.prototype.a`
- Class static shorthand `@`
- Postfix `if/unless`
- Block Strings `"""` / `'''`
  - `#{exp}` interpolation in `"""` strings
- JSX 😿
- TODO
  - [ ] Chained comparisons

Things Removed from CoffeeScript
---

- `on/yes/off/no` (use `true/false`)
- `isnt` (use `!==`)
- `not` (use `!`)
- `do` keyword (replaced with JS `do`)
- `for from` (use JS `for of`)
- `and=`, `or=` (don't mix and match words and symbols)
- Array slices `list[0...2]` (use `list.slice(0, 2)`)
- Slice assignment `numbers[3..6] = [-3, -4, -5, -6]` (use `numbers.splice(3, 4, -3, -4, -5, -6)`)
- Ranges `[0...10]`
- Comprensions (a case could be made for keeping them)
- Iteration expression results
- Implicit declarations
- Implicit returns (will probably add later at least for single line functions)
- Rest parameter in any assignment position (might add later)
- Postfix `while/until`
- `///` Heregexp
- Embedded JS

Things Changed from CoffeeScript
---

- `==` -> `==` rather than `===` (can be kept with `"use coffee-compat"`)
- `!=` -> `!=` rather than `!==` (can be kept with `"use coffee-compat"`)
- `for in` and `for of` are no longer swapped and become their JS equivalents.
- `a...` is now `...a` just like JS
- `x?.y` now compiles to `x?.y` rather than the `if typeof x !== 'undefined' && x !== null` if check
- Existential `x?` -> `(x != null)` no longer checks for undeclared variables.
- Embedded JS `\`\`` has been replaced with JS template literals.
- No longer allowing multiple postfix `if/unless` on the same line.
- No `else` block on `unless` (negate condition and use `if`)
- Civet tries to keep the transpiled output verbatim as much as possible.
  In Coffee `(x)` -> `x;` but in Civet `(x)` -> `(x);`.
  Also in Coffee `x    +    3` -> `x + 3` but in Civet `x    +    3` remains as is.

Things Added that CoffeeScript didn't
---

- TypeScript Compatibility
  - Auto-rewrite `.[mc]ts` -> `.[mc]js` in imports (workaround for: https://github.com/microsoft/TypeScript/issues/37582)
  - Function annotations
  - `namespace`
  - `interface`
  - TypeParameters
  - `!` non-null assertions
  - `:=` readonly class field initializer
    ```typescript
      class A
        x := 3
    ```
    ```typescript
      class A {
        readonly x = 3;
      };
    ```
- JS Compatability
  - `var`, `let`, `const`
  - JS Comment Syntax `//` and `/* */`
  - Braced Blocks
  - OptionalChain longhand
  - ConditionalExpression
  - `case` statement
  - `do`, `do { ... } until condition`
- Const assignment shorthand `a := b` -> `const a = b`; `{a, b} := c` -> `const {a, b} = c`
- Convenience for ES6+ Features
  - `<` as `extends` shorthand
  - `@#id` -> `this.#id` shorthand for private identifiers
  - `import` shorthand `x from ./x` -> `import x from "./x"`
  - `\`\`\`` Block Template Strings
- Class constructor shorthand `@( ... )`
- ClassStaticBlock
- `get`/`set` method definitions
- Private identifiers `#id`
- Shebang line is kept unmodified in output
  ```civet
  #!./node_modules/.bin/ts-node
  console.log "hi"
  ```

Things Changed from ES6
---

- Disallow no parens on single argument arrow function. `x => ...` must become `(x) => ...`
  The reasoning is `x -> ...` => `x(function() ...)` in CoffeeScript and having `->` and `=>`
  behave more differently than they already do is bad. Passing an anonymous function to an
  application without parens is also convenient.

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
      "@danielx/civet/esm.mjs"
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
