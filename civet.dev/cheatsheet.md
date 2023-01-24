---
title: Cheatsheet
aside: false
---

# {{ $frontmatter.title }}

Civet on <span class="wide">the left</span><span class="narrow">top</span>,
compiled TypeScript output on
<span class="wide">the right</span><span class="narrow">bottom</span>.

In most cases, the Civet code on
<span class="wide">the left</span><span class="narrow">top</span>
is optional shorthand.
The TypeScript code on
<span class="wide">the right</span><span class="narrow">bottom</span>
(and most TypeScript code) is almost always also valid Civet input.

[[toc]]

## Basics

### Variable Declaration

<Playground>
a := 10
b .= 10
c: number | string .= 0
let d: boolean
var v: any
</Playground>

### Objects

<Playground>
person := name: 'Henry', age: 4
obj :=
  a: 1
  b: 2
  c:
    x: 'pretty'
    y: 'cool'
</Playground>

Literal shorthand beyond `{x}`:

<Playground>
another := {person.name, obj?.c?.x}
computed := {foo(), bar()}
named := {lookup[x+y]}
</Playground>

Flagging shorthand inspired by [LiveScript](https://livescript.net/#literals-objects):

<Playground>
config := {
  +debug
  -live
  !verbose
}
</Playground>

Methods and getters/setters in braced objects:

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

Property access shorthand:

<Playground>
json.'long property'
json.`${movie} name`
matrix.0.0
array.-1
</Playground>

### Arrays

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

### Humanized Operators

<Playground>
a is b
a is not b
a and b
a or b
a not in b
a?
</Playground>

<Playground>
item is in array
item is not in array
substring is in string
</Playground>

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
function circle(theta: number): {x: number, y: number}
  radians := degrees * Math.PI / 180
  x: Math.cos theta
  y: Math.sin theta
</Playground>

::: info
Implicit return of the last value in a function can be avoided by
specifying a `void` return type, adding a final semicolon or explicit `return`,
or globally using the directive `"civet -implicitReturns"`.
:::

<Playground>
function abort: void
  process.exit 1
</Playground>

<Playground>
function abort
  process.exit 1;
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
  x: Math.cos theta
  y: Math.sin theta
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

## Loops

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

### Infinite Loop

<Playground>
i .= 0
loop
  i++
  break if i > 5
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

## Types

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

<Playground>
type Point =
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

### Assertions

<Playground>
elt as HTMLInputElement
</Playground>

## Misc

### Operators

<Playground>
a and= b
a or= b
a ?= b
obj.key ?= 'civet'
</Playground>

### Chained Comparisons

<Playground>
a < b <= c
a is b is not c
a instanceof b instanceof c
</Playground>

### Rest

Rest properties/parameters/elements are no longer limited to the final position.
You may use them in ther first or middle positions as well.

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

### ESM Import

<Playground>
fs from fs
{basename, dirname} from path
metadata from ./package.json assert type: 'json'
</Playground>

### Dynamic Import

<Playground>
{x} = await import url
</Playground>

### Optional Chaining

<Playground>
obj?[key]
fun?(arg)
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

### Late Assignment

<Playground>
a + b = c
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

## Automatic Variable Declaration

By default, you are responsible for declaring your variables
via `var`, `let`, `const`, or their shorthands. Alternatively,
you can use a `"civet"` directive at the beginning of your file
to specify one of two automatic variable declaration modes.

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

### Boolean Toggles

<Playground>
<Component +draggable -disabled !hidden>
</Playground>

::: tip

`!` is synonymous with `-` and both say "set the attribute value to false".

:::

### Attributes

<Playground>
<div {foo}>Civet
<div {props.name}>Civet
<div {data()}>Civet
<div ...foo>Civet
<div [expr]={value}>Civet
</Playground>

::: tip

Attribute values without whitespace or suitably wrapped (parenthesized expressions, strings and template strings, regular expressions, array literals, braced object literals) do not need braces:

:::

<Playground>
<div
  foo=bar
  count=count()
  sum=x+1
  list=[1, 2, 3]
>
  Civet
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

### CoffeeScript Comments

<Playground>
"civet coffeeComment"
# one-line comment
###
block
comment
###
</Playground>
