Civet
=====

[![Build Status](https://img.shields.io/github/workflow/status/DanielXMoore/Civet/Build?logo=github&style=for-the-badge)](https://github.com/DanielXMoore/Civet/actions/workflows/build.yml)
[![NPM Version](https://img.shields.io/npm/v/@danielx/civet.svg?style=for-the-badge)](https://www.npmjs.com/package/@danielx/civet)
[![NPM Downloads](https://img.shields.io/npm/dm/@danielx/civet.svg?style=for-the-badge)](https://www.npmjs.com/package/@danielx/civet)
[![Discord](https://img.shields.io/discord/933472021310996512?style=for-the-badge)](https://discord.com/invite/xkrW9GebBc)

The CoffeeScript of TypeScript. Much closer to ES2015+ (for better or worse).

- [Online Civet Playground](https://civet-web.vercel.app/)
- [Civet VSCode Extension](https://marketplace.visualstudio.com/items?itemName=DanielX.civet)
- [Discord Server](https://discord.gg/xkrW9GebBc)

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

- `is` → `===`
- `or`,  `or=`  → `||`, `||=`
- `and`, `and=` → `&&`, `&&=`
- `loop` → `while(true)`
- `unless exp` → `if(!exp)`
- `until condition` → `while(!condition)`
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
- OptionalChain shorthand for index and function application: `a?[b]` → `a?.[b]`, `a?(b)` → `a?.(b)`
- `?=` null-coalescing assignment shorthand
- `@` `this` shorthand: `@` → `this`, `@id` → `this.id`, `{@id} → {id: this.id}`
- Prototype shorthand: `X::` → `X.prototype`, `X::a` → `X.prototype.a`
- Class static shorthand `@`
- Chained comparisons: `a < b < c` → `a < b && b < c`
- Postfix `if/unless/while/until/for`
- Block Strings `"""` / `'''`
  - `#{exp}` interpolation in `"""` strings
- `when` inside `switch` automatically breaks
- Multiple `,` separated `case`/`when` expressions
- `else` → `default` in `switch`
- Range literals `[0...10]`, `[a..b]`, `[x - 2 .. x + 2]`
- Array slices `list[0...2]` → `list.slice(0, 2)`
- Slice assignment `numbers[3..6] = [-3, -4, -5, -6]` → `numbers.splice(3, 4, ...[-3, -4, -5, -6])`
- Implicit returns
- Late assignment `x + y = z` → `x + (y = z)`
- Braceless inline objects `x = coolStory: true`
- Simplified number method calls `1.toFixed()` → `1..toFixed()`
- `if`/`switch`/`for`/`loop`/`while`/`throw` expressions
- Destructuring object assignment doesn't require being wrapped in parens at the statement level `{a, b} = c` → `({a, b} = c)`
- Prefix or postfix rest/splats `[...a]`, `x = [a...]`
- RestProperty in any position `{a, ...b, c} = d` → `{a, c, ...b} = d`
- RestElement/RestParameter in any position `(first, ...midle, last) ->` → `function(first, ...middle) { let [last] = middle.splice(-1)}`
- `///` Heregexp
  - With some [changes](#things-changed-from-coffeescript).
- JSX

Things Removed from CoffeeScript
---

Most of these can be enabled by adding a [`"civet coffeeCompat"` directive prologue](#coffeescript-compatibility) to the top of your file.
The goal is to provide a very high level of compatibility with existing CoffeeScript code while offering a fine grained migration path to modern
Civet.

- Implicit `var` declarations (use `"civet coffeeCompat"` or `"civet autoVar"`)
- `on/yes/off/no` (use `true/false`, `"civet coffeeCompat"`, or `"civet coffeeBooleans"` to add them back)
- `isnt` (use `!==`, `"civet coffeeCompat"`, or `"civet coffeeIsnt"`)
- `not` (use `!`, `"civet coffeeCompat"`, or `"civet coffeeNot"`)
  - `not instanceof` (use `!(a instanceof b)`, `"civet coffeeCompat"`, or `"civet coffeeNot"`)
  - `not of` use (`"civet coffeeCompat"`, or `"civet coffeeNot"`)
  - NOTE: CoffeeScript `not` precedence is dubious. `not a < b` should be equivalent to `!(a < b)` but it is in fact `!a < b`
- `do` keyword (replaced with JS `do`, invoke using existing `(-> ...)()` syntax, `"civet coffeeCompat"`, or `"civet coffeeDo"`)
- `for from` (use JS `for of`, `"civet coffeeCompat"`, or `"civet coffeeForLoops"`)
- `for own of` (use JS `for in` and check manually, switch to `Map#keys/values/entries`, or use `Object.create(null)`, or `"civet coffeeCompat"`, or `"civet coffeeForLoops"`)
- `for ... when <condition>` (use `continue if exp` inside loop, `"civet coffeeCompat"`, or `"civet coffeeForLoops"`)
- `a ? b` (use `a ?? b`, though it doesn't check for undeclared variables; `"civet coffeeCompat"`, or `"civet coffeeBinaryExistential"` enables `a ? b` at the cost of losing JS ternary operator)
- `a of b` (use `a in b` as in JS, or `"civet coffeeCompat"`, or `"civet coffeeOf"`)
- Backtick embedded JS (replaced by template literals)
- Will add later
  - `a %% b` → `(a % b + b) % b`
  - Conditional assignment `a?[x] = 3` → `a ? a[x] = 3 : undefined`
  - Multiple slice assignment `otherNumbers[0...] = numbers[3..6] = [-3, -4, -5, -6]`

Things Changed from CoffeeScript
---

- `==` → `==` rather than `===` (unless you specify `"civet coffeeCompat"` or `"civet coffeeEq"`)
- `!=` → `!=` rather than `!==` (unless you specify `"civet coffeeCompat"` or `"civet coffeeEq"`)
- `for in` and `for of` are no longer swapped and become their JS equivalents (unless you specify `"civet coffeeCompat"` or `"civet CoffeeOf"`)
- `a in b` now remains `a in b` rather than becoming `b.indexOf(a) >= 0` (unless you specify `"civet coffeeCompat"` or `"coffeeOf"`)
- `x?.y` now compiles to `x?.y` rather than the `if typeof x !== 'undefined' && x !== null` if check
- Existential `x?` → `(x != null)` no longer checks for undeclared variables.
- `x?()` → `x?.()` instead of `if (typeof x === 'function') { x() }`
- Backtick embedded JS has been replaced with JS template literals.
- No longer allowing multiple postfix `if/unless` on the same line (use `&&` or `and` to combine conditions).
- `#{}` interpolation in `""` strings only when `"civet coffeeCompat"` or `"civet coffeeInterpolation"`
- Expanded chained comparisons to work on more operators `a in b instanceof C` → `a in b && b instanceof C`
- Postfix iteration/conditionals always wrap the statement [#5431](https://github.com/jashkenas/coffeescript/issues/5431):
  `try x() if y` → `if (y) try x()`
- Civet tries to keep the transpiled output verbatim as much as possible.
  In Coffee `(x)` → `x;` but in Civet `(x)` → `(x)`. Spacing and comments are also preserved as much as possible.
- Heregex / re.X
  - Stay closer to the [Python spec](https://docs.python.org/3/library/re.html#re.X)
  - Allows both kinds of substitutions `#{..}`, `${..}`.
  - Also allows both kinds of single line comments `//`, `#`.
  - Keeps non-newline whitespace inside of character classes.
  - Doesn't require escaping `#` after space inside of character classes.
  - `#` is always the start of a comment outside of character classes regardless of leading space (CoffeeScript treats
  `\s+#` as comment starts inside and outside of character classes).
  - Might later add a compat flag to get more CoffeeScript compatibility.
  - Might also later add a compat flag to only use ES interpolations and comments inside Heregexes.

Things Added that CoffeeScript didn't
---

- TypeScript Compatibility
  - Auto-rewrite `.[mc]ts` → `.[mc]js` in imports (workaround for: https://github.com/microsoft/TypeScript/issues/37582)
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
        readonly x = 3
      }
    ```
- JS Compatibility
  - `var`, `let`, `const`
  - JS Comment Syntax `//` and `/* */`
  - `function` keyword
  - Braced Blocks (as an alternative to indentation)
  - `f?.(x)` function application and `a?.[x]` index OptionalChain longhand
  - `a ? b : c` ConditionalExpression
  - `case` statement
  - `do`, `do { ... } until condition`
  - Method definitions `foo(args) ...` in objects/classes
  - `get`/`set` method definitions
  - Private identifiers `#id`
- Convenience for ES6+ Features
  - Const assignment shorthand: `a := b` → `const a = b`, `{a, b} := c` → `const {a, b} = c`
  - `@#id` → `this.#id` shorthand for private identifiers
  - `import` shorthand: `x from ./x` → `import x from "./x"`
  - `export` shorthand: `export x, y` → `export {x, y}`
  - Triple backtick Template Strings remove leading indentation for clarity
  - Class constructor shorthand `@( ... )`
  - ClassStaticBlock `@ { ... }`
  - `<` as `extends` shorthand
- Short function block syntax like [Ruby symbol to proc](https://ruby-doc.org/core-3.1.2/Symbol.html#method-i-to_proc), [Crystal](https://crystal-lang.org/reference/1.6/syntax_and_semantics/blocks_and_procs.html#short-one-parameter-syntax), [Elm record access](https://elm-lang.org/docs/records#access)
  - Access: `x.map &.name` → `x.map(a => a.name)`
  - Nested access + slices: `x.map &.profile?.name[0...3]` → `x.map(a => a.profile?.name.slice(0, 3))`
  - Function call: `x.map &.callback a, b` → `x.map($ => $.callback(a, b))`
  - Unary operators: `x.map !!&` → `x.map($ => !!$)`
  - Binary operators: `x.map &+1` → `x.map($ => $+1)`
- Flagging shorthand [from LiveScript](https://livescript.net/#literals) `{+debug, -live}` → `{debug: true, live: false}`
- JSX enhancements (inspired by [solid-dsl discussions](https://github.com/solidjs-community/solid-dsl/discussions)):
  - Indentation: instead of explicitly closing `<tag>`s or `<>`s,
    you can indent the children and Civet will close your tags for you
  - Any braced object literal can be used as an attribute:
    `{foo}` → `foo={foo}`, `{foo: bar}` → `foo={bar}`,
    `{...foo}` remains as is; methods and getters/setters work too.
  - Attribute values without whitespace or suitably wrapped
    (parenthesized expressions, strings and template strings,
    regular expressions, array literals, braced object literals)
    do not need braces:
    `foo=bar` → `foo={bar}`, `count=count()` → `count={count()}`,
    `sum=x+1` → `sum={x+1}`, `list=[1, 2, 3]` → `list={[1, 2, 3]}`
  - Attributes can use computed property names:
    `[expr]={value}` → `{...{[expr]: value}}`
- CoffeeScript improvements
  - Postfix loop `run() loop` → `while(true) run()`
  - Character range literals `["a".."z"]`, `['f'..'a']`, `['0'..'9']`
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
- `for(i of x) ...` defaults to const declaration → `for(const i of x) ...`
- Disallow comma operator in conditionals and many other places. `if x, y` is not allowed.
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
- No labels (yet...)

CoffeeScript Compatibility
---

Civet provides a compatibility prologue directive that aims to be 97+% compatible with existing CoffeeScript2 code (still a work in progress).

| Configuration       | What it enables |
|---------------------|---------------------------------------------------------------------|
| autoVar             | declare implicit vars based on assignment to undeclared identifiers |
| coffeeBooleans      | `yes`, `no`, `on`, `off` |
| coffeeComment       | `# single line comments` |
| coffeeDo            | `do ->`, disables ES6 do/while |
| coffeeEq            | `==` → `===`, `!=` → `!==` |
| coffeeForLoops      | for in, of, from loops behave like they do in CoffeeScript |
| coffeeInterpolation | `"a string with #{myVar}"` |
| coffeeIsnt          | `isnt` → `!==` |
| coffeeNot           | `not` → `!`, `a not instanceof b` → `!(a instanceof b)`, `a not of b` → `!(a in b)`    |
| coffeeOf            | `a of b` → `a in b`, `a in b` → `b.indexOf(a) >= 0`, `a not in b` → `b.indexOf(a) < 0` |

You can use these with `"civet coffeeCompat"` to opt in to all or use them bit by bit with `"civet coffeeComment coffeeEq coffeeInterpolation"`.
Another possibility is to slowly remove them to provide a way to migrate files a little at a time `"civet coffeeCompat -coffeeBooleans -coffeeComment -coffeeEq"`.
Both camel case and hyphens work when specifying options `"civet coffee-compat"`. More options will be added over time until 97+% compatibility is achieved.

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
