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

***Civet*** is a programming language that compiles to
[TypeScript](https://www.typescriptlang.org/) or
[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript),
so you can [use existing tooling](/integrations)
(including VSCode type checking, hints, completion, etc.)
while enabling concise and powerful syntax.
It starts with [99% JS/TS compatibility](/comparison),
making it easy to transition existing code bases.
Then it adds many features and syntactic sugar,
with some highlights below and more comprehensive examples
in the [reference](/reference).
See also Civet's [design philosophy](/philosophy).

## Highlights: Beyond TC39

Civet code on <span class="wide">the left</span><span class="narrow">top</span>,
compiled TypeScript output on
<span class="wide">the right</span><span class="narrow">bottom</span>.

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

Fat pipes manipulate the same object repeatedly:

<Playground>
document.createElement('div')
||> .className = 'civet'
||> .appendChild document.createTextNode 'Civet'
</Playground>

Pipe expression with shorthand functions:

<Playground>
a |> & + 1 |> bar
</Playground>

### Single-Argument Function Shorthand

<Playground>
x.map .name
x.map &.profile?.name[0...3]
x.map &.callback a, b
x.map &+1
x.map -&
x.map [&, &.toUpperCase()]
</Playground>

### Custom Infix Operators

<Playground>
operator {min, max} := Math
value min ceiling max floor
</Playground>

### Declarations in Conditions and Loops

<Playground>
if match := regex.exec string
  console.log match
</Playground>

### Everything is an Expression

<Playground>
items = for item of items
  if item.length
    item.toUpperCase()
  else
    "<empty>"
</Playground>

<Playground>
return
  if x == null
    throw "x is null"
  else
    log `received x of ${x}`
    x.value()
</Playground>

<Playground>
const fs = import {readFile, writeFile} from "fs"
</Playground>

[TC39 proposal: `do` expressions](https://github.com/tc39/proposal-do-expressions)

<Playground>
x = do
  const tmp = f()
  tmp * tmp + 1
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
value > min?
a is b is not c
a instanceof b not instanceof c
</Playground>

### Default to `const` for Iteration Items

<Playground>
for (item of [1, 2, 3, 4, 5]) {
  console.log(item * item);
}
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

### [JSX](/reference#jsx)

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
