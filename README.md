Civet
=====

[![Build](https://github.com/DanielXMoore/Civet/actions/workflows/build.yml/badge.svg)](https://github.com/DanielXMoore/Civet/actions/workflows/build.yml)

A new CoffeeScript. Much closer to ES2015+ (for better or worse).

Also TypeScript, the sky is the limit.

![image](https://user-images.githubusercontent.com/18894/184558519-b675a903-7490-43ba-883e-0d8addacd4b9.png)

Code Sample
---

```typescript
import ts, {CompilerOptions} from "typescript"

const DefaultCompilerOptions : CompilerOptions =
  allowNonTsExtensions: true
  allowJs: true
  target: ts.ScriptTarget.Latest
  moduleResolution: ts.ModuleResolutionKind.NodeJs
  module: ts.ModuleKind.CommonJS
  allowSyntheticDefaultImports: true
  experimentalDecorators: true

const fileCache : Record<string, any> = {}

const createCompilerHost = (options: CompilerOptions, moduleSearchLocations : string[]) ->
  const fileExists = (fileName: string) : boolean ->
    return fileCache[fileName]?

  const readFile = (fileName: string) ->
    return fileCache[fileName]
```

Things Kept from CoffeeScript
---

- `is` -> `===`
- `or` -> `||`
- `and` -> `&&`
- `loop` -> `while(true)`
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
- `@` -> `this`
- `@id` -> `this.id`
- TODO
  - [ ] `"""` Strings (for compatibility with existing .coffee code)
  - [ ] `///` Heregexp
  - [ ] Chained comparisons

Things Removed from CoffeeScript
---

- `on` (use `true`)
- `off` (use `false`)
- `do` keyword (replaced with JS `do`)
- `for from` (use JS `for of`)
- Array slices `list[0...2]` (use `list.slice(0, 2)`)
- Comprensions (a case could be made for keeping them)
- Iteration expression results
- Implicit declarations
- Implicit returns (will probably add later)
- Rest parameter in any assignment position (might add later)

Things Changed from CoffeeScript
---

- `==` -> `==` rather than `===` (can be kept with `"use coffee-compat"`)
- `!=` -> `!=` rather than `!==` (can be kept with `"use coffee-compat"`)
- `for in` and `for of` are no longer swapped and become their JS equivalents.
- `a...` is now `...a` just like JS
- `x?.y` now compiles to `x?.y` rather than the `if typeof x !== 'undefined' && x !== null` if check
- Existential `x?` -> `(x != null)` no longer checks for undeclared variables.

Things Added that CoffeeScript didn't
---

- JS Compatability
  - `var`, `let`, `const`
  - JS Comment Syntax `//` and `/* */`
  - Braced Blocks
  - OptionalChain longhand
  - ConditionalExpression
  - `case` statement
  - `while`
  - `do`
- Const assignment shorthand `a := b` -> `const a = b`; `{a, b} := c` -> `const {a, b} = c`
- Convenience for ES6+ Features
  - `<` as `extends` shorthand
  - `@#id` -> `this.#id` shorthand for private identifiers
- ClassStaticBlock
- `get`/`set` method definitions
- Private identifiers `#id`
- Shebang line
  ```civet
  #!./node_modules/.bin/ts-node
  console.log "hi"
  ```
- TypeScript Types
