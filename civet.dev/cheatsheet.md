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
  .cheatsheet > div.language-ts {
    margin: 0 !important
  }
  .cheatsheet > div.language-ts > span.lang{
    display: none
  }
</style>

<div className="cheatsheet">

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
// conditionals
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

for key in object
  log key

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

// # Conditional declarations
throw error if { error } := result

if [, dir, base] := /^(.*\/)?([^/]*)$/.exec file
  console.log dir, base
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

</div>
