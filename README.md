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

Things Kept from CoffeeScript
---

- `is` -> `===`
- `or` -> `||`
- `and` -> `&&`
- `loop` -> `while(true)`
- `unless exp` -> `if(!exp)`
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
- Chained comparisons `a < b < c` -> `a < b && b < c`
- Postfix `if/unless/while/until/for`
- Block Strings `"""` / `'''`
  - `#{exp}` interpolation in `"""` strings
- `when` inside `switch` automatically breaks
- Multiple `,` separated `case`/`when` expressions
- `else` -> `default` in `switch`
- Range literals `[0...10]`, `[a..b]`, `[x - 2 .. x + 2]`
- Array slices `list[0...2]` -> `list.slice(0, 2)`
- Slice assignment `numbers[3..6] = [-3, -4, -5, -6]` -> `numbers.splice(3, 4, ...[-3, -4, -5, -6])`
- Implicit returns
- Simplified number method calls `1.toFixed()` -> `1..toFixed()`
- `if`/`switch` expressions
- Destructuring object assignment doesn't require being wrapped in parens at the statement level `{a, b} = c` -> `({a, b} = c)`
- JSX 😿

Things Removed from CoffeeScript
---

- Implicit `var` declarations (use `civet coffeeCompat` or `"civet autoVar"`)
- `on/yes/off/no` (use `true/false`, `"civet coffeeCompat"`, or `"civet coffeeBooleans"` to add them back)
- `isnt` (use `!==`, `"civet coffeeCompat"`, or `"civet coffeeIsnt"`)
- `not` (use `!`, `"civet coffeeCompat"`, or `"civet coffeeNot"`)
  - `not instanceof` (use `!(a instanceof b)`)
  - `not in`
  - `not of`
  - NOTE: CoffeeScript `not` precedence is dubious. `not a < b` should be equivalent to `!(a < b)` but it is in fact `!a < b`
- `do` keyword (replaced with JS `do`, invoke using existing `(-> ...)()` syntax, `"civet coffeeCompat"`, or `"civet coffeeDo"`)
- `for from` (use JS `for of`, `"civet coffeeCompat"`, or `"civet coffeeForLoops"`)
- `for own of` (use JS `for in` and check manually, switch to `Map#keys/values/entries`, or use `Object.create(null)`, or `"civet coffeeCompat"`, or `"civet coffeeForLoops"`)
- `for ... when <condition>` (use `continue if exp` inside loop, `"civet coffeeCompat"`, or `"civet coffeeForLoops"`)
- `and=`, `or=` (don't mix and match words and symbols)
- `a ? b` (use `a ?? b`, though it doesn't check for undeclared variables)
- `a of b` (use `a in b` matching JS, or `"civet coffeeCompat"`, or `"civet coffeeOf"`)
- Iteration expression results
- Backtick embedded JS (replaced by template literals)
- Will likely add later
  - Optional assignment `x?.y = 3` -> `x != null ? x.y = 3 : undefined`
  - Loop expressions (at least in compatibility mode)
  - Conditional assignment `a?[x] = 3` -> `a ? a[x] = 3 : undefined`
- Might add later
  - Braceless inline objects `x = coolStory: true`
  - `///` Heregexp
  - Rest parameter in any assignment position
  - Multiple slice assignment `otherNumbers[0...] = numbers[3..6] = [-3, -4, -5, -6]`

Things Changed from CoffeeScript
---

- `==` -> `==` rather than `===` (can be kept with `"civet coffeeCompat"` or `"civet coffeeEq"`)
- `!=` -> `!=` rather than `!==` (can be kept with `"civet coffeeCompat"` or `"civet coffeeEq"`)
- `for in` and `for of` are no longer swapped and become their JS equivalents.
- `a...` is now `...a` just like JS
- `a in b` is now `a in b` rather than `b.indexOf(a) >= 0`
- `x?.y` now compiles to `x?.y` rather than the `if typeof x !== 'undefined' && x !== null` if check
- Existential `x?` -> `(x != null)` no longer checks for undeclared variables.
- `x?()` -> `x?.()` instead of `if (typeof x === 'function') { x() }`
- Backtick embedded JS has been replaced with JS template literals.
- No longer allowing multiple postfix `if/unless` on the same line (use `&&` or `and` to combine conditions).
- `#{}` interpolation in `""` strings only when `"civet coffeeCompat"` or `"civet coffeeInterpolation"`
- Expanded chained comparisons to work on more operators `a in b instanceof C` -> `a in b && b instanceof C`
- Postfix iteration/conditionals always wrap the statement [#5431](https://github.com/jashkenas/coffeescript/issues/5431)
`try x() if y` -> `if (y) try x()`
- Civet tries to keep the transpiled output verbatim as much as possible.
  In Coffee `(x)` -> `x;` but in Civet `(x)` -> `(x);`.
  Also in Coffee
  ```coffee
    x    +    3
  ```
  -> `x + 3` without the spacing
  In Civet
  ```typescript
    x    +    3
  ```
  remains as is.

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
  - `function` keyword
  - Braced Blocks
  - `f?.(x)` function application and `a?.[x]` index OptionalChain longhand
  - `a ? b : c` ConditionalExpression
  - `case` statement
  - `do`, `do { ... } until condition`
  - `get`/`set` method definitions
  - Private identifiers `#id`
- Convenience for ES6+ Features
  - Const assignment shorthand `a := b` -> `const a = b`; `{a, b} := c` -> `const {a, b} = c`
  - `@#id` -> `this.#id` shorthand for private identifiers
  - `import` shorthand `x from ./x` -> `import x from "./x"`
  - Triple backtick Template Strings remove leading indentation for clarity
  - Class constructor shorthand `@( ... )`
  - ClassStaticBlock `@ { ... }`
  - `<` as `extends` shorthand
- Short function block syntax like [Ruby symbol to proc](https://ruby-doc.org/core-3.1.2/Symbol.html#method-i-to_proc), [Crystal](https://crystal-lang.org/reference/1.6/syntax_and_semantics/blocks_and_procs.html#short-one-parameter-syntax), [Elm record access](https://elm-lang.org/docs/records#access)
  - access `x.map &.name` -> `x.map(a => a.name)`
  - nested access + slices `x.map &.profile?.name[0...3]` -> `x.map(a => a.profile?.name.slice(0, 3))`
  - function call `x.map &.callback a, b` -> `x.map($ => $.callback(a, b))`
  - unary operators `x.map !!&`, -> `x.map($ => !!$)`
  - binary operators `x.map &+1` -> `x.map($ => $+1)`
- CoffeeScript improvements
  - Postfix loop `run() loop` -> `while(true) run()`
  - TODO
    - `["a".."z"]` character range literals
- Shebang line is kept unmodified in output
  ```civet
  #!./node_modules/.bin/ts-node
  console.log "hi"
  ```

Things Changed from ES6
---

- Implicit returns
- Disallow no parens on single argument arrow function. `x => ...` must become `(x) => ...`
  The reasoning is `x -> ...` => `x(function() ...)` in CoffeeScript and having `->` and `=>`
  behave more differently than they already do is bad. Passing an anonymous function to an
  application without parens is also convenient.
- `for(i of x) ...` defaults to const declaration -> `for(const i of x) ...`
- Disallow comma operator in conditionals and many other places. `if x, y` is not allowed.
- Comma operator in `case`/`when` instead becomes multiple conditions.
- Numbers can't end with a dot (otherwise would be ambiguous with CoffeeScript slices `y[0..x]`). This also implies that you can't access properties
of numbers with `1..toString()` use `1.toString()` instead. When exponent follows a dot it is treated as a property access since an exponent
could be a valid property `1.e10` -> `1..e10`. The workaround is to add a trailing zero `1.0e10` or remove the dot before the exponent `1e10`.
- Additional reserved words `and`, `or`, `loop`, `until`, `unless`
- No whitespace between unary operators and operands. Mandatory whitespace between condition and ternary `?` ex. `x ? a : b` since `x?` is the unary existential operator.
- No labels (yet...)

CoffeeScript Compatibility
---

Civet provides a compatability prologue directive that aims to be 97+% compatible with existing CoffeeScript2 code (still a work in progress).

```
coffeeBooleans (yes/no/on/off)
coffeeComment  (# single line comments)
coffeeEq       (`==` -> `===`, `!=` -> `!==`)
coffeeInterpolation (`"a string with {myVar}"`)
coffeeIsnt     (`isnt` -> `!==`)
```

You can use these with `"civet coffeeCompat"` to opt in to all or use them bit by bit with `"civet coffeeComment coffeeEq coffeeInterpolation"`.
Another posibility is to slowly remove them to provide a way to migrate files a little at a time `"civet coffeeCompat -coffeeBooleans -coffeeComment -coffeeEq"`.
Both camel case and hyphens work when specifying options `"civet coffee-compat"`. More options will be added over time until 97+% compatibility is achieved.

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
