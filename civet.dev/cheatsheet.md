---
title: Cheatsheet
aside: false
---

# {{ $frontmatter.title }}

Here's a quick overview of the language. For more detailed information take a look at the [Reference](/reference).

<style>
  .cheatsheet {
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr 1fr
  }
  @media (max-width: 767px) {
    .cheatsheet {
      grid-template-columns: 1fr
    }
  }
  .cheatsheet > div.language-ts {
    margin: 0 !important
  }
  .cheatsheet > div.language-ts > span.lang{
    display: none
  }
</style>

<div class="cheatsheet">

```ts
// Declarations
const x = 1
let y: number = 2
var z: string = "3"
x := 1 // const x = 1
y .= 2 // let y = 2

// Destructuring
[ a, b ] := x
[ ..., last ] := x
[ first, ...rest ] := x
[ first, ..., last ] := x
[ first, ...middle, last] := x

{ a, b } := c

```

```ts
// Function application
f(x)
f(a, g(x))
f(...args, cb)

// Implicit application
f x // f(x)
f a, b, c // f(a, b, c)
f g x // f(g(x))
f a, b c // f(a, b(c))

```

```ts
// Conditionals
x && y
x and y // x && y
x || y
x or y // x || y

// relationals
x === y
x is y // x === y
x < y
x > y
// Chained relationals
x < y < z // x < y && y < z
```

```ts
// this
this
// shorthand
@ // this
@x // this.x

// instance of and typeof shorthand
x instanceof y
x <? Y // x instanceof y
typeof x === "string"
x <? "string" // typeof x === "string"
```

`````ts
// strings
"I'm a string"
'I\'m also a string'
`I'm a ${template} string`

// Block Strings
"""
  Block strings
  will dedent
"""

'''
  They work with all kinds of
  strings
'''

```
  I will dedent by removing
  common indentation
```

`````

```ts
// if conditions
if x < 3
  "it's small"

if x > 11
  "it's big"

unless paused
  run()

// loops
while x < 10
  f(x)
  x++

for item of items
  update item

for item, index of items
  update item if index > 0

for key, value in object
  log key, ':', value

for own key in object
  log `my ${key}`
```

```ts
// Postfix loops/conditionals
f(x) if x
log name for name of names

```

```ts
// Arrow Functions
inc := (x) => x + 1
add := <T>(a, b): T => a + b

// Thin arrow -> is equivalent to `function`
f := (this: ctx, a, b) ->
  ctx.log a, b if ctx.debug

```

```ts
// Block shorthand
people.map .name // people.map($ => $.name)
numbers.filter & % 2 is 0
// numbers.filter($ => $ % 2 === 0)

// Conditional declarations
throw error if { error } := result

if [, dir, base] := /^(.*\/)?([^/]*)$/.exec file
  console.log dir, base
```

```ts
// Switch
switch dir
  when '>' then civet.x++
  when '<'
    civet.x--
    civet.x = 0 if civet.x < 0
  else
    civet.waiting += 5
```

```ts
// Pattern Matching
switch s
  ""
    console.log "nothing"
  /\s+/
    console.log "whitespace"
  "hi"
    console.log "greeting"
```

```ts
// Pattern destructuring
switch x
  [{type: "text", content: /\s+/}, ...rest]
    console.log "leading whitespace"
  [{type: "text", content}, ...rest]
    console.log "leading text:", content
  [{type}, ...rest]
    console.log "leading type:", type
```

```ts
// JSX
// Better binding
<button props.click> Click Me </Button>
<button @click> Click Me Also </Button>

// Closing is optional
<div>
  <button> Click Me

// class shorthand
<.items>
  <.item>
```

```ts
// Object globs
point = data{x,y}
point = data.{x,y};
point.{x,y} = data
point3D = { point.{x,y}, z: 0 }
complex := obj.{x:a, b.c()?.y}
merged := data.{...global, ...user};
data.{a, b, ...rest} = result
```

```ts
// Property Access
json.x.y
json.'long property'
json.`${movie} name`
matrix.0.0
array.-1
array.#
```

```ts
// Await operators
await.allSettled promises
await.all promises
await.race promises
```

```ts
// Range literals
letters := ['a'..'f']
numbers := [1..10]
reversed := [10..1]
indices := [0...array.length]
```

```ts
// slicing and splicing
start := numbers[..2]
mid := numbers[3...-2]
end := numbers[-2..]
numbers[1...-1] = []
```

```ts
// Pipe operator
data
|> Object.keys
|> console.log

x.length
|> & + 1
|> .toString()

fetch url
|> await
|> .json()
|> await
|> return

// Pipe assignment
data |>= .content
```

```ts
// Thick Pipes
array
||> .pop()
||> .push 5
||> .sort()
||> .reverse()

count |> & + 1
||> console.log
|> & * 2
||> console.log

url |> fetch |> await
||> (response) => console.log response.status
|> .json() |> await
||> (json) => console.log "json:", json
|> callback
```

```ts
// this.length shorthand
@[#] = item
@[index %% #]
floor # / 2
```

</div>

## ASCII Symbols

Here is a list of ASCII symbols and their various contextual meanings in Civet.
(There are also more [Unicode symbols](/reference#unicode-operators).)

| Symbol | Meanings |
|--------|----------|
| space | Function call `f x`; TypeScript argument `Set T` |
| `?` | Non-null test `x?`, `if x? := foo()`; non-null access `x?.y`, `x?y`, `x?(...)`, `x?[...]`; null coalescing `x ?? y` (`x ? y` with `coffeeBinaryExistential`); TypeScript optionals `(x?: T) => x`; optional declaration `let x?: T`; optional types `T?`, `T??`; instanceof shorthand `x <? Class`; typeof shorthand `x <? "string"`; if/then/else ternary `x ? y : z` |
| `!` | Negation `!x`; negated operators `!=`, `!==`, `!in`, `!instanceof`, `is !like`, `!custom`, `!<?`, `!^`, `!^^`; object flag `{!x}`; JSX flag `<div !draggable>`; TypeScript non-null assertion `x!`; non-null assertion access `x!.y`, `x!y`; non-null type `T!`; forced type assertion `as!`; negated extends shorthand `!<` |
| `@` | this shorthand `@`; this properties `@x`; method bind `x@y`, `x@.y`, `@@x`; decorators `@@d` |
| `#` | private properties `x.#y`, `#y`; length shorthand `x#`, `#`; block comments `### ... ###`; one-line comments `# ...` with `coffeeComment`; CoffeeScript string interpolations `"x#{y}"` with `coffeeInterpolation` |
| `$` | JavaScript identifier character; template interpolations `` `x${y}` `` |
| `_` | JavaScript identifier character |
| `%` | Modulo operators `x % y`, `x %% y`; modulo indexing `x[i %]`; integer division `%/` |
| `^` | Binary XOR `x ^ y`; logical XOR `x ^^ y`; logical XNOR `x !^ y`, `x !^^ y`; pin patterns `(^x) =>`; multi destructuring `all^{x, y}`, `{x^: pattern}` |
| `&` | Binary AND `x & y`; logical AND `x && y`; TypeScript AND `T & S`; placeholder for function shorthand `&[x]+1` |
| `\|` | Binary OR `x \| y`; logical OR `x \|\| y`; TypeScript OR `T \| S`; pipeline `\|>`, `\|\|>` |
| `+` | Addition `x + y`; positive `+x`; increment `x++`, `++x`; object flag `{+x}`; JSX flag `<div +draggable>`; concatenation `x ++ y` |
| `-` | Subtraction `x - y`; negation `-x`; decrement `x--`, `--x`; object flag `{-x}`; JSX flag `<div -draggable>`; function arrows `->`; property name symbol `x-y: z` |
| `*` | Multiplication `x * y`; exponentiation `x ** y`; generators `function*`, `*method()`, `for*`, `yield*`; comments `/* x */` |
| `/` | Division `x / y`; integer division `x %/ y` (`x // y` with `coffeeDiv`); comments `// x`, `/* x */`; regular expressions `/x/`, `///x///`; TypeScript triple-slash directive `/// <reference/>` |
| `\` | String escape `"\""`; regular expression escape `/\//` |
| `=` | Assignment `x = y`, `x op= y`; comparisons `x == y`, `x === y`, `x != y`, `x !== y`; declaration shorthand `x .= y`, `x := y`; type shorthand `T ::= x`; function arrows `=>` |
| `~` | Binary NOT `~x` |
| `.` | Property access `x.y`; property access function `.x`; argument placeholder `f(x, .)`; bulleted list `. x` (after indentation); let shorthand `x .= y`; range literals `[x..y]`; spreads `...x` |
| `:` | Labels `:x`; symbols `:x`; object properties `x: y`, `{x: y}`; TypeScript types `let x: T`, `(x: T) =>`; property typing `{x:: T}`, `[x:: T]`; if/then/else ternary `x ? y : z`; const shorthand `x := y`; type shorthand `T ::= x`; implements shorthand `class A <: B`; prototype shorthand `x::`, `x::y` with `coffeePrototype` |
| `;` | Statement separator `x; y` |
| `,` | Argument separator `f x, y`; element separator `[x, y]`; property separator `{x, y}`; comma operator `x, y` |
| `'` | Strings `'x'`, `'''x'''`; tagged template literals `tag'x'`; property access `x's y`; directives `'civet coffeeCompat'` |
| `"` | Strings `"x"`, `"""x"""`; tagged template literals `tag"x"`; directives `"civet coffeeCompat"` |
| `` ` `` | Template literals `` `x${y}` ``, ` ```x${y}``` `, ``tag`x${y}` `` |
| `<`/`>` | Comparison operators `x < y > z`; instanceof shorthand `x <? Class`; typeof shorthand `x <? "string"`; extends shorthand `class A < B`; implements shorthand `class A <: B`; TypeScript extends shorthand `A < B`, `A > B`, `A !< B`; JSX `<div>`, `</div>`; JSX code child `> expr`; TypeScript parameter `Set<number>`; range literals `[x<..<y]`; slices `x[<i]`; function arrows `->`, `=>`; pipelines `\|>`, `\|\|>` |
| `(`/`)` | Operator ordering `(x + y) * z`; operator sections `(* 2)`; operators as functions `(*)`; function calls `f(x)`; function parameters `(x) =>` |
| `[`/`]` | Property access `x[y]`; expression properties `{[x]: y}`; array literals `[x, y]`, `[] x, y`; range literals `[x..y]` |
| `{`/`}` | Object literals `{x, y: z}`, `{} x, y: z`; object globs `x.{y,z}`, `x{y,z}`; code blocks `if (x) { y }`; JSX attributes `<div x={y}>`; template interpolations `` `x${y}` `` |
