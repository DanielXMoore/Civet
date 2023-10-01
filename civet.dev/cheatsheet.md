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

</div>
