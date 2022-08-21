Civet
=====

A new CoffeeScript. Much closer to ES2015+ (for better or worse).

Maybe also TypeScript, the sky is the limit.

![image](https://user-images.githubusercontent.com/18894/184558519-b675a903-7490-43ba-883e-0d8addacd4b9.png)

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
  - Automatic var/let declarations
  - Implicit returns
  - `"""` Strings (for compatibility with existing .coffee code)
  - Rest parameter in any assignment position

Things Removed from CoffeeScript
---

- `on` (use `true`)
- `off` (use `false`)
- `do` keyword (replaced with JS `do`)
- Comprensions (a case could be made for keeping them)
- Iteration expression results

Things Changed from CoffeeScript
---

- `for in` and `for of` become their JS equivalents.
- `a...` is now `...a` just like JS
- `x?.y` now compiles to `x?.y` rather than the `if typeof x !== 'undefined' && x !== null` if check
- Existential `x?` -> `(x != null)` no longer checks for undeclared variables.

Things Added that CoffeeScript didn't
---

- JS Compatability
  - JS Comment Syntax `//` and `/* */`
  - Braced Blocks
  - OptionalChain longhand
  - ConditionalExpression
  - `case` statement
  - `while`
  - `do`
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
- TODO
  - TypeScript Types
