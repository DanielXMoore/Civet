---
title: Cheatsheet
aside: false
---

# {{ $frontmatter.title }}

Civet code on <span class="wide">the left</span><span class="narrow">top</span>,
compiled TypeScript output on
<span class="wide">the right</span><span class="narrow">bottom</span>.

In most cases, the Civet code on
<span class="wide">the left</span><span class="narrow">top</span>
is optional shorthand.
The TypeScript code on
<span class="wide">the right</span><span class="narrow">bottom</span>
(and most TypeScript code) is almost always also valid Civet input.

[[toc]]

## Variable Declaration

By default, you are responsible for declaring your variables
via `var`, `let`, `const`, or their shorthands:

<Playground>
a := 10
b .= 10
c: number | string .= 0
let d: boolean
var v: any
</Playground>

Alternatively, you can use a `"civet"` directive at the beginning of your file
to specify one of two automatic variable declaration modes:

### `autoVar`

<Playground>
"civet autoVar"
sos = 0
for item of iterable
  square = item * item
  sos += square
</Playground>

### `autoLet`

<Playground>
"civet autoLet"
sos = 0
for item of iterable
  square = item * item
  sos += square
</Playground>

### Declarations in Conditions and Loops

<Playground>
if match := regex.exec string
  console.log match[1], match[2]
</Playground>

<Playground>
if [, dir, base] := /^(.*\/)?([^/]*)$/.exec file
  console.log dir, base
</Playground>

<Playground>
if {x, y} := getLocation()
  console.log `At ${x}, ${y}`
else
  console.log "Not anywhere"
</Playground>

<Playground>
node .= linkedList.head
while {data, next} := node
  console.log data
  node = next
</Playground>

## Objects

### Unbraced Literals

When every property has a value, braces can be omitted.

<Playground>
person := name: 'Henry', age: 4
obj :=
  a: 1
  b: 2
  c:
    x: 'pretty'
    y: 'cool'
</Playground>

`$:` behaves specially for Svelte compatibility.  If you want a key of `$`,
wrap it in quotes or use explicit braces.

<Playground>
$: document.title = title
"$": "dollar"
{$: "dollar"}
</Playground>

### Braced Literals

With braces, the `{x}` shorthand generalizes to any
sequence of member accesses and/or calls:

<Playground>
another := {person.name, obj?.c?.x}
computed := {foo(), bar()}
named := {lookup[x+y]}
templated := {`${prefix}${suffix}`: result}
</Playground>

### Object Globs

Inspired by
[brace expansion in shell globs](https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion):

<Playground>
point = data{x,y}
point = data.{x,y};
point.{x,y} = data
point3D = { point.{x,y}, z: 0 }
complex := obj.{x:a, b.c()?.y}
merged := data.{...global, ...user};
data.{a, b, ...rest} = result
</Playground>

### Flagging Shorthand

Inspired by [LiveScript](https://livescript.net/#literals-objects):

<Playground>
config := {
  +debug
  -live
  !verbose
}
</Playground>

### Methods and Getters/Setters

Braced objects support methods and getters/setters:

<Playground>
p := {
  name: 'Mary'
  say(msg)
    console.log @name, 'says', msg
  setName(@name);
  get NAME()
    @name.toUpperCase()
}
p.say p.NAME
</Playground>

::: tip

Methods need a body, or they get treated as literal shorthand.
To specify a blank body, use `;` or `{}`.

:::

### Property Access

Many more literals can appear after a `.` to access an object property:

<Playground>
json.'long property'
json.`${movie} name`
matrix.0.0
array.-1
</Playground>

You can also write property access as an English possessive
(inspired by [_hyperscript](https://hyperscript.org/expressions/possessive/)):

<Playground>
mario's brother's name
mario?'s name
json's "long property"'s `${movie} name`
</Playground>

## Arrays

Commas are optional at the ends of lines.

<Playground>
rotate := [
  c, -s
  s, c
]
</Playground>

<Playground>
func.apply @, [
  arg1
  arg2
]
</Playground>

<Playground>
people := [
  name: "Alice"
  id: 7
,
  name: "Bob"
  id: 9
]
</Playground>

### Rest

Rest properties/parameters/elements are no longer limited to the final position.
You may use them in their first or middle positions as well.

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

You can also omit the name of the rest component:

<Playground>
[first, ..., last] = array
</Playground>

### Range Literals

`[x..y]` includes `x` and `y`, while `[x...y]` includes `x` but not `y`.

<Playground>
letters := ['a'..'f']
numbers := [1..10]
reversed := [10..1]
indices := [0...array.length]
</Playground>

### Array/String Slicing

`[i..j]` includes `i` and `j`, while `[i...j]` includes `i` but not `j`.
`i` and/or `j` can be omitted when slicing.

<Playground>
start := numbers[..2]
mid := numbers[3...-2]
end := numbers[-2..]
numbers[1...-1] = []
</Playground>

## Strings

Strings can span multiple lines:

<Playground>
console.log "Hello,
world!"
</Playground>


### Triple-Quoted Strings

Leading indentation is removed.

<Playground>
console.log '''
  <div>
    Civet
  </div>
'''
</Playground>

<Playground>
console.log """
  <div>
    Civet #{version}
  </div>
"""
</Playground>

<Playground>
console.log ```
  <div>
    Civet ${version}
  </div>
```
</Playground>

## Operators

### All JavaScript/TypeScript Operators

<Playground>
center := min + length / 2
name := user?.name ?? defaultName
typeof x === "string" && x += "!"
result! as string | number
</Playground>

### Late Assignment

<Playground>
a + b = c
</Playground>

### Multi Assignment

<Playground>
(count[key] ?= 0)++
(count[key] ?= 0) += 1
++count *= 2
</Playground>

### Humanized Operators

<Playground>
a is b
a is not b
a and b
a or b
a not in b
a not instanceof b
a?
</Playground>

### Includes Operator

<Playground>
item is in array
item is not in array
substring is in string
item1 ∈ container ∌ item2  // Unicode
</Playground>

### Assignment Operators

<Playground>
a and= b
a or= b
a ?= b
obj.key ?= "civet"
</Playground>

### Optional Chaining

<Playground>
obj?[key]
fun?(arg)
</Playground>

## Existence Checking

<Playground>
x?
x.y[z]?
</Playground>

### Chained Comparisons

<Playground>
a < b <= c
a ≤ b ≤ c  // Unicode
a ≡ b ≣ c ≠ d ≢ e
a is b is not c
a instanceof b not instanceof c
x? instanceof Function
</Playground>

### `instanceof` shorthand

<Playground>
a <? b
a !<? b
a <? b !<? c
</Playground>

### `typeof` shorthand

<Playground>
a <? "string"
a !<? "string"
a instanceof "number"
a not instanceof "number"
</Playground>

### Logical XOR Operator

<Playground>
a ^^ b
a xor b
a ^^= b
a xor= b
</Playground>

<Playground>
a !^ b
a xnor b
a !^= b
a xnor= b
</Playground>

### Modulo Operator

`%` can return negative values, while `%%` is always between 0 and the divisor.

<Playground>
let a = -3
let b = 5
let rem = a % b
let mod = a %% b
console.log rem, mod
</Playground>

### `Object.is`

The `"civet objectIs"` directive changes the behavior of the `is` operator to
[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is),
which is a bit better behaved than `===`.
The plan is to make this the default behavior, once TypeScript supports
type narrowing with `Object.is` as well as it does for `===`.
(Currently, `a is b` will not correctly narrow `b` in some edge cases.)

<Playground>
"civet objectIs"
a is b
a is not b
</Playground>

### Pipe Operator

Based on
[F# pipes](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/symbol-and-operator-reference/#function-symbols-and-operators) and
[TC39 Proposal: Pipe Operator](https://github.com/tc39/proposal-pipeline-operator).

<Playground>
data
  |> Object.keys
  |> console.log
</Playground>

Pairs particularly well with
[single-argument function shorthand](#single-argument-function-shorthand):

<Playground>
x.length |> & + 1 |> .toString()
</Playground>

Use `await`, `yield`, or `return` in your pipeline:

<Playground>
fetch url |> await
|> .json() |> await
|> return
</Playground>

Pipe assignment:

<Playground>
data |>= .content
</Playground>

Fat pipes `||>` pass the left-hand value to the next two steps in the pipeline
(ignoring the output from the right-hand side):

<Playground>
array
||> .pop()
||> .push 5
||> .sort()
||> .reverse()
</Playground>

<Playground>
count |> & + 1
||> console.log
|> & * 2
||> console.log
</Playground>

<Playground>
url |> fetch |> await
||> (response) => console.log response.status
|> .json() |> await
||> (json) => console.log "json:", json
|> callback
</Playground>

Unicode forms:

<Playground>
data ▷= func1 |▷ func2 ▷ func3
</Playground>

### Await Operators

[TC39 proposal: `await` operations](https://github.com/tc39/proposal-await.ops)

<Playground>
await.allSettled promises
</Playground>

<Playground>
await.all
  for url of urls
    fetch url
</Playground>

<Playground>
await.all
  for url of urls
    async do
      fetch url |> await |> .json() |> await
</Playground>

### Custom Infix Operators

You can also define your own infix operators;
see [Functions as Infix Operators](#functions-as-infix-operators) below.

## Functions

### Function Calls

The parentheses in a function call are usually optional.
If present, there should be no space between the function and the open paren.

<Playground>
console.log x, f(x), (f g x), g f x
</Playground>

### `function`

<Playground>
function abort
  process.exit 1
</Playground>

<Playground>
function circle(degrees: number): {x: number, y: number}
  radians := degrees * Math.PI / 180
  x: Math.cos radians
  y: Math.sin radians
</Playground>

::: info
Implicit return of the last value in a function can be avoided by
specifying a `void` return type (or `Promise<void>` for async functions),
adding a final semicolon or explicit `return`,
or globally using the directive `"civet -implicitReturns"`.
:::

<Playground>
function abort
  process.exit 1;
</Playground>

<Playground>
function abort: void
  process.exit 1
</Playground>

<Playground>
function run(command: string): Promise<void>
  await exec command
</Playground>

### One-Line Functions

<Playground>
function do console.log "Anonymous"
function f do console.log "Named"
function f(x) do console.log x
</Playground>

### Function Overloading

<Playground>
function add(a: string, b: string): string
function add(a: number, b: number): number
  a+b
</Playground>

### Arrow Functions

::: info
Unlike ECMAScript, zero-argument arrows do not need a `()` prefix,
but one-argument arrows do need parentheses around the argument.
:::

<Playground>
abort := => process.exit 1
</Playground>

<Playground>
createEffect => console.log data()
greet := (name) => console.log "Hello", name
</Playground>

::: info
`=>` makes arrow functions as usual, while
`->` makes `function`s (which can have `this` assigned via `.call`).
:::

<Playground>
add := (a: number, b: number) => a + b
</Playground>

<Playground>
add := (a: number, b: number) -> a + b
</Playground>

::: info
Unlike ECMAScript, even multi-line arrow functions implicitly return their
last value.  See [above](#function) for how to avoid this behavior.
:::

<Playground>
circle := (degrees: number): {x: number, y: number} =>
  radians := degrees * Math.PI / 180
  x: Math.cos radians
  y: Math.sin radians
</Playground>

You can also use Unicode arrows:

<Playground>
curryAdd := (a: number) → (b: number) ⇒ a + b
</Playground>

### `return.value`

Instead of specifying a function's return value when it returns,
you can prepare it ahead of time using `return.value`
(or its shorthand, assigning to `return`).
Using this feature disables implicit `return` for that function.

<Playground>
function sum(list: number[])
  return .= 0
  for item of list
    return += item
</Playground>

<Playground>
function search<T>(list: T[]): T | undefined
  return unless list
  for item of list
    if match item
      return = item
  return++ if return.value
  list.destroy()
</Playground>

### Single-Argument Function Shorthand

<Playground>
x.map &.name
x.map &.profile?.name[0...3]
x.map &.callback a, b
x.map +&
</Playground>

::: info
Short function block syntax like [Ruby symbol to proc](https://ruby-doc.org/core-3.1.2/Symbol.html#method-i-to_proc),
[Crystal](https://crystal-lang.org/reference/1.6/syntax_and_semantics/blocks_and_procs.html#short-one-parameter-syntax),
or [Elm record access](https://elm-lang.org/docs/records#access).
:::

You can also omit `&` when starting with a `.` or `?.` property access:

<Playground>
x.map .name
x.map ?.profile?.name[0...3]
</Playground>

### Functions as Infix Operators

You can "bless" an existing function to behave as an infix operator
(and a negated form) like so:

<Playground>
operator contains
x contains y
x not contains y
</Playground>

You can combine this with a [variable declaration](#variable-declaration):

<Playground>
operator {min, max} := Math
value min ceiling max floor
</Playground>

You can also define an operator with a function body:

<Playground>
operator calls<T,R>(t: T, f: (this: T) => R): R
  f.call(t)
this calls callback
</Playground>

Operators are just functions in the end, and behave as such when used
unambiguously:

<Playground>
operator foo
x foo foo(y, z)
x (foo) y
</Playground>

You can also `import` functions from another module as operators
(independent of whether they are declared as operators in the other module):

<Playground>
import { operator contains } from 'bar'
x contains y
export operator has(x, y)
  y contains x
</Playground>

### Operator Assignment

Even without blessing a function as an `operator`, you can use it in
an assignment form:

<Playground>
{min, max} := Math
smallest .= Infinity
largest .= -Infinity
for item in items
  smallest min= item
  largest max= item
</Playground>

## Conditions

### If/Else

<Playground>
if coffee or relaxed
  code()
else
  sleep()
</Playground>

### One-Line If/Else

<Playground>
if coffee or relaxed then code() else sleep()
</Playground>

### If/Else Expressions

<Playground>
name :=
  if power === Infinity
    "Saitama"
  else if power > 9000
    "Goku"
caps := if name? then name.toUpperCase() else 'ANON'
</Playground>

### Unless

<Playground>
unless tired
  code()
</Playground>

### Postfix If/Unless

<Playground>
civet.speed = 15 if civet.rested
</Playground>

### Switch

<Playground>
switch dir
  when '>' then civet.x++
  when '<'
    civet.x--
    civet.x = 0 if civet.x < 0
  else civet.waiting += 5
</Playground>

With implicit `return`:

<Playground>
getX := (civet: Civet, dir: Dir) =>
  switch dir
    when '>' then civet.x + 3
    when '<' then civet.x - 1
    when '^' then civet.x + 0.3
</Playground>

### Pattern Matching

<Playground>
switch s
  ""
    console.log "nothing"
  /\s+/
    console.log "whitespace"
  "hi"
    console.log "greeting"
</Playground>

<Playground>
switch a
  []
    console.log "empty"
  [item]
    console.log "one", item
  [first, ...middle, last]
    console.log "multiple", first, "...", last
  else
    console.log "not array"
</Playground>

::: info
Array patterns are exact; object patterns allow unmatched properties
(similar to TypeScript types).
:::

<Playground>
switch x
  {type: "text", content}
    console.log `"${content}"`
  {type, ...rest}
    console.log `unknown type ${type}`
  else
    console.log 'unknown'
</Playground>

<Playground>
switch x
  [{type: "text", content: /\s+/}, ...rest]
    console.log "leading whitespace"
  [{type: "text", content}, ...rest]
    console.log "leading text:", content
  [{type}, ...rest]
    console.log "leading type:", type
</Playground>

::: info
You can also use condition fragments as patterns.
:::

<Playground>
switch x
  < 0
    console.log "it's negative"
  > 0
    console.log "it's positive"
  is 0
    console.log "it's zero"
  else
    console.log "it's something else"
</Playground>

<Playground>
switch x
  % 15 is 0
    console.log "fizzbuzz"
  % 3 is 0
    console.log "fizz"
  % 5 is 0
    console.log "buzz"
  else
    console.log x
</Playground>

::: info
Aliasing object properties works the same as destructuring.
:::

<Playground>
switch e
  {type, key: eventKey}
    return [type, eventKey]
</Playground>

::: info
Patterns can aggregate duplicate bindings.
:::

<Playground>
switch x
  [{type}, {type}]
    type
</Playground>

## Loops

All JavaScript loops are available,
with optional parentheses around the clause.

<Playground>
for let i = 0; i < 100; i++
  console.log i
</Playground>

### for..of

Looping over an iterator via `for..of` defaults to `const`:

<Playground>
for item of list
  console.log item
</Playground>

<Playground>
for let item of list
  item *= item
  console.log item
</Playground>

You can also keep track of the current index of the iteration
by specifying a comma and a second variable (also defaulting to `const`):

<Playground>
for item, index of list
  console.log `${index}th item is ${item}`
</Playground>

### for each..of

For Arrays and other objects implementing `.length` and `[i]` indexing,
you can use `for each..of` as an optimized form of `for..of`
(without building an iterator):

<Playground>
for each item of list
  console.log item
</Playground>

<Playground>
for each let item of list
  item *= item
  console.log item
</Playground>

<Playground>
for each item, index of list
  console.log `${index}th item is ${item}`
</Playground>

`for each` loops are similar to `Array.prototype.forEach` (hence the name),
but are more efficient and allow for e.g. `break` and `continue`.

### for..in

Looping over properties of an object via `for..in` defaults to `const`:

<Playground>
for key in object
  console.log key
</Playground>

<Playground>
for var key in object
  console.log key
console.log `Last key is ${key}`
</Playground>

You can also retrieve the corresponding value
by specifying a comma and a second variable (also defaulting to `const`):

<Playground>
for key, value in object
  console.log `${key} maps to ${value}`
</Playground>

If your object might have a prototype with enumerable properties,
you can skip them with `own`:

<Playground>
for own key in object
  console.log key
</Playground>

### Loop Expressions

If needed, loops automatically assemble an Array of the last value
within the body of the loop for each completed iteration.

<Playground>
squares :=
  for item of list
    item * item
</Playground>

<Playground>
evenSquares :=
  for item of list
    continue unless item % 2 == 0
    item * item
</Playground>

<Playground>
function parities(list: number[]): string[]
  for item of list
    if item % 2 === 0
      "even"
    else
      "odd"
</Playground>

::: info
Because loop expressions wrap in an
[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE),
you cannot use `return` inside such a loop,
nor can you `break` or `continue` any outer loop.
:::

Loops that use `await` automatically get `await`ed.
If you'd rather obtain the promise for the results so you can `await` them
yourself, use `async for`.

<Playground>
results :=
  for url of urls
    await fetch url
</Playground>

<Playground>
promise :=
  async for url of urls
    await fetch url
</Playground>

### Postfix Loop

<Playground>
console.log item for item of array
</Playground>

### Infinite Loop

<Playground>
i .= 0
loop
  i++
  break if i > 5
</Playground>

### Range Loop

<Playground>
for i of [0...array.length]
  array[i] = array[i].toString()
</Playground>

<Playground>
for [1..5]
  attempt()
</Playground>

### Until Loop

<Playground>
i .= 0
until i > 5
  i++
</Playground>

### Do...While/Until Loop

<Playground>
total .= 0
item .= head
do
  total += item.value
  item = item.next
while item?
</Playground>

### Do Blocks

To put multiple lines in a scope and possibly an expression,
you can use `do` without a `while`/`until` suffix, similar to
[TC39 proposal: `do` expressions](https://github.com/tc39/proposal-do-expressions).

<Playground>
x := 5
do
  x := 10
  console.log x
console.log x
</Playground>

<Playground>
x := do
  y := f()
  y*y
</Playground>

::: info
Because `do` expressions wrap in an
[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE),
you cannot use `return`, `break`, or `continue` within them.
:::

### Async Do Blocks

You can create a promise using `await` notation with `async do`:

<Playground>
promise := async do
  result := await fetch url
  await result.json()
</Playground>

<Playground>
await Promise.allSettled for url of urls
  async do
    result := await fetch url
    await result.json()
</Playground>

### Labels

<Playground>
:outer while (list = next())?
  for item of list
    if finale item
      break outer
  continue :outer
</Playground>

::: info
Labels have the colon on the left to avoid conflict with implicit object
literals.  The colons are optional in `break` and `continue`.
As a special case, Svelte's `$:` can be used with the colon on the right.
:::

<Playground>
$: document.title = title
</Playground>

## Classes

<Playground>
class Animal
  sound = "Woof!"
  bark(): void
    console.log @sound
  wiki()
    fetch 'https://en.wikipedia.org/wiki/Animal'
</Playground>

### This

<Playground>
@
id := @id
obj := { @id }
</Playground>

### Bind

<Playground>
bound := object@.method
bound := object@method
bound := @@method
</Playground>

### Private Fields

[Private class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
do not need an explicit `this.` or `@` prefix.

<Playground>
class Counter
  #count = 0
  increment(): void
    #count++
  add(other: Counter): void
    #count += other.#count if #count in other
  set(#count)
</Playground>

### Static Fields

<Playground>
class A
  @a = 'civet'
</Playground>

### Readonly Fields

<Playground>
class B
  b := 'civet'
</Playground>

### Typed Fields

<Playground>
class C
  size: number | undefined
  @root: Element = document.body
</Playground>

### Constructor

<Playground>
class Rectangle
  @(@width: number, @height: number)
</Playground>

<Playground>
class Rectangle
  @(public width: number, public height: number)
</Playground>

### Static Block

<Playground>
class Civet
  @
    try
      this.colors = getCivetColors()
</Playground>

### Extends

<Playground>
class Civet < Animal
</Playground>

### Implements

<Playground>
class Civet < Animal <: Named
class Civet <: Animal, Named
</Playground>

### Decorators

<Playground>
@@Object.seal
class Civet
  @name = "Civet"
</Playground>

## Types

### Unknown

`???` is shorthand for the type `unknown`.

<Playground>
declare function jsonParse(json: string): ???
</Playground>

### Import

<Playground>
type { Civet, Cat } from animals
</Playground>

<Playground>
{ type Civet, meow } from animals
</Playground>

### Aliases

<Playground>
type ID = number | string
</Playground>

<Playground>
type Point = x: number, y: number
</Playground>

The `=` is optional if the content is indented:

<Playground>
type ID
  | number
  | string
type Point
  x: number
  y: number
</Playground>

### Interfaces

<Playground>
interface Point
  x: number
  y: number
</Playground>

<Playground>
interface Point3D < Point
  z: number
</Playground>

<Playground>
interface Signal
  listen(callback: =>): void
</Playground>

<Playground>
interface Node<T>
  value: T
  next: Node<T>
</Playground>

### Enum

<Playground>
enum Direction
  Up
  Down
  Left = 2 * Down
  Right = 2 * Left
</Playground>

### Assertions

<Playground>
elt as HTMLInputElement
</Playground>

## Modules

### `from` Shorthand

If you have `from` in your `import`, you can omit `import`.
You can also omit quotes around most filenames.

<Playground>
fs from fs
{basename, dirname} from path
metadata from ./package.json assert type: 'json'
</Playground>

### Import Like Object Destructuring

<Playground>
import {X: LocalX, Y: LocalY} from "./util"
{X: LocalX, Y: LocalY} from "./util"
</Playground>

### Dynamic Import

If it's not the start of a statement,
dynamic `import` does not require parentheses.

<Playground>
{x} = await import url
</Playground>

### Export Shorthand

<Playground>
export a, b, c from "./cool.js"
export x = 3
</Playground>

## Comments

### JavaScript Comments

<Playground>
// one-line comment
/** Block comment
 */
const i /* inline comment */ : number
</Playground>

### Block Comments

<Playground>
###
block comment
/* nested comment */
###
</Playground>

### `#` Comments

If you do not need
[private class fields](#private-fields),
you can enable `#` one-line comments (as in many other languages)
via a `"civet"` directive at the beginning of your file:

<Playground>
"civet coffee-comment"
# one-line comment
</Playground>

## JSX

Enhancements, inspired by [solid-dsl discussions](https://github.com/solidjs-community/solid-dsl/discussions)
and [jsx spec issues](https://github.com/facebook/jsx/issues)

### Element id

<Playground>
<div #foo>Civet
<div #{expression}>Civet
</Playground>

### Class

<Playground>
<div .foo>Civet
<div .foo.bar>Civet
<div .{expression}>Civet
<div .button.{size()}>
</Playground>

### Implicit Element

<Playground>
<.foo>Civet
</Playground>

<Playground>
"civet defaultElement=span"
<.foo>Civet
</Playground>

::: info
Implicit elements must start with `id` or `class` shorthand (`#` or `.`).
:::

### Boolean Toggles

<Playground>
<Component +draggable -disabled !hidden>
</Playground>

::: tip

`!` is synonymous with `-` and both say "set the attribute value to false".

:::

### Attributes

Attribute values without whitespace or suitably wrapped (parenthesized expressions, strings and template strings, regular expressions, array literals, braced object literals) do not need braces:

<Playground>
<div
  foo=bar
  count=count()
  sum=x+1
  list=[1, 2, 3]
>
  Civet
</Playground>

Arbitrary [braced literals](#braced-literals) convert to equivalent JSX:

<Playground>
<div {foo}>Civet
<div {props.name}>Civet
<div {data()}>Civet
</Playground>

Call/member/glob/spread expressions without unwrapped whitespace
do not need braces
(but note that simple identifiers remain empty attributes):

<Playground>
<div foo>Civet
<div data()>Civet
<div @name>Civet
<div @@onClick>Civet
<div modal@onClick>Civet
<div props{name, value}>Civet
<div ...foo>Civet
</Playground>

Computed property names:

<Playground>
<div [expr]={value}>Civet
<div `data-${key}`={value}>Civet
</Playground>

### Comments

<Playground>
<div>
  <!-- Comment -->
  Civet
</Playground>

### Indentation

Closing tags are optional if JSX uses indentation.

<Playground>
return
  <>
    <div>
      Hello {name}!
    {svg}
</Playground>

### Implicit Fragments

Adjacent elements/fragments get implicitly combined into one fragment,
unless they are items in an array.

<Playground>
return
  <h1>Hello World!
  <div>Body
</Playground>

<Playground>
[
  <h1>Hello World!
  <div>Body
]
</Playground>

### Function Children

<Playground>
<For each=items()>
  (item) =>
    <li>{item}
</Playground>

## [SolidJS](https://www.solidjs.com/)

`link` automatically typed as `HTMLAnchorElement`

<Playground>
"civet solid"
link := <a href="https://civet.dev/">Civet
</Playground>

## [CoffeeScript](https://coffeescript.org/) Compatibility

Turn on full [CoffeeScript](https://coffeescript.org/) compatibility mode
with a `"civet coffeeCompat"` directive at the top of your file,
or use more specific directive(s) as listed below.
You can also selectively remove features, such as
`"civet coffeeCompat -coffeeForLoops -autoVar"`.

### CoffeeScript For Loops

<Playground>
"civet coffeeForLoops autoVar"
for item, index in array
  console.log item, index
for key, value of object
  console.log key, value
for own key, value of object
  console.log key, value
for item from iterable
  console.log item
</Playground>

### Double-Quoted Strings

<Playground>
"civet coffeeInterpolation"
console.log "Hello #{name}!"
</Playground>

### CoffeeScript Operators

<Playground>
"civet coffeeEq"
x == y != z
</Playground>

<Playground>
"civet coffeeIsnt"
x isnt y
</Playground>

<Playground>
"civet coffeeNot"
not (x == y)
not x == y
</Playground>

<Playground>
"civet coffeeBinaryExistential"
x ? y
</Playground>

<Playground>
"civet coffeeOf"
item in array
key of object
</Playground>

<Playground>
"civet coffeePrototype"
X::
X::a
</Playground>

### CoffeeScript Booleans

<Playground>
"civet coffeeBooleans"
on
off
yes
no
</Playground>

### CoffeeScript Comments

If you don't need [private class fields](#private-fields),
you can enable `#` for single-line comments:

<Playground>
"civet coffeeComment"
# one-line comment
</Playground>

[`###...###` block comments](#block-comments) are always available.
