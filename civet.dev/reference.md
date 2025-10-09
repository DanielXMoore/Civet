---
title: Reference
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

### `autoConst`

<Playground>
"civet autoConst"
let sos = 0
for item of iterable
  square = item * item
  sos += square
</Playground>

### Globals

You can prevent [`autoVar`](#autovar), [`autoLet`](#autolet), and
[`autoConst`](#autoconst) from declaring certain variables
by specifying a list of `globals` in the `"civet"` directive:

<Playground>
"civet autoVar globals=cache,version"
cache = {}
version = '1.2.3'
size = 1024
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

Note that array lengths must match exactly because this is a form of
[pattern matching](#pattern-matching).

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

You can check for non-null instead of truthy values with a `?`:

<Playground>
sum .= 0
while number? := next()
  sum += number
</Playground>

The negated form `until` exposes the declaration *after* the block
instead of inside it:

<Playground>
until {status: "OK", data} := attempt()
console.log data
</Playground>

The negated form of `if`, `unless`,
always exposes the declaration to an `else` block (if present).
It also exposes the declaration to after the `unless` block
*provided* the "then" block contains a guaranteed "exit" statement
such as `return` or `throw`.
This is useful for guard checks:

<Playground>
unless item? := getItem() then return
unless {x, y} := item.getCoords()
  throw new Error "Item missing coordinates"
console.log `(${x}, ${y})`
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

### Braced Literals

With braces, the `{x}` shorthand generalizes to any
sequence of member accesses and/or calls and/or unary operators:

<Playground>
another := {person.name, obj?.c?.x}
computed := {foo(), bar()}
named := {lookup[x+y]}
cast := {value as T}
bool := {!!available}
</Playground>

To avoid the trailing `}` in a braced object literal, you can use `{}`
followed by its properties (as if they were arguments
in an [implicit function application](#function-calls)):

<Playground>
obj := {}
  a: 1
  b
  person.name
  method()
    console.log "hi"
</Playground>

### Property Names

Both braced and unbraced literals support shorthand for
computed property names:

<Playground>
negate := {-1: +1, +1: -1}
templated :=
  `${prefix}${suffix}`: result
headers :=
  Content-Type: "text/html"
  Content-Encoding: "gzip"
</Playground>

### Object Globs

Inspired by
[brace expansion in shell globs](https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion):

<Playground>
point = data{x,y}
point = data.{x,y}
point.{x,y} = data
point3D = { point.{x,y}, z: 0 }
complex := obj.{x:a, b.c()?.y}
merged := data.{...global, ...user}
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

You can omit the `.` in `?.` and `!.` property access:

<Playground>
json?data?value
account!name?first
</Playground>

You can also write property access as an English possessive
(inspired by [_hyperscript](https://hyperscript.org/expressions/possessive/)):

<Playground>
mario's brother's name
mario?'s name
json's "long property"'s `${movie} name`
</Playground>

### Length Shorthand

The property access `.#` or just `#` is short for `.length`:

<Playground>
array.#
array#
"a string also".#
</Playground>

On its own, `#` is shorthand for `this.length`:

<Playground>
class List
  push(item)
    @[#] = item
  wrap(index)
    @[index %% #]
</Playground>

`# in` checks for the `"length"` property:

<Playground>
# in x
</Playground>

`#:` defines the `"length"` property in an object literal:

<Playground>
array := {0: 'a', #: 1}
</Playground>

Length shorthand looks and behaves similar to [private fields](#private-fields), with the exception that `.length` is not private.

### Trailing Property Access

A `.` or `?.` property access can trail on another line,
at the same or deeper indentation:

<Playground>
getItems url
.filter .match
.sort()
</Playground>

<Playground>
document
  ?.querySelectorAll pattern
  .forEach (element) =>
    element.style.color = 'purple'
</Playground>

## Arrays

### Bracketed

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

To avoid the trailing `]` in a bracketed array literal, you can use `[]`
followed by its elements (as if they were arguments
in an [implicit function application](#function-calls)):

<Playground>
rotate := []
  c, -s
  s, c
func.apply @, []
  arg1
  arg2
</Playground>

### Bulleted

Instead of brackets, array items can be specified via `.` or `•` bullets:

<Playground>
rotate :=
  . c, -s
  . s, c
</Playground>

<Playground>
func.apply @,
  • arg1
  • arg2
</Playground>

<Playground>
people :=
  . name: "Alice"
    id: 7
  . name: "Bob"
    id: 9
</Playground>

You can nest bulleted arrays, and list multiple items per line via `,`:

<Playground>
colorPairs :=
  . . "red"
    . "#f00"
  . . "green"
    . "#0f0"
  . . "blue", "#00f"
</Playground>

:::info
Bulleted arrays generally need to start on their own line with an indentation.
The only current exception is for nested bulleted arrays.
:::

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

`[x..y]` includes `x` and `y`, while `[x...y]` includes `x` but not `y`
(as in Ruby and CoffeeScript).

<Playground>
letters := ['a'..'f']
numbers := [1..10]
indices := [0...array.length]
</Playground>

An infinite range `[x..]` is supported when [looping](#range-loop).

Alternatively, `..` can exclude an endpoint with `<`,
or explicitly include an endpoint with `<=` (or `≤`):

<Playground>
indices := [0..<array.length]
strict := [a<..<b]
// [a<=..≤b] same as [a..b]
</Playground>

You can construct a reverse (decreasing) range by specifying `>` (exclusive)
or `>=` (inclusive) on at least one endpoint:

<Playground>
reversed := [10..>=1]
reversedIndices := [array.length>..0]
</Playground>

If you'd rather `[a..b]` and `[a...b]` construct an increasing or decreasing
range depending on whether `a < b` or `a > b` (unless you specify an explicit
direction via `<`/`>`/`<=`/`>=`), use the
[`"civet coffeeRange"` directive](#coffeescript-ranges).

### Array/String Slicing

`[i..j]` includes `i` and `j`, while `[i...j]` includes `i` but not `j`.
`i` and/or `j` can be omitted when slicing.

<Playground>
start := numbers[..2]
mid := numbers[3...-2]
end := numbers[-2..]
numbers[1...-1] = []
</Playground>

Alternatively, you can exclude or include endpoints using `..` with `<` or `<=`:

<Playground>
strict := numbers[first<..<last]
</Playground>

Slices are increasing by default, but you can reverse them with `>` or `>=`:

<Playground>
reversed := x[..>=]
</Playground>

If you just want to specify one endpoint of an increasing slice,
you can avoid `..` altogether:

<Playground>
[left, right] = [x[<=i], x[>i]]
[left, right] = [x[<i], x[>=i]]
</Playground>

### Modulo Indexing

You can use `a[i%]` to index into an array modulo its length:

<Playground>
for i of [0...a#]
  drawAngle v[i-1%], v[i], v[i+1%]
</Playground>

See also [length shorthand](#length-shorthand).

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
    Civet
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

## Regular Expressions

Civet supports JavaScript regular expression literals `/.../`, provided the
first slash is not immediately followed by a space.  Instead of `/ x /`
(which can be interpreted as division in some contexts),
write `/\ x /` or `/[ ]x /` (or more escaped forms like `/[ ]x[ ]/`).

In addition, you can use `///...///` to write multi-line regular expressions
that ignore top-level whitespace and single-line comments, and interpolates
`${expression}` like in template literals:

<Playground>
phoneNumber := ///
  ^
  \+? ( \d [\d-. ]+ )?  // country code
  ( \( [\d-. ]+ \) )?   // area code
  (?=\d) [\d-. ]+ \d    // start and end with digit
  $
///
</Playground>

<Playground>
r := /// ${prefix} \s+ ${suffix} ///
</Playground>

:::info
`///` is treated as a comment if it appears at the top of your file,
to support [TypeScript triple-slash directives](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html).
Keep this in mind when trying examples in the Playground.
:::

## Symbols

`:symbol` represents either a well-known symbol (static member of `Symbol`)
or a consistently generated symbol in the global symbol registry via
[`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for):

<Playground>
magicSymbol := :magic
iterable = {
  :iterator()
    yield 1
    yield 2
    yield 3
  :isConcatSpreadable: true
}
iterable.:iterator()
</Playground>

In case you're building for a special environment, you can set the list of
well-known symbols via a compiler directive:

<Playground>
"civet symbols=magic"
magicSymbol := :magic
iteratorSymbol := :iterator
</Playground>

Symbol names that aren't valid identifiers can be wrapped in quotes:

<Playground>
magicSymbol := :"magic-symbol"
</Playground>

## Operators

### All JavaScript/TypeScript Operators

<Playground>
center := min + length / 2
name := user?.name ?? defaultName
typeof x === "string" && x += "!"
result! as string | number
</Playground>

:::info
Civet is a bit sensitive when it comes to
[spacing around operators](comparison#operator-spacing).
Unary symbol operators (`+`, `-`, `~`, `!`) must not have spaces after them.
Binary symbol operators should either have spaces on both sides,
or no space on either side.
:::

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

### Multi Destructuring

Use `name^pattern` to assign `name` while also destructuring into `pattern`:

<Playground>
[first^{x, y}, ...rest] = points
</Playground>

Shorthand for destructuring an object property and its contents:

<Playground>
{name^: {first, last}} = person
</Playground>

::: info
Multi destructuring also works in
[declarations](#variable-declaration),
[function parameters](#parameter-multi-destructuring),
[`for` loops](#for-loop-multi-destructuring), and
[pattern matching](#pattern-matching).
:::

### Humanized Operators

<Playground>
a is b
a is not b
a and b
a or b
a not in b
a not instanceof b
a !in b
a !instanceof b
a?
</Playground>

### Includes Operator

<Playground>
item is in array
item is not in array
substring is in string
item1 ∈ container ∌ item2  // Unicode
</Playground>

### Concat Operator

<Playground>
a ++ b ++ c
[1,2,3] ⧺ rest
</Playground>

You can use `++` to concatenate arrays or strings,
or your own types by providing a `concat` method.
Remember that
[`Array.prototype.concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
appends a single item unless it is an array
(or has the [`Symbol.isConcatSpreadable` property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/isConcatSpreadable)),
in which case it flattens it into the target array.
(The right-hand side also needs to offer the array-like interface:
`length` and indexed access.)
Civet's assignment operator behaves the same:

<Playground>
a ++= b
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
obj?prop
obj?[key]
fun?(arg)
</Playground>

### Optional Chain Assignment

<Playground>
obj?prop = value
obj?[key] = value
fun?(arg).prop = value
fun?(arg)?prop?[key] = value
</Playground>

### Existence Checking

<Playground>
x?
x.y[z]?
not x?
x? + y?
</Playground>

### Chained Comparisons

<Playground>
a < b <= c
a ≤ b ≤ c  // Unicode
a ≡ b ≣ c ≠ d ≢ e
a is b is not c
0 <= a? < n
a instanceof b not instanceof c
x? instanceof Function
</Playground>

### Prefix Operators

Complex nested conditions can be written prefix-style by wrapping the
binary operators in parentheses:

<Playground>
function haveAccess(doc, user)
  (and)
    user?
    (or)
      user.super, doc.worldReadable
      user.name is doc.owner
      (and)
        doc.groupReadable
        user.group is doc.group
</Playground>

This is a special case of
[binary operators as functions](#binary-operators-as-functions)
followed by immediate [function calls](#function-calls).
In this special case, the operator can be given multiple arguments,
and the operators
[short circuit](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators#short-circuit_evaluation)
as usual.

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
a !instanceof "number"
</Playground>

### Logical XOR Operator

<Playground raw>
a ^^ b
a xor b
a ^^= b
a xor= b
</Playground>

<Playground raw>
a !^ b
a xnor b
a !^= b
a xnor= b
</Playground>

### Integer Division and Modulo Operator

`%/` or `÷` is integer division (like `//` in some languages).

<Playground>
let a = -3
let b = 5
let frac = a / b // -0.6
let div = a %/ b // -1
console.log frac, div
</Playground>

`%` can return negative values, while `%%` is always between 0 and the divisor.

<Playground>
let a = -3
let b = 5
let rem = a % b // -3
let mod = a %% b // 2
console.log rem, mod
</Playground>

Together, these operators implement the
[division theorem](https://proofwiki.org/wiki/Division_Theorem):

<Playground>
let a = -3
let b = 5
console.assert a === (a %/ b) * b + a %% b
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
[single-argument function shorthand](#single-argument-function-shorthand)
and [binary operator sections](#binary-operator-sections):

<Playground>
x.length |> & + 1 |> .toString()
</Playground>

<Playground>
x.length |> (+ 1) |> .toString()
</Playground>

Build functions by starting with `&`:

<Playground>
& |> .toString |> console.log
</Playground>

<Playground>
&: number |> (+ 1) |> (* 2) |> Math.round
</Playground>

Use `as T` to cast types in your pipeline:

<Playground>
data |> JSON.parse |> as MyRecord |> addRecord
</Playground>

Use `await`, `throw`, `yield`, `yield*`, or `return` in your pipeline:

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

<Playground>
document.createElement('div')
||> .className = 'civet'
||> .appendChild document.createTextNode 'Civet'
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

Both `await` and `await` operators support an indented application form.
Multiple arguments automatically get bundled into an array:

<Playground>
// Sequential
await
  first()
  second()
// Parallel
await.all
  first()
  second()
</Playground>

Alternatively, you can use array literals:

<Playground>
// Sequential
await [ first(), second() ]
await
  . first()
  . second()
// Parallel
await.all [ first(), second() ]
await.all
  . first()
  . second()
</Playground>

### Custom Infix Operators

You can also define your own infix operators;
see [Functions as Infix Operators](#functions-as-infix-operators) below.

### Unicode Operators

Many operators have Unicode equivalents.
Here is a table of all currently supported:

<div class="unicode-table">

| Unicode | ASCII | Unicode | ASCII | Unicode | ASCII | Unicode | ASCII |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| `≤` | `<=` | `≥` | `>=` | `≠` | `!=` | `≡` | `==` |
| `≣` | `===` | `≢` | `!==` | `≔` | `:=` | `⁇` | `??` |
| `‖` | `\|\|` | `≪` | `<<` | `≫` | `>>` | `⋙` | `>>>` |
| `…` | `...` | `‥` | `..` | `∈` | `is in` | `∉` | `is not in` |
| `▷` | `\|>` | `→` | `->` | `⇒` | `=>` | `’s` | `'s` |
| `⧺` | `++` | `—` | `--` | `÷` | `%/` | `•` | `.` bullet |

</div>

## Functions

### Function Calls

The parentheses in a function call are usually optional.
If present, there should be no space between the function and the open paren.

<Playground>
console.log x, f(x), (f g x), g f x
</Playground>

Implicit function application also works via indentation,
where commas before newlines are optional.

<Playground>
console.log
  "Hello"
  name
  "!"
  JSON.stringify
    id: getId()
    date: new Date
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
adding a final semicolon or explicit `return`, or globally using
[the directive `"civet -implicitReturns"`](#no-implicit-returns).
Generators also don't implicitly `return`
(use explicit `return` to return a special final value).
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

<Playground>
function count()
  yield 1
  yield 2
  yield 3
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

### Pin Parameters and This Parameters

You can directly assign an argument to an outer variable `foo` by writing
`^foo` (see pins from [pattern matching](#pattern-matching)):

<Playground>
let resolve, reject
promise := new Promise (^resolve, ^reject) =>
</Playground>

Similarly, you can directly assign an argument to `this.foo` by writing `@foo`
(see [`@` shorthand for `this`](#at)).
This is particularly useful within methods.

<Playground>
@promise := new Promise (@resolve, @reject) =>
</Playground>

### Parameter Multi Destructuring

[Multi destructuring](#multi-destructuring) applies to function parameters:

<Playground>
function Component(props^{
  name^: {first, last},
  counter
})
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

### Single-Argument Function Shorthand (`&`)

`&` acts as a placeholder for the argument of a single-argument function,
with the function wrapper lifted to just inside the nearest function call,
assignment, pipeline, `return`, or `yield`.

<Playground>
x.map &.name
x.map &.profile?.name[0...3]
x.map &.callback a, b
x.map +&
x.map typeof &
x.forEach delete &.old
await.allSettled x.map await &.json()
x.map [&, true]
x.map [&, &.toUpperCase()]
x.map name: &
x.filter &
x.filter 0 <= & < n
x.map (& + 1) % n
capitalize := &[0].toUpperCase() +
              &[1..].toLowerCase()
</Playground>

::: info
Short function block syntax originally inspired by
[Ruby symbol to proc](https://ruby-doc.org/core-3.1.2/Symbol.html#method-i-to_proc),
[Crystal](https://crystal-lang.org/reference/1.6/syntax_and_semantics/blocks_and_procs.html#short-one-parameter-syntax),
or [Elm record access](https://elm-lang.org/docs/records#access).
:::

You can also omit `&` when starting with a `.` or `?.` property access:

<Playground>
x.map .name
x.map ?.profile?.name[0...3]
x.map `${.firstName} ${.lastName}`
</Playground>

You can also assign properties:

<Playground>
x.map .name = "Civet" + i++
</Playground>

You can also type the argument (but if you use type operators,
the type needs to be wrapped in parentheses):

<Playground>
increment := &: number + 1
show := &: ??? |> JSON.stringify |> console.log
identity := &?: (number | string)
</Playground>

::: info
Note that `&` is the identity function while `(&)` is a
[bitwise AND function](#binary-operators-as-functions).
Prior to Civet 0.7.0, `(&)` was the identity function and `&` was invalid.
:::

### Partial Function Application

Another shorthand for one-argument functions is to call a function
with a `.` placeholder argument:

<Playground>
console.log "result:", .
</Playground>

More generally, if you use `.` within a function call, that call gets wrapped
in a one-argument function and `.` gets replaced by that argument.
The wrapper also lifts above unary operations (including `await`) and `throw`.
You can use `.` multiple times in the same function:

<Playground>
compute ., . + 1, . * 2, (.).toString()
</Playground>

A key difference between `&` and `.` is that `.` lifts beyond a function call
(and requires one), while `&` does not:

<Playground>
f a, &
f a, .
</Playground>

### Binary Operators as Functions

Wrapping a binary operator in parentheses turns it into a two-argument function:

<Playground>
numbers.reduce (+)
booleans.reduce (||), false
masks.reduce (&), 0xfff
</Playground>

### Binary Operator Sections

Like [Haskell](https://wiki.haskell.org/Section_of_an_infix_operator),
you can specify one of the arguments in a
[parenthesized binary operator](#binary-operators-as-functions)
to make a one-argument function instead:

<Playground>
counts.map (1+)
.map (2*)
.map (**2)
</Playground>

Note that `+` and `-` get treated as unary operators first.
Add a space after them to make them binary operator sections.

<Playground>
(+x)
(+ x)
</Playground>

The provided left- or right-hand side can include more binary operators:

<Playground>
counts.map (* 2 + 1)
</Playground>

You can also build functions using assignment operators on the right:

<Playground>
new Promise (resolve =)
callback := (sum +=)
</Playground>

You can also make sections from
the [pattern matching operator `is like`](#pattern-matching):

<Playground>
array.filter (is like {type, children})
</Playground>

### Functions as Infix Operators

You can "bless" an existing function to behave as an infix operator
(and a negated form) like so:

<Playground>
operator contains
x contains y
x not contains y
x !contains y
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

<Playground>
import operator { plus, minus } from ops
a plus b minus c
</Playground>

By default, custom infix operators have a precedence between relational and
arithmetic operators, and are left-associative:

<Playground>
operator foo
a < b + c foo d * e foo f
</Playground>

You can specify a custom precedence with `looser`/`tighter`/`same`
followed by another operator (with symbols wrapped in parentheses).
This specification goes after the operator name or before a declaration.

<Playground>
operator dot looser (*) (p, q)
  p.x * q.x + p.y * q.y
operator looser dot DOT := dot
a + b * c dot d * e DOT f * g dot h * i + j
</Playground>

<Playground>
operator { plus same (+), times same (*) }
  from ops
a times b plus c times d
</Playground>

You can specify a custom associativity with
`left`/`right`/`non`/`relational`/`arguments`:

<Playground>
operator x left  // left is default
a x b x c
operator y right
a y b y c
operator z non
a z b
// a z b z c is an error
operator cmp relational
a < b cmp c instanceof d
operator combine arguments
a combine b combine c
</Playground>

You can specify both precedence and associativity together in either order:

<Playground>
operator mult arguments tighter (+)
a mult b mult c + d mult e mult f
</Playground>

Instead of declaring `operator`s in multiple files, you can declare global
`operator`s (with custom precedence and associativity) in a project
[configuration file](config#global-configuration-via-config-files).
Within a Civet source file, you can redeclare with `operator` to override
the precedence and/or associativity (but the default behavior is that
specified in the configuration file).

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

The condition can also be indented:

<Playground>
if
  (or)
    coffee
    relaxed
  code()
else
  sleep()
</Playground>

### If/Then/Else

For complex conditions that involve indented function application,
you can add an explicit `then`:

<Playground>
if (or)
  coffee
  relaxed
then
  code()
else
  sleep()
</Playground>

### One-Line If/Then/Else

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

For complex conditions that involve indented function application,
the condition can be indented:

<Playground>
sleep() unless
  (or)
    coffee
    relaxed
</Playground>

### Switch

`switch` can be used in three different forms:
[`case`](#case), [`when`](#when), and [pattern matching](#pattern-matching).
You can mix `case` and `when`, but not the other types.

### Case

Similar to JavaScript, but with optional punctuation and
multiple matches in one line:

<Playground>
switch dir
  case 'N'
  case 'S'
    console.log 'vertical'
    break
  case 'E', 'W'
    console.log 'horizontal'
  default
    console.log 'horizontal or unknown'
</Playground>

### When

`when` is a nicer version of `case`, with an automatic `break` at the end
(cancelable with `continue switch`)
and a braced block to keep variable declarations local to the branch:

<Playground>
switch dir
  when 'N', 'S'
    console.log 'vertical'
  when 'E', 'W'
    console.log 'horizontal'
    continue switch
  else
    console.log 'horizontal or unknown'
</Playground>

An example with implicit `return` and same-line values using `then`:

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
  /^\s+$/
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
  [{type: "text", content: /^\s+$/}, ...rest]
    console.log "leading whitespace"
  [{type: "text", content}, ...rest]
    console.log "leading text:", content
  [{type}, ...rest]
    console.log "leading type:", type
</Playground>

You can also use condition fragments as patterns:

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

You can add a binding before a condition fragment:

<Playground>
switch f()
  x % 15 is 0
    console.log "fizzbuzz", x
  x % 3 is 0
    console.log "fizz", x
  x % 5 is 0
    console.log "buzz", x
</Playground>

Aliasing object properties works the same as destructuring:

<Playground>
switch e
  {type, key: eventKey}
    return [type, eventKey]
</Playground>

Patterns can aggregate duplicate bindings:

<Playground>
switch x
  [{type}, {type}]
    type
</Playground>

Object properties with value matchers (other than a renaming identifier)
are not bound by default (similar to
[object destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)).
Add a trailing `^` to bind them:

<Playground>
switch x
  {type^: /list/, content^: [first, ...]}
    console.log type, content, first
</Playground>

More generally, use `name^pattern` or `name^ pattern`
([multi destructuring](#multi-destructuring))
to bind `name` while also matching `pattern`:

<Playground>
switch x
  [space^ /^\s*$/, number^ /^\d+$/, ...]
    console.log space, number
</Playground>

Use `^x` to refer to variable `x` in the parent scope,
as opposed to a generic name that gets destructured.
(This is called "pinning" in
[Elixir](https://hexdocs.pm/elixir/1.16/pattern-matching.html#the-pin-operator)
and [Erlang](https://www.erlang.org/eeps/eep-0055).)

<Playground>
switch x
  ^y
    console.log "y"
  [^y]
    console.log "array with y"
  [y]
    console.log "array with", y
  ^getSpecial()
    console.log "special"
</Playground>

You can also write general expressions after `^`.
Member expressions like `enum` values do not need `^`:

<Playground>
function directionVector(dir: Direction)
  switch dir
    Direction.Left
      [-1, 0]
    Direction.Right
      [+1, 0]
    Direction.Down
      [0, -1]
    ^Direction.Up
      [0, +1]
</Playground>

If you just want to match a value against a single pattern, you can use a
[declaration in a condition](#declarations-in-conditions-and-loops):

<Playground>
if [{type, content}, ...rest] := x
  console.log "leading content", content
</Playground>

If you just want to check *whether* a value matches a single pattern,
you can use the `is like` or `is not like` operator:

<Playground>
if x is like [{type, content: /^\s+$/}, ...]
  console.log "leading whitespace"
</Playground>

In particular, this gives a nice shorthand for `RegExp.prototype.test`:

<Playground>
isInt := x is like /^[+-]?\d+$/
exists := x? is not like /^\s*$/
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

<Playground>
for var item of list
  console.log item
console.log "Last item:", item
</Playground>

You can also keep track of the current index of the iteration
by specifying a comma and a second variable (also defaulting to `const`):

<Playground>
for item, index of list
  console.log `${index}th item is ${item}`
</Playground>

You can add types to the declarations (unlike TypeScript):

<Playground>
for var item: Item? of list
  console.log item
if item?
  console.log "Last item:", item
else
  console.log "No items"
</Playground>

### for each..of

For `Array`s and other objects implementing `.length` and `[i]` indexing,
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

You can add types to the declarations (unlike TypeScript):

<Playground>
for key: keyof typeof object, value in object
  process key, value
</Playground>

### Loop Expressions

If needed, loops automatically assemble an array of the last value
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
When not at the top level, loop expressions wrap in an
[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE),
so you cannot use `return` inside such a loop,
nor can you `break` or `continue` any outer loop.
:::

You can also accumulate multiple items and/or spreads:

<Playground>
function flatJoin<T>(list: T[][], sep: T): T[]
  for sublist, i of list
    if i
      sep, ...sublist
    else
      ...sublist
</Playground>

<Playground>
flatImage :=
  for x of [0...nx]
    ...for y of [0...ny]
      image.get x, y
</Playground>

If you don't specify a body, `for` loops list the item being iterated over:

<Playground>
array := for item of iterable
coordinates := for {x, y} of objects
keys := for key in object
</Playground>

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

### Generator Expressions

All loops have a starred form that makes a generator function,
yielding items one at a time instead of building the entire array at once:

<Playground>
numbers := for* n of [0..]
squares := for* n of numbers
  n * n
</Playground>

As statements in a function, the starred forms `yield` directly,
allowing you to do multiple such loops in the same function:

<Playground>
function mapConcatIter(f, a, b)
  for* item of a
    f item
  for* item of b
    f item
</Playground>

### Postfix Loop

<Playground>
console.log item for item of array
</Playground>

### When Condition

`for` loops can have a `when` condition to filter iterations.
This makes for a nice one-line form to filter and map an array
(similar to [Python list comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)):

<Playground>
squared := v * v for v of list when v?
// or
squared := for v of list when v? then v * v
</Playground>

If you don't specify a loop body, you get a filter:

<Playground>
evens := for v of list when v % 2 === 0
</Playground>

To make a generator instead of an array, use
[`for*`](#generator-expressions) instead of `for`.

### Reductions

Instead of accumulating the results in an array, `for` loops can combine
the body values according to one of the following reductions.

`for some` returns whether any body value is truthy,
shortcutting once one is found (like
[`Array.prototype.some`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)).
If there is no body, any iteration counts as truthy,
so it measures whether the iteration is nonempty.

<Playground>
anyEven := for some item of array
  item % 2 === 0
nonEmpty := for some key in object
</Playground>

`for every` returns whether every body value is truthy,
shortcutting if a falsey value is found (like
[`Array.prototype.every`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)).
If there is no body, any iteration counts as falsey,
so it measures whether the iteration is empty.

<Playground>
allEven := for every item of array
  item % 2 === 0
</Playground>

<Playground>
emptyOwn := for every own key in object
</Playground>

`for count` counts how many body values are truthy.
If there is no body, any iteration counts as truthy.

<Playground>
numEven := for count item of array
  item % 2 === 0
numKeys := for count key in object
</Playground>

`for first` returns the first body value.
If there is no body, it uses the item being looped over.
Combined with a `when` condition, this can act like
[`Array.prototype.find`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find).

<Playground>
firstEven :=
  for first item of array when item % 2 === 0
firstEvenSquare :=
  for first item of array when item % 2 === 0
    item * item
</Playground>

`for sum` adds up the body values with `+`, starting from `0`.
If there is no body, it adds the item being looped over.

<Playground>
sumOfSquares := for sum item of array
  item * item
sum := for sum item of array
</Playground>

`for product` multiples the body values with `*`.
If there is no body, it multiplies the item being looped over.

<Playground>
prod := for product item of array
nonZeroProd := for product item of array when item
</Playground>

`for min/max` finds the minimum/maximum body value,
or `+Infinity`/`-Infinity` if there are none.
If there is no body, it uses the item being looped over.

<Playground>
min := for min item of array
max := for max item of array
</Playground>

`for join` concatenates the body values as strings, using `+`.
It's like `for sum` but starting from `""` instead of `0`.

<Playground>
all := for join item of array
  `[${item.type}] ${item.title}\n`
</Playground>

`for concat` concatenates the body values as arrays,
using the [concat operator `++`](#concat-operator).
If there is no body, it uses the item being looped over.

<Playground>
function flat1<T>(arrays: T[][]): T[]
  for concat array of arrays
</Playground>

Implicit bodies in `for sum/product/min/max/join/concat` reductions
can use a single destructuring:

<Playground>
xMin := for min {x} of points
</Playground>

<Playground>
xMin := for min [x] of points
yMin := for min [, y] of points
</Playground>

### Object Comprehensions

Loops can also accumulate their body values into an object.
When a loop is inside a [braced object literal](#braced-literals),
its body value is spread into the containing object.

<Playground>
object  := {a: 1, b: 2, c: 3}
doubled := {
  for key in object
    [key]: 2 * object[key]
}
</Playground>

<Playground>
i .= 1
squares := {
  do
    [i]: i * i
  while i++ < 10
}
</Playground>

Loops can be freely mixed with other object properties.

<Playground>
rateLimits := {
  admin: Infinity
  for user of users
    [user.name]: getRemainingLimit(user)
}
</Playground>

### For Loop Multi Destructuring

[Multi destructuring](#multi-destructuring) applies to `for..of/in` loops:

<Playground>
for item^[key, value] of map
  if value and key.startsWith "a"
    process item
</Playground>

<Playground>
for person^{name^: {first, last}, age} of people
  console.log first, last, age, person
</Playground>

<Playground>
for key, value^{x, y} in items
  if x > y
    process key, value
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
for i of [0...n] by 2
  console.log i, "is even"
</Playground>

<Playground>
for [1..5]
  attempt()
</Playground>

<Playground>
for i of [1..]
  attempt i
</Playground>

You can control loop direction and include or exclude endpoints using
`..` with `<=`/`>=` or `<`/`>`:

<Playground>
for i of [first..<=last]
  console.log array[i]
</Playground>

<Playground>
for i of [left<..<right]
  console.log array[i]
</Playground>

See also [range literals](#range-literals).

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
literals.  The colons are optional in `break` and `continue`,
except for Civet reserved words (e.g. `and`) where a colon is required.
JavaScript reserved words are invalid as labels.
:::

Iterations also get implicit labels if you refer to them by type,
via `break/continue for/while/until/loop/do`:

<Playground>
loop
  while list = next()
    for item of list
      if item is 'skip'
        continue for
      else if item is 'next'
        continue while
      else if item is 'done'
        break loop
</Playground>

### Controlling Loop Value

<Playground>
function varVector(items, mean)
  for item of items
    continue with 0 unless item?
    item -= mean
    item * item
</Playground>

<Playground>
found :=
  loop
    item := nextItem()
    break with item if item.found
    process item
</Playground>

<Playground>
function process(lists)
  :outer for list of lists
    for item of list
      if item is "abort"
        break outer with item
      if item is "length"
        continue :outer with list.length
</Playground>

## Other Blocks

### Try Blocks

Like JavaScript, `try` blocks can have `catch` and/or `finally` blocks:

<Playground>
try
  compute()
catch e
  console.error e
finally
  cleanup()
</Playground>

Unlike JavaScript, you can omit both `catch` and `finally` for a default
behavior of "ignore all exceptions":

<Playground>
try
  compute()
</Playground>

In addition, you can add an `else` block between (optional) `catch` and
(optional) `finally`, which executes whenever the `catch` block does not:

<Playground>
try
  result = compute()
catch e
  callback "error", e
else
  // exceptions here will not trigger catch block
  callback result
</Playground>

You can also specify multiple `catch` blocks using
[pattern matching](#pattern-matching):

<Playground>
try
  foo()
catch e <? MyError
  console.log "MyError", e.data
catch <? RangeError, <? ReferenceError
  console.log "R...Error"
catch e^{message^: /bad/}
  console.log "bad", message
  throw e
catch e
  console.log "other", e
</Playground>

If you omit a catch-all at the end,
the default behavior is to re-`throw` the error:

<Playground>
try
  foo()
catch {message: /^EPIPE:/}
</Playground>

Finally, you can specify a `finally` block without a `try` block,
and it automatically wraps the rest of the block (similar to
`defer` in
[Zig](https://ziglang.org/documentation/master/#defer) and
[Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/statements/#Defer-Statement)):

<Playground>
depth .= 0
function recurse(node)
  depth++
  finally depth--
  console.log depth, "entering", node
  finally console.log depth, "exiting", node
  return unless node?
  recurse child for child of node
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
When not at the top level, `do` expressions wrap in an
[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE),
so you cannot use `return`, `break`, or `continue` within them.
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

### Generator Do Blocks

You can create a generator using `yield` notation with `do*`:

<Playground>
neighbors := do*
  yield [x-1, y]
  yield [x+1, y]
  yield [x, y-1]
  yield [x, y+1]
</Playground>

### Comptime Blocks

`comptime` blocks are similar to [`do` blocks](#do-blocks), but they execute
*at Civet compilation time*.  The result of executing the block gets
embedded into the output JavaScript code.

<Playground comptime>
value := comptime 1+2+3
</Playground>

<Playground comptime>
console.log "3rd triangular number is", comptime
  function triangle(n) do n and n + triangle n-1
  triangle 3
</Playground>

Note that `comptime` blocks are executed as separate scripts
(separate NodeJS contexts, or top-level `eval` on the browser),
so they have no access to variables in outer scopes.
You can use `require` to load other modules (or `import` on
very recent NodeJS versions, but this generates a warning).
The block can be async e.g. via use of `await`,
and the resulting `Promise` will be awaited during compilation.
For serialization into JavaScript code,
the result must consist of built-in JavaScript types,
including numbers, `BigInt`, strings, `Buffer`, `URL`, `RegExp`, `Date`,
`Array`, `TypedArray`, `Set`, `Map`, objects (including getters, setters,
property descriptors, `Object.create(null)`, `Object.preventExtensions`,
`Object.freeze`, `Object.seal`, but no prototypes),
non-built-in functions, classes, and symbols that are properties of `Symbol`.
Functions cannot refer to variables/functions in an
outer scope other than global.
And there cannot be reference loops.
Some of these restrictions may be lifted in the future.

::: info
Inspired by Rust crates
[comptime](https://crates.io/crates/comptime) and
[constime](https://crates.io/crates/constime),
which are a simplified version of
[Zig's comptime](https://ziglang.org/documentation/master/#comptime);
and other similar compile-time features (sometimes called "macros")
such as [C++'s constexpr](https://en.cppreference.com/w/cpp/language/constexpr).
:::

Because `comptime` enables execution of arbitrary code during compilation, it
is not enabled by default, nor can it be enabled via a directive or config file.
In particular, the VSCode language server will not execute `comptime` blocks.
You can enable `comptime` evaluation in the CLI using `civet --comptime`,
and in the
[unplugin](https://github.com/DanielXMoore/Civet/tree/main/source/unplugin)
using the `comptime: true` option.
If not enabled, `comptime` blocks will execute at runtime.

<Playground>
// comptime is disabled here
value := comptime 1+2+3
</Playground>

Async `comptime` blocks executed at runtime are not `await`ed (to avoid forcing
`async`), so they return a `Promise`, unlike when they're run at compile time.
In cases like this, you can provide a fallback for when `comptime` is disabled:

<Playground>
html := comptime
  fetch 'https://civet.dev' |> await |> .text()
else // fallback for disabled comptime
  '<html></html>'
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

<Playground>
class Person
  getName()
    @name
  setName(@name)
</Playground>

### Bind

Shorthand for [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)ing methods to their object:

<Playground>
bound := object@.method
bound := object@method
bound := @@method
</Playground>

You can specify arguments to prepend via an immediate
[function call](#function-calls):

<Playground>
message := console@log "[MSG] "
</Playground>

### Private Fields

[Private class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields)
do not need an explicit `this.` or `@` prefix.
When accessing a private field of another object,
you can rewrite `#` in place of `.#`.

<Playground>
class Counter
  #count = 0
  increment(): void
    #count++
  add(other: Counter): void
    #count += other#count if #count in other
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

### Getters and Setters

<Playground>
class C
  get x
    @coords?.x ?? 0
  set x(newX)
    @moveTo newX, @coords.y
</Playground>

Shorthand for boilerplate getters and setters that delegate
(with optional code blocks to run first):

<Playground>
class C
  get #secret
  set #secret
  get @coords.{x,y}
    return 0 unless @coords?
  set @coords.{x,y}
    @coords ?= {}
</Playground>

<Playground>
function makeCounter
  count .= 0
  {
    get count
    set count
    increment()
      ++count
  }
</Playground>

### Constructor

`@` is also shorthand for `constructor`.
`@arg` arguments create typed fields if the fields are not already declared.

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

Long `implements` lists can be indented:

<Playground>
class Civet
  extends Animal
  implements
    Named
    Record string, number
</Playground>

### Mixins

Civet experimentally defines a "mixin" to be a function mapping a class to
a class (e.g., returning a subclass with added functionality),
and provides `with` syntax for applying one or more mixins to the base class
you're extending:

<Playground>
function Movable(C)
  class extends C
    move(@x, @y)
class Civet extends Animal with Movable
  @()
    @move 0, 0
</Playground>

Mixins get applied left to right.
The extended class defaults to `Object`.

<Playground>
class Civet with Mixin1, Mixin2
</Playground>

Long mixin lists can be indented:

<Playground>
class Civet
  extends Animal
  with
    Mixin1 arg
    Mixin2
</Playground>

### Decorators

Civet uses [`@` for `this`](#this), so decorators need to use `@@`:

<Playground>
@@Object.seal
class Civet
  @name = "Civet"
</Playground>

## Types

### Optional Types

Similar to function parameters and object properties,
`let` declarations and function return values
can be declared optional to allow `undefined`:

<Playground>
let i?: number
i?: number .= undefined
(x?: string)?: string => x
function f(x?: string)?: string
  x
</Playground>

More generally, type `T?` allows for `undefined` and
`T??` additionally allows for `null`:

<Playground>
let i: number?
let x: string??
</Playground>

To allow for type inference and the initial `undefined` value:

<Playground>
let x?
</Playground>

To allow for later assignment of `undefined` while specifying an initial value
(currently limited to a literal or member expression):

<Playground>
let x? = 5
let y? = x
</Playground>

### Non-Null Types

`T!` removes `undefined` and `null` from the type:

<Playground>
let x: unknown!
</Playground>

### Destructured Typing

Destructured declarations or function arguments can be typed inline using `::`:

<Playground>
function Component({
  name: [
    first:: string
    last:: string
    ...rest:: string[]
  ]
  counter:: number
  setCounter: sc:: (number) => void
  ...otherProps:: ChildProps
})
</Playground>

<Playground>
{
  type:: string
  verb:: "hello" | "goodbye"
} := input
</Playground>

### Unknown

`???` is shorthand for the type `unknown`.

<Playground>
declare function jsonParse(json: string): ???
</Playground>

### Signed Number Literals

`+1` is invalid in TypeScript but valid in Civet.

<Playground>
declare function sign(n: number): -1 | 0 | +1
</Playground>

### Function Types

Like [arrow functions](#arrow-functions),
arrow types can use `=>` or `->` (with equivalent meanings)
and can omit parameters and/or return type:

<Playground>
function f(callback: ->)
  callback()
</Playground>

Arrow types can use an `async` prefix as shorthand for `Promise`
return types:

<Playground>
function f(callback: async =>)
  callback()
</Playground>

Similarly, `async` functions (except generators) get their return type
automatically wrapped in `Promise`:

<Playground>
function f(): number
  await fetch 'https://civet.dev'
  .status
</Playground>

::: info
You can still include explicit `Promise` wrappers in your return types.
The `AutoPromise` helper avoids adding an extra `Promise` wrapper.
:::

### Conditional Types

TypeScript's ternary types can be written using `if`/`unless` expressions,
with optional `else` blocks:

<Playground>
let verb:
  if Civet extends Animal
    if Civet extends Cat then "meow"
  else
    string
let breed: unless Civet extends Animal
  then undefined else string
</Playground>

You can also use [`<` as shorthand for `extends`](#extends),
and the negated forms `not extends` and `!<`:

<Playground>
let verb: Civet < Cat ? "meow" : string
let breed: Civet !< Animal ? undefined : string
</Playground>

You can also use [postfix `if`/`unless`](#postfix-ifunless)
if the `else` case is `never`:

<Playground>
let breed: string if Civet extends Animal
</Playground>

### Import

<Playground>
type { Civet, Cat } from animals
</Playground>

<Playground>
{ type Civet, meow } from animals
</Playground>

### CommonJS Import/Export

<Playground>
import fs = require 'fs'
export = fs.readFileSync 'example'
</Playground>

### Aliases

`::=` is shorthand for type aliases:

<Playground>
ID ::= number | string
Point ::= x: number, y: number
type ID = number | string
type Point = x: number, y: number
</Playground>

Alternatively, you can use `type` without an `=`,
if the right-hand side is indented (similar to an `interface`):

<Playground>
type ID
  | number
  | string
type Point
  x: number
  y: number
</Playground>

### Tuples

Tuple type elements can be named, preventing implicit object literals:

<Playground>
type Point = [number, number]
type Point = [x: number, y: number]
type PointContainer = [(x: number, y: number)]
</Playground>

Tuples can also be specified via [bullets](#bulleted):

<Playground>
type Point =
  . x: number
  . y: number
type Segment =
  • • x1: number
    • y1: number
  • • x2: number
    • y2: number
</Playground>

### Implicit Type Arguments

Like [implicit function calls](#function-calls),
the angle brackets in type arguments are implicit,
and can be replaced by a space or indentation.

<Playground>
let cats: Partial Record CatName, CatInfo
type CatInfo = Partial
  furry: boolean
  fuzzy: boolean?
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

### Indexing Types

[Indexed access types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
can be written with a `.` when accessing a string, template, or number:

<Playground>
type Age = Person."age"
type First = TupleType.0
type Data = T.`data-${keyof Person}`
</Playground>

Note that `T.x` is reserved for
[TypeScript namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html),
so you need to add quotes around `x` for indexed access.

You can also enable [CoffeeScript prototype style](#coffeescript-operators)
indexed access:

<Playground>
"civet coffeePrototype"
type Age = Person::age
</Playground>

### Assertions

<Playground>
data!
data!prop
elt as HTMLInputElement
elt as! HTMLInputElement
</Playground>

You can use `as tuple` to give an array literal a
[tuple type](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types).

<Playground>
[1, "hello"] as tuple
// type [number, string]
[1, "hello"] as const as tuple
// type [1, "hello"]
[1, "hello"] as const
// type readonly [1, "hello"]
</Playground>

Unlike TypeScript, assertions can start later lines:

<Playground>
"Hello, world!"
.split /\s+/
as [string, string]
</Playground>

<Playground>
for value of [1, 2, 3]
  value ** 2
as [number, number, number]
</Playground>

## Modules

### `from` Shorthand

If you have `from` in your `import`, you can omit `import`.
You can also omit quotes around most filenames.

<Playground>
fs from fs/promises
{basename, dirname} from path
metadata from ./package.json with type: 'json'
</Playground>

### Import-Like Object Destructuring

<Playground>
import {X: LocalX, Y: LocalY} from "./util"
{X: LocalX, Y: LocalY} from "./util"
</Playground>

### Dynamic Import

If it's not the start of a statement,
dynamic `import` does not require parentheses:

<Playground>
{x} = await import url
</Playground>

### Dynamic Import Declarations

If you're not at the top level, `import` declarations get transformed
into dynamic imports:

<Playground>
function load
  * as utils from ./utils
  { version: nodeVer,
    execPath as nodePath } from process
  fs, {readFile} from fs
  return {utils, nodeVer, nodePath, fs, readFile}
</Playground>

::: info
Note that the `import` gets `await`ed, so the function becomes asynchronous.
:::

You can also use `import` declarations as expressions, as a shorthand for
`await`ing and destructuring a dynamic `import`:

<Playground>
urlPath := import {
  fileURLToPath, pathToFileURL
} from url
url := import * from url
Foo := import default from Foo
</Playground>

### Export Shorthand

<Playground>
export a, b, c from "./cool.js"
export x = 3
</Playground>

### Export Default Shorthand

Most declarations can also be `export default`:

<Playground>
export default x := 5
</Playground>

### Backward Import/Export

Similar to Python, you can put `from` before `import`/`export`.
This can improve autocompletion behavior.

<Playground>
from fs/promises import { readFile, writeFile }
from ./util import * as util
from ./package.json with {type: 'json'} export { version }
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

### Indentation

Closing tags are optional if JSX uses indentation.

<Playground>
return
  <>
    <div>
      Hello {name}!
    {svg}
</Playground>

JSX children do need to be properly indented if they're on separate lines,
which prevents pasting improperly indented XHTML/JSX code.
(On the other hand, with proper indentation, this feature effectively makes
tags like `<img>` self-closing, bringing JSX closer to HTML than XHTML.)
You can turn off this feature using the `"civet coffeeJSX"` directive.

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

### XML Comments

<Playground>
<div>
  <!-- Comment -->
  Civet
</Playground>

### Attributes

Attribute values do not need braces if they have no whitespace, are indented, or are suitably wrapped (parenthesized expressions, strings and template strings, regular expressions, array literals, braced object literals):

<Playground>
<div
  foo=bar
  count=count()
  sum=x+1
  list=[1, 2, 3]
  string=`hello ${name}`
>
  Civet
</Playground>

<Playground>
<Show
  when=
    if testing
      timer() > 10
    else
      loaded()
  fallback =
    <img src="loading.gif">
    <div>Loading...</div>
>
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

Specify the `"civet react"` directive to use the `className` attribute instead:

<Playground>
"civet react"
<div .foo>Civet
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

### Declaration Children

Lexical declarations can appear in the middle of JSX, allowing you to
effectively define variables in the middle of a long JSX block.

<Playground>
<div>
  { {first, last} := getName() }
  Welcome, {first} {last}!
</Playground>

### Function Children

Arrow functions are automatically wrapped in braces:

<Playground>
<For each=items()>
  (item) =>
    <li>{item}
</Playground>

### Code Children

Civet expressions can be prefixed with `>` instead of wrapping in braces.

<Playground>
<main>
  >for item of items
    <li>{item}
</Playground>

<Playground>
<.greeting>
  >if user := getUser()
    <span>
      Welcome back,
      >' '
      > user |> .name |> formatName
    <LogoutButton>
  else
    <LoginButton>
</Playground>

To write an entire block of code, indent it inside `>`
(or `>do` — a [`do` block](#do-blocks) is implicit).

<Playground>
<.user>
  >
    user := getUser()
    `Logged in as ${user.first} ${user.last}`
</Playground>

### Automatic Code Children

If code is more common than text in your JSX, consider using the
`"civet jsxCode" directive which treats JSX children as Civet expressions.

<Playground>
"civet jsxCode"
function List({items})
  <ul>
    for item of items
      <li>
        if item.image
          <img src=item.image>
        if item.type is "link"
          <a href=item.url>
            'Link: '
            item.title
        else
          <p> item.content
</Playground>

Note that each "line" is treated as its own child expression,
which makes it easy to concatenate multiple expressions.
If you need a multi-line block, use [`do`](#do-blocks):

<Playground>
"civet jsxCode"
<div>
  "Welcome, "
  do
    { first, last } := getName()
    `${first} ${last.toUpperCase()}`
</Playground>

[Declaration children](#declaration-children) work too,
but note that they are exposed to the outer block:

<Playground>
"civet jsxCode"
<div>
  "Welcome, "
  { first, last } := getName()
  `${first} ${last.toUpperCase()}`
</Playground>

You can also individually control whether children get treated as code
when on the same line as the tag (`"civet jsxCodeSameLine"`) or
when indented (`"civet jsxCodeNested"`).
(This distinction is only meaningful when `"civet coffeeJSX"` is disabled.)

<Playground>
"civet jsxCodeNested"
<form>
  <h2>Enter your name
  for part of ["first", "last"]
    <label>
      part.toUpperCase() + ": "
      <input id=part>
  <button>Submit
</Playground>

## [SolidJS](https://www.solidjs.com/)

`link` automatically typed as `HTMLAnchorElement`

<Playground>
"civet solid"
link := <a href="https://civet.dev/">Civet
</Playground>

You can specify whether the code will run on the client (default)
and/or the server:

<Playground>
"civet solid client server"
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

### CoffeeScript Do Blocks

This option disables [Civet `do` blocks](#do-blocks)
and [`do...while` loops](#do-while-until-loop).

<Playground>
"civet coffeeDo"
do foo
do (url) ->
  await fetch url
</Playground>

### CoffeeScript Interpolation

<Playground>
"civet coffeeInterpolation"
console.log "Hello #{name}!"
console.log """
  Goodbye #{name}!
"""
</Playground>

<Playground>
"civet coffeeInterpolation"
r = /// #{prefix} \s+ #{suffix} ///
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
"civet coffeeDiv"
x // y
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

### CoffeeScript Ranges

<Playground>
"civet coffeeRange"
[10..1]
[a..b]
[a...b]
</Playground>

### CoffeeScript Comments

If you don't need [private class fields](#private-fields)
or [length shorthand](#length-shorthand),
you can enable `#` for single-line comments:

<Playground>
"civet coffeeComment"
# one-line comment
</Playground>

<Playground>
"civet coffeeComment"
r = ///
  \s+ # whitespace
///
</Playground>

[`###...###` block comments](#block-comments) are always available.

### CoffeeScript Line Continuations

<Playground>
"civet coffeeLineContinuation"
loop
  x += \
'hello'
</Playground>

### CoffeeScript Classes

<Playground>
"civet coffeeClasses autoVar"
class X
  privateStaticVar = 5
  @publicStaticVar = 6
  constructor: (@x) ->
  get: -> @x
  bound: => @x
  @staticFunc: -> @publicStaticVar
</Playground>

### IIFE Wrapper

In some CommonJS contexts
(e.g., browser scripts or concatenating files together),
it is helpful to wrap the entire program in an
[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
so that `var` declarations do not become globals.
(CoffeeScript [does so](https://coffeescript.org/#lexical-scope)
by default unless you request `bare` mode or use ESM features.)
In Civet, you can request such a wrapper via the `"civet iife"` directive:

<Playground>
"civet iife"
var x = 5 // not global thanks to wrapper
x += x * x
</Playground>

In this mode, you cannot use `export`, but you can use `import`
thanks to [dynamic import declarations](#dynamic-import-declarations).
Top-level `await` turns into a CommonJS-compatible `async` function call:

<Playground>
"civet iife"
fetch 'https://civet.dev'
|> await
|> .status
|> console.log
</Playground>

One context where IIFE wrapping is helpful is when building Civet REPLs,
such as Civet's CLI or Playground, where we want to display the last computed
value; the IIFE wrapper returns this value automatically
(wrapped in a `Promise` in the case of top-level `await`).
In the REPL context, we want to expose (not hide) top-level declarations
to the global scope for future REPL inputs.
Civet offers a special directive for this behavior:

<Playground>
"civet repl"
x .= 5 // outer block => exposed
if x++
  y .= x * x // inner block => not exposed
  x += y
</Playground>

::: info
Exposed declarations become `var` regardless of their original declaration
type (`var`, `const`, `let`).
In particular, `const` semantics is not preserved.
This behavior is usually helpful in a REPL context: it lets you attempt to
correct a previous declaration.
It also matches Chrome's console behavior (but not NodeJS's CLI behavior).
:::

## JavaScript Compatibility

Civet aims to be mostly compatible with JavaScript and TypeScript,
so that most JavaScript/TypeScript code is valid Civet code.
See [comparison](comparison) for the few exceptions.
You can increase JavaScript compatibility with the following options:

### No Implicit Returns

To disable [implicit returns from functions](#function),
use the directive `"civet -implicitReturns"`:

<Playground>
"civet -implicitReturns"
function processAll(array)
  for item of array
    process item
</Playground>

### Strict Mode

Output from Civet runs by default in JavaScript's sloppy mode,
unless it is loaded as an ECMAScript module.
To turn on
[JavaScript's strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode),
add the directive `"use strict"` as usual, or the Civet directive
`"civet strict"`. The latter is useful because it can be specified in
[Civet configuration files](config).

<Playground>
"civet strict"
x = 5 // invalid
</Playground>
