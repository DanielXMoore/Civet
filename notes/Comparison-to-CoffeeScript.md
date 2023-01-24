Comparison to CoffeeScript
===

If you are coming to Civet from a CoffeeScript background this summary will be helpful.

Things Kept from CoffeeScript
---

- `is` → `===`
- `or`,  `or=`  → `||`, `||=`
- `and`, `and=` → `&&`, `&&=`
- `a %% b` → `(a % b + b) % b`
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
- `///` Heregexp (with some [changes](#things-changed-from-coffeescript))
- JSX [with improved shorthands and an optional nested syntax](../README.md#jsx-enhancements)
  (with some [changes](#things-changed-from-coffeescript))

Things Removed from CoffeeScript
---

Most of these can be enabled by adding a [`"civet coffeeCompat"` directive prologue](#coffeescript-compatibility) to the top of your file.
The goal is to provide a very high level of compatibility with existing CoffeeScript code while offering a fine grained migration path to modern
Civet.

- Implicit `var` declarations (use `"civet coffeeCompat"` or `"civet autoVar"`)
- `on/yes/off/no` (use `true/false`, `"civet coffeeCompat"`, or `"civet coffeeBooleans"` to add them back)
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
- Prototype shorthand: `X::` → `X.prototype`, `X::a` → `X.prototype.a` (use `"civet coffeeCompat"`, or `civet "coffeePrototype"`). Note that Civet doesn't allow space
between the identifier and the `::`.
- Backtick embedded JS (replaced by template literals)
- Will add later
  - Conditional assignment `a?[x] = 3` → `a ? a[x] = 3 : undefined`
  - Multiple slice assignment `otherNumbers[0...] = numbers[3..6] = [-3, -4, -5, -6]`

Things Changed from CoffeeScript
---

- `==` → `==` rather than `===` (unless you specify `"civet coffeeCompat"` or `"civet coffeeEq"`)
- `!=` → `!=` rather than `!==` (unless you specify `"civet coffeeCompat"` or `"civet coffeeEq"`)
- `is not` → `!==`
  (unless you specify `"civet coffeeCompat"` or `"civet coffeeNot"`),
  instead of `isnt`
  (unless you specify `"civet coffeeCompat"` or `"civet coffeeIsnt"`)
- `for in` and `for of` are no longer swapped and become their JS equivalents (unless you specify `"civet coffeeCompat"` or `"civet CoffeeOf"`)
- `a is in b` → `b.indexOf(a) >= 0` and
  `a is not in b` → `b.indexOf(a) < 0` instead of `a in b` and `a not in b`;
  `a in b` remains `a in b` as in JS, and `a not in b` → `!(a in b)`
  (unless you specify `"civet coffeeCompat"` or `"civet coffeeOf"`)
- `x?.y` now compiles to `x?.y` rather than the `if typeof x !== 'undefined' && x !== null` if check
- Existential `x?` → `(x != null)` no longer checks for undeclared variables.
- `x?()` → `x?.()` instead of `if (typeof x === 'function') { x() }`
- Functions don't implicitly return the last value if there's a semicolon
  at the end: `-> x` returns `x` but `-> x;` does not
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
- JSX children need to be properly indented
  (or use `"civet coffeeCompat"` or `"civet coffeeJSX"`,
  but then all JSX tags must be explicitly closed)

Things Added that CoffeeScript Didn't
---

- CoffeeScript improvements
  - Postfix loop `run() loop` → `while(true) run()`
  - Character range literals `["a".."z"]`, `['f'..'a']`, `['0'..'9']`
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
- 99% TS Compatibility
  - Type annotations
  - `namespace`
  - `interface`
  - TypeParameters
  - `!` non-null assertions
  - and all the other TypeScript features you know and love.

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
| coffeePrototype     | enables `x::` -> `x.prototype` and `x::y` -> `x.prototype.y` shorthand.

You can use these with `"civet coffeeCompat"` to opt in to all or use them bit by bit with `"civet coffeeComment coffeeEq coffeeInterpolation"`.
Another possibility is to slowly remove them to provide a way to migrate files a little at a time `"civet coffeeCompat -coffeeBooleans -coffeeComment -coffeeEq"`.
Both camel case and hyphens work when specifying options `"civet coffee-compat"`. More options will be added over time until 97+% compatibility is achieved.
