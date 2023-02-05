---
title: Homepage
aside: false
---

<script setup>
  import Hero from './.vitepress/components/Hero.vue'
  import Contributors from './.vitepress/components/Contributors.vue'
  import Sponsors from './.vitepress/components/Sponsors.vue'
</script>

<Hero />

Civet on <span class="wide">the left</span><span class="narrow">top</span>,
compiled TypeScript output on
<span class="wide">the right</span><span class="narrow">bottom</span>:

## Highlights: Beyond TC39

### Pattern Matching

[TC39 Proposal: Pattern Matching](https://github.com/tc39/proposal-pattern-matching)

<Playground>
switch x
  0
    console.log("zero")
  /^\s+$/
    console.log("whitespace")
  [{type: "text", content}, ...rest]
    console.log("leading text", content)
</Playground>

### Pipelines

[TC39 Proposal: Pipe Operator](https://github.com/tc39/proposal-pipeline-operator)

<Playground>
data
  |> Object.keys
  |> console.log
</Playground>

Pipe expression with shorthand functions:

<Playground>
a |> & + 1 |> bar
</Playground>

### Dedented Strings and Templates

[TC39 Proposal: String Dedent](https://github.com/tc39/proposal-string-dedent)

<Playground>
text = """
  This text is a string that doesn't include
  the leading whitespace.
"""
</Playground>

<Playground>
text = ```
  Also works for
  ${templates}!
```
</Playground>

### Chained Comparisons

<Playground>
a < b <= c
a is b is not c
a instanceof b not instanceof c
</Playground>

### Default to `const` for Iteration Items

<Playground>
for (item of [1, 2, 3, 4, 5]) {
  console.log(item * item);
}
</Playground>

### Modulo Operator

<Playground>
let a = -3
let b = 5
let rem = a % b
let mod = a %% b
console.log rem, mod
</Playground>

### Spread in Any Position

Spreads in first or middle position:

<Playground>
[...head, last] = [1, 2, 3, 4, 5]
</Playground>

<Playground>
{a, ...rest, b} = {a: 7, b: 8, x: 0, y: 1}
</Playground>

<Playground>
function justDoIt(a, ...args, cb) {
  cb.apply(a, args)
}
</Playground>

### Import Syntax Matches Destructuring

<Playground>
import {X: LocalX, Y: LocalY} from "./util"
</Playground>

### Export Convenience

<Playground>
export a, b, c from "./cool.js"
export x = 3
</Playground>

### Single-Argument Function Shorthand

<Playground>
x.map &.name
x.map &.profile?.name[0...3]
x.map &.callback a, b
x.map +&
</Playground>

### Custom Infix Operators

<Playground>
operator {min, max} := Math
value min ceiling max floor
</Playground>

### Everything is an Expression

<Playground>
items = for item of items
  if item.length
    item.toUpperCase()
  else
    "<empty>"
x == null ? throw "x is null" : x.fn()
</Playground>

### [JSX](/cheatsheet#jsx)

<Playground>
function Listing(props)
  <h1 #heading>Hello Civet!
  <ul .items>
    <For each=props.items>
      (item) =>
        <li .item {props.style}><Item {item}>
</Playground>

<Sponsors />

## Contributors

Thank you for your work and dedication to the Civet project!

<Contributors />
