Comparison to CoffeeScript
===

If you are coming to Civet from a CoffeeScript background this summary will be helpful.

Things Kept from CoffeeScript
---

- `is` → `===`
- `or`,  `or=`  → `||`, `||=`
- `and`, `and=` → `&&`, `&&=`
- `not` → `!`
- `a not instanceof b` → `!(a instanceof b)`
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
- `when` inside `switch` automatically breaks
- Multiple `,` separated `case`/`when` expressions
- `else` → `default` in `switch`
- `for ... when <condition>`
- `for ... by <step>` when looping over range literals
- Range literals `[0...10]`, `[a..b]`, `[x - 2 .. x + 2]`
  (with some [changes](#things-changed-from-coffeescript))
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
- `///` heregexp (with some [changes](#things-changed-from-coffeescript))
- `###` block comments (but allowing nested `*/`)
- JSX [with improved shorthands and an optional nested syntax](../README.md#jsx-enhancements)
  (with some [changes](#things-changed-from-coffeescript))

Things Removed from CoffeeScript
---

Most of these features are not available by default, but can be enabled by adding a [`"civet coffeeCompat"` directive prologue](#coffeescript-compatibility) to the top of your file.
The goal is to provide a very high level of compatibility with existing CoffeeScript code while offering a fine grained migration path to modern
Civet.

- Implicit `var` declarations (use `"civet coffeeCompat"` or `"civet autoVar"`)
- `on/yes/off/no` (use `true/false`, `"civet coffeeCompat"`, or `"civet coffeeBooleans"` to add them back)
- `do` keyword (replaced with JS `do...while` blocks and new `do` blocks; replace with `((x) -> ...)(x)` syntax or use `"civet coffeeCompat"`, or `"civet coffeeDo"`)
- `for from` (use JS `for of`, `"civet coffeeCompat"`, or `"civet coffeeForLoops"`)
- `for in` (use `for each of`, or `"civet coffeeCompat"`, or `"civet coffeeForLoops"`)
- `for own of` (use `for own in`, or `"civet coffeeCompat"`, or `"civet coffeeForLoops"`)
- Range literals `[a..b]` and `[a...b]` are increasing by default
  (same as Civet and CoffeeScript slices): if `a > b`, then `[a..b]` is empty.
  To get a decreasing range, use `[a..>=b]` or `[a..>b]`,
  or use `"civet coffeeCompat"` or `"civet coffeeRange"`.
- `a ? b` (use `a ?? b`, though it doesn't check for undeclared variables; `"civet coffeeCompat"`, or `"civet coffeeBinaryExistential"` enables `a ? b` at the cost of losing JS ternary operator)
- `a of b` (use `a in b` as in JS, or `"civet coffeeCompat"`, or `"civet coffeeOf"`)
- `a not of b` (use `a not in b`, or `"civet coffeeCompat"`, or `"civet coffeeOf"`)
- Prototype shorthand: `X::` → `X.prototype`, `X::a` → `X.prototype.a` (use `"civet coffeeCompat"`, or `civet "coffeePrototype"`). Note that Civet doesn't allow space
between the identifier and the `::`.
- Backtick embedded JS (replaced by template literals)
- `#` one-line comments, to make room for private class fields (use `//`, or `"civet coffeeCompat"` or `"civet coffeeComment"` to enable)
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
- `for in` and `for of` are no longer swapped and become their JS equivalents (unless you specify `"civet coffeeCompat"` or `"civet coffeeForLoops"`)
- `a is in b` → `b.indexOf(a) >= 0` and
  `a is not in b` → `b.indexOf(a) < 0` instead of `a in b` and `a not in b`;
  `a in b` remains `a in b` as in JS, and `a not in b` → `!(a in b)`
  (unless you specify `"civet coffeeCompat"` or `"civet coffeeOf"`)
- `//` is a one-line comment; use `%/` for integer division
  (or specify `"civet coffeeCompat"` or `"civet coffeeDiv"`)
- `x?.y` now compiles to `x?.y` rather than the `if typeof x !== 'undefined' && x !== null` if check
- Existential `x?` → `(x != null)` no longer checks for undeclared variables.
- `x?()` → `x?.()` instead of `if (typeof x === 'function') { x() }`
- Functions don't implicitly return the last value if there's a semicolon
  at the end: `-> x` returns `x` but `-> x;` does not
- Generators don't implicitly return the last value (as this is rarely useful)
- Backtick embedded JS has been replaced with JS template literals.
- No longer allowing multiple postfix `if/unless` on the same line (use `&&` or `and` to combine conditions).
- `#{}` interpolation in `"..."` and `"""..."""` strings only when `"civet coffeeCompat"` or `"civet coffeeInterpolation"`
- Expanded chained comparisons to work on more operators `a in b instanceof C` → `a in b && b instanceof C`
- Postfix iteration/conditionals always wrap the statement [#5431](https://github.com/jashkenas/coffeescript/issues/5431):
  `try x() if y` → `if (y) try x()`
- Civet tries to keep the transpiled output verbatim as much as possible.
  In Coffee `(x)` → `x;` but in Civet `(x)` → `(x)`. Spacing and comments are also preserved as much as possible.
- Heregex / re.X
  - Stay closer to the [Python spec](https://docs.python.org/3/library/re.html#re.X)
  - Allows JS-style substitutions `${..}`. For Coffee-style substitutions `#{..}`, use `"civet coffeeCompat"` or `"civet coffeeInterpolation"`.
  - Allows JS-style comments `//` unless `"civet coffeeDiv"` is set (including by `"civet coffeeCompat"`). For Coffee-style comments `#`, use `"civet coffeeCompat"` or `"civet coffeeInterpolation"`.
  - With `coffeeComment` on, `#` is always the start of a comment outside of character classes regardless of leading space (CoffeeScript treats
  `\s+#` as comment starts inside and outside of character classes).
  - Keeps non-newline whitespace inside of character classes.
  - Doesn't require escaping `#` after space inside of character classes.
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
| coffeeBinaryExistential | `x ? y` → `x ?? y` |
| coffeeBooleans      | `yes`, `no`, `on`, `off` |
| coffeeClasses       | CoffeeScript-style `class` methods via `->` functions |
| coffeeComment       | `# single line comments` |
| coffeeDiv           | `x // y` integer division instead of JS comment |
| coffeeDo            | `do ->`, disables ES6 do/while |
| coffeeEq            | `==` → `===`, `!=` → `!==` |
| coffeeForLoops      | for in, of, from loops behave like they do in CoffeeScript |
| coffeeInterpolation | `"a string with #{myVar}"`, `///regex #{myVar}///` |
| coffeeIsnt          | `isnt` → `!==` |
| coffeeLineContinuation | `\` at end of line continues to next line |
| coffeeNot           | `not` → `!`, disabling Civet extensions like `is not` |
| coffeeOf            | `a of b` → `a in b`, `a not of b` → `!(a in b)`, `a in b` → `b.indexOf(a) >= 0`, `a not in b` → `b.indexOf(a) < 0` |
| coffeePrototype     | `x::` -> `x.prototype`, `x::y` -> `x.prototype.y` |
| coffeeRange         | `[a..b]` increases or decreases depending on whether `a < b` or `a > b` |

You can use these with `"civet coffeeCompat"` to opt in to all or use them bit by bit with `"civet coffeeComment coffeeEq coffeeInterpolation"`.
Another possibility is to slowly remove them to provide a way to migrate files a little at a time `"civet coffeeCompat -coffeeBooleans -coffeeComment -coffeeEq"`.
Both camel case and hyphens work when specifying options `"civet coffee-compat"`. More options will be added over time until 97+% compatibility is achieved.
