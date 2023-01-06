---
title: Cheatsheet
aside: false
---

# {{ $frontmatter.title }}

Civet on the left, compiled TypeScript output on the right.

In most cases, the Civet code on the left is optional shorthand.
The TypeScript code on the right (and most TypeScript code)
is almost always also valid Civet input.

[[toc]]

### Humanize syntax

<Playground>
a is b
a is not b
a or b
a and b
a not in b
</Playground>

<Playground>
item is in array
item is not in array
</Playground>

### Variables

<Playground>
a := 10
b ::= 10
c .= 10
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

### Arrays

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

### Triple-Quoted Strings

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

### Functions

<Playground>
(a: number, b: number) => a + b
</Playground>

<Playground>
add := (a: number, b: number) -> a + b
</Playground>

<Playground>
(degrees: number): {x: number, y: number} =>
  radians := degrees * Math.PI / 180
  x: Math.cos theta
  y: Math.sin theta
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

#### Block Shorthands

<Playground>
x.map &.name
x.map &.profile?.name[0...3]
x.map &.callback a, b
x.map +&
</Playground>

::: info
Short function block syntax like [Ruby symbol to proc](https://ruby-doc.org/core-3.1.2/Symbol.html#method-i-to_proc), [Crystal](https://crystal-lang.org/reference/1.6/syntax_and_semantics/blocks_and_procs.html#short-one-parameter-syntax) or [Elm record access](https://elm-lang.org/docs/records#access)
:::

## Conditions

### If, Else

<Playground>
if coffee or relaxed
  code()
else
  sleep()
</Playground>

### Unless

<Playground>
unless tired
  code()
</Playground>

### Conditional Assignment

<Playground>
civet.speed = 15 if civet.rested
</Playground>

### Switch

<Playground>
switch dir
  when '>' then civet.x++
  when '<' then civet.x--
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

### Infinite loop

<Playground>
i .= 0
loop
  i++
  break if i > 5
</Playground>

### Until loop

<Playground>
i .= 0
until i > 5
  i++
</Playground>

## Classes

### Prototype

<Playground>
X::
X::a
</Playground>

### This

<Playground>
@
id := @id
obj := { @id }
</Playground>

### Static fields

<Playground>
class A
  @a = 'civet'
</Playground>

### Readonly fields

<Playground>
class B
 b := 'civet'
</Playground>

### Class constructor

<Playground>
class Rectangle
  @(@height: number, @width: number)
</Playground>

### Class static block

<Playground>
class Civet
  @
    try
      this.colors = getCivetColors()
</Playground>

### Class extending

<Playground>
class Civet < Animal
</Playground>

## Misc

### Chained comparisons

<Playground>
a < b < c
</Playground>

### Import ESM

<Playground>
x from ./x
</Playground>

### Dynamic import

<Playground>
{x} = await import url
</Playground>

### Flagging ([from LiveScript](https://livescript.net/#literals))

<Playground>
config := { +debug, -live }
</Playground>

### Optional chaining

<Playground>
obj?[key]
fun?(arg)
</Playground>

### Operators

<Playground>
a is b
a and= b
a or= b
a ?= b
obj.key ?= 'civet'
</Playground>

::: code-group

```coffee
a %% b
```

```typescript
const modulo: (a: number, b: number) => number = (a, b) => (a % b + b) % b;

modulo(a, b);
```

:::

### Range literals

<Playground>
a := ['a'..'d']
b := [0..6]
</Playground>

### Array Slicing

<Playground>
numbers := [1, 2, 3, 4, 5, 6]
start := numbers[0..2]
mid := numbers[3..-2]
end := numbers[-2..]
</Playground>

### Late assignment

<Playground>
a + b = c
</Playground>

### Pipelines

<Playground>
data
  |> Object.keys
  |> console.log
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

### Element id

<Playground>
<>
  <div #foo> Civet
  <div #{expression}> Civet
</Playground>

### Class

<Playground>
 <>
  <div .foo> Civet
  <div .foo.bar> Civet
  <div .{expression}> Civet
</Playground>

### Attributes

<Playground>
 <>
  <div {foo}> Civet
  <div ...foo> Civet
  <div [expr]={value}> Civet
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
"civet coffeeEq coffeeIsnt coffeeNot coffeeBinaryExistential coffeeOf"
x == y != z
x isnt y
not (x == y)
x ? y
key of object
</Playground>
