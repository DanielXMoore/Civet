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

::: code-group

```coffee
a is b
a or b
a and b
```

```typescript
a === b;
a || b;
a && b;
```

:::

### Variables

::: code-group

```coffee
a := 10
b ::= 10
c .= 10
```

```typescript
const a = 10;
let b = 10;
let c = 10;
```

:::

### Objects

::: code-group

```coffee
person := name: 'Henry', age: 4

obj :=
  a: 1
  b: 2
  c:
    x: 'pretty'
    y: 'cool'
```

```typescript
const person = { name: 'Henry', age: 4 };

const obj = {
  a: 1,
  b: 2,
  c: {
    x: 'pretty',
    y: 'cool',
  },
};
```

:::

### Arrays

::: code-group

```coffee
rotate := [
  c, -s
  s, c
]

func.apply @, [
  arg1
  arg2
]
```

```typescript
const rotate = [
  c, -s,
  s, c,
]

func.apply(this, [
  arg1,
  arg2,
]);
```

:::

### Triple-Quoted Strings

::: code-group

```coffee
console.log '''
  <div>
    Civet
  </div>
'''

console.log """
  <div>
    Civet #{version}
  </div>
"""
```

```typescript
console.log(`<div>
  Civet
</div>`);

console.log(`<div>
  Civet ${version}
</div>`);
```

:::

### Functions

::: code-group

```coffee
(a: number, b: number) => a + b
```

```typescript
(a: number, b: number) => a + b;
```

:::

::: code-group

```coffee
(a: number, b: number) -> a + b
```

```typescript
function(a: number, b: number) {
  return a + b
}
```

:::

::: code-group

```coffee
(degrees: number): {x: number, y: number} =>
  radians := degrees * Math.PI / 180
  x: Math.cos theta
  y: Math.sin theta
```

```typescript
(degrees: number): {x: number, y: number} => {
  const radians = degrees * Math.PI / 180;
  return {
    x: Math.cos(theta),
    y: Math.sin(theta),
  };
}
```

:::

::: code-group

```coffee
function circle(theta: number): {x: number, y: number}
  radians := degrees * Math.PI / 180
  x: Math.cos theta
  y: Math.sin theta
```

```typescript
function circle(theta: number): {x: number, y: number} {
  const radians = degrees * Math.PI / 180;
  return {
    x: Math.cos(theta),
    y: Math.sin(theta),
  };
}
```

:::

::: info
Implicit return of the last value in a function can be avoided by adding
a final semicolon, or globally using the directive `"civet -implicitReturns"`.
:::

#### Block Shorthands

::: code-group

```coffee
x.map &.name
x.map &.profile?.name[0...3]
x.map &.callback a, b
x.map +&
```

```typescript
x.map((item) => item.name);
x.map((item) => item.profile?.name.slice(0, 3));
x.map((item) => item.callback(a, b));
x.map((item) => +item);
```

:::

::: info
Short function block syntax like [Ruby symbol to proc](https://ruby-doc.org/core-3.1.2/Symbol.html#method-i-to_proc), [Crystal](https://crystal-lang.org/reference/1.6/syntax_and_semantics/blocks_and_procs.html#short-one-parameter-syntax) or [Elm record access](https://elm-lang.org/docs/records#access)
:::

## Conditions

### If, Else

::: code-group

```coffee
if coffee or relaxed
  code()
else
  sleep()
```

```typescript
if (coffee || relaxed) {
  code();
} else {
  sleep();
}
```

:::

### Unless

::: code-group

```coffee
unless tired
  code()
```

```typescript
if (!tired) {
  code();
}
```

:::

### Conditional Assignment

::: code-group

```coffee
civet.speed = 15 if civet.rested
```

```typescript
if (civet.rested) {
  civet.speed = 15;
}
```

:::

### Switch

::: code-group

```coffee
switch dir
  when '>' then civet.x++
  when '<' then civet.x--
  else civet.waiting += 5
```

```typescript
switch (dir) {
  case '>': {
    civet.x++;
    break;
  }
  case '<': {
    civet.x--;
    break;
  }
  default: {
    civet.waiting += 5;
  }
}
```

:::

With implicit `return`:
::: code-group

```coffee
getX := (civet: Civet, dir: Dir) =>
  switch dir
    when '>' then civet.x + 3
    when '<' then civet.x - 1
    when '^' then civet.x + 0.3
```

```typescript
const getX = (civet: Civet, dir: Dir) => {
  switch (dir) {
    case '>': {
      return civet.x + 3;
    }
    case '<': {
      return civet.x - 1;
    }
    case '^': {
      return civet.x + 0.3;
    }
  }
};
```

:::

## Loops

### Infinite loop

::: code-group

```coffee
i .= 0
loop
  i++
  break if i > 5
```

```typescript
let i = 0;
while (true) {
  i++;
  if (i > 5) {
    break;
  }
}
```

:::

### Until loop

::: code-group

```coffee
i .= 0
until i > 5
  i++
```

```typescript
let i = 0;
while (!(i > 5)) {
  i++;
}
```

:::

## Classes

### Prototype

::: code-group

```coffee
X::
X::a
```

```typescript
X.prototype;
X.prototype.a;
```

:::

### This

::: code-group

```coffee
@
id := @id
obj := { @id }
```

```typescript
this;
const id = this.id;
const obj = { id: this.id };
```

:::

### Static fields

::: code-group

```coffee
class A
  @a = 'civet'
```

```typescript
class A {
  static a = 'civet';
}
```

:::

### Readonly fields

::: code-group

```coffee
class B
 b := 'civet'

```

```typescript
class B {
  readonly b = 'civet';
}
```

:::

### Class constructor

::: code-group

```coffee
class Rectangle
  @(@height: number, @width: number)
```

```typescript
class Rectangle {
  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
  }
}
```

:::

### Class static block

::: code-group

```coffee
class Civet
  @
    try
      this.colors = getCivetColors()
```

```typescript
class Civet {
  static {
    try {
      this.colors = getCivetColors();
    } catch (e) {}
  }
}
```

:::

### Class extending

::: code-group

```coffee
class Civet < Animal
```

```typescript
class Civet extends Animal {}
```

:::

## Misc

### Chained comparisons

::: code-group

```coffee
a < b < c
```

```typescript
a < b && b < c;
```

:::

### Import ESM

::: code-group

```coffee
x from ./x
```

```typescript
import x from './x';
```

:::

### Flagging ([from LiveScript](https://livescript.net/#literals))

::: code-group

```coffee
config := { +debug, -live }
```

```typescript
const config = { debug: true, live: false };
```

:::

### Optional chaining

::: code-group

```coffee
obj?[key]
fun?(arg)
```

```typescript
obj?.[key];
fun?.(arg);
```

:::

### Operators

::: code-group

```coffee
a is b

a and= b
a or= b
a ?= b

obj.key ?= 'civet'
```

```typescript
a === b

a &&= b;
a ||= b;
a ??= b;

obj.key ??= 'civet';
```

:::

### Range literals

::: code-group

```coffee
a := ['a'..'d']
b := [0..6]
```

```typescript
const a = ['a', 'b', 'c', 'd'];
const b = [0, 1, 2, 3, 4, 5, 6];
```

:::

### Array Slicing

::: code-group

```coffee
numbers := [1, 2, 3, 4, 5, 6]
start := numbers[0..2]
mid := numbers[3..-2]
end := numbers[-2..]
```

```typescript
const numbers = [1, 2, 3, 4, 5, 6];
const start = numbers.slice(0, 1 + 2 || 1 / 0);
const mid = numbers.slice(3, 1 + -2 || 1 / 0);
const end = numbers.slice(-2);
```

:::

### Late assignment

::: code-group

```coffee
a + b = c
```

```typescript
a + (b = c);
```

:::

### Pipelines

::: code-group

```coffee
data
  |> Object.keys
  |> console.log
```

```typescript
console.log(Object.keys(data));
```

:::

## Automatic Variable Declaration

By default, you are responsible for declaring your variables
via `var`, `let`, `const`, or their shorthands.  Alternatively,
you can use a `"civet"` directive at the beginning of your file
to specify one of two automatic variable declaration modes.

### `autoVar`

::: code-group

```coffee
"civet autoVar"
sos = 0
for item of iterable
  square = item * item
  sos += square
```

```typescript
var sos, square;
sos = 0;
for (const item of iterable) {
  square = item * item;
  sos += square;
}
```

:::

### `autoLet`

::: code-group

```coffee
"civet autoLet"
sos = 0
for item of iterable
  square = item * item
  sos += square
```

```typescript
let sos = 0;
for (const item of iterable) {
  let square = item * item;
  sos += square;
}
```

:::

## JSX

Enhancements, inspired by [solid-dsl discussions](https://github.com/solidjs-community/solid-dsl/discussions)

### Element id

::: code-group

```coffee
<div #foo> Civet
<div #{expression}> Civet
```

```jsx
<div id="foo">Civet</div>
<div id={expression}>Civet</div>
```

:::

### Class

::: code-group

```coffee
<div .foo> Civet
<div .foo.bar> Civet
<div .{expression}> Civet
```

```jsx
<div class="foo">Civet</div>
<div class="foo bar">Civet</div>
<div class={(expression) || ""}>Civet</div>
```

:::

### Attributes

::: code-group

```coffee
<div {foo}> Civet
<div ...foo> Civet
<div [expr]={value}> Civet
```

```jsx
<div foo={foo}>Civet</div>
<div {...foo}>Civet</div>
<div {...{[expr]: value}}>Civet</div>
```

:::

::: tip

Attribute values without whitespace or suitably wrapped (parenthesized expressions, strings and template strings, regular expressions, array literals, braced object literals) do not need braces:

:::

::: code-group

```coffee
<div
  foo=bar
  count=count()
  sum=x+1
  list=[1, 2, 3]
>
  Civet
```

<!-- prettier-ignore -->
```jsx
<div
  foo={bar}
  count={count()}
  sum={x + 1}
  list={[1, 2, 3]}
>
  Civet
</div>
```

:::

### Comments

::: code-group

```coffee
<div>
  <!-- Comment -->
  Civet
```

```jsx
<div>
  {/* Comment */}
  Civet
</div>
```

:::

### Indentation

Closing tags are optional if JSX uses indentation.

::: code-group

```coffee
return
  <>
    <div>
      Hello {name}!
    {svg}
```

```jsx
return (
  <>
    <div>Hello {name}!</div>
    {svg}
  </>
);
```

:::

### Function Children

::: code-group

```coffee
<For each=items()>
  (item) =>
    <li>{item}
```

```jsx
<For each={items()}>
  {(item) => {
    return <li>{item}</li>;
  }}
</For>
```

:::

## [SolidJS](https://www.solidjs.com/)

`link` automatically typed as `HTMLAnchorElement`

::: code-group

```coffee
"civet solid"
link := <a href="https://civet.dev/">Civet
```

```jsx
import type { JSX as JSX } from 'solid-js';

type IntrinsicElements<K extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[K] extends JSX.DOMAttributes<infer T> ? T : unknown;

const link = (
  <a href="https://civet.dev/">
    Civet
  </a> as any as IntrinsicElements<"a">
)
```

:::

## [CoffeeScript](https://coffeescript.org/) Compatibility

Turn on full [CoffeeScript](https://coffeescript.org/) compatibility mode
with a `"civet coffeeCompat"` directive at the top of your file,
or use more specific directive(s) as listed below.
You can also selectively remove features, such as
`"civet coffeeCompat -coffeeForLoops -autoVar"`.

### CoffeeScript For Loops

::: code-group

```coffee
"civet coffeeForLoops autoVar"
for item, index in array
  console.log item, index
for key, value of object
  console.log key, value
for own key, value of object
  console.log key, value
for item from iterable
  console.log item
```

```typescript
var key, item, index
const hasProp: <T>(this: T, prop: keyof T) => boolean = {}.hasOwnProperty as any

for (let i = 0, len = array.length; i < len; i++) {
  item = array[index=i];
  console.log(item, index);
}
for (key in object) {
  console.log(key, value);
}
for (key in object) {
  if (!hasProp.call(object, key)) continue;
  console.log(key, value);
}
for (item of iterable) {
  console.log(item);
}
```

:::

### Double-Quoted Strings

::: code-group

```coffee
"civet coffeeInterpolation"
console.log "Hello #{name}!"
```

```typescript
console.log(`Hello ${name}!`)
```

:::

### CoffeeScript Operators

::: code-group

```coffee
"civet coffeeEq coffeeIsnt coffeeNot coffeeBinaryExistential coffeeOf"
x == y != z
x isnt y
not (x == y)
x ? y
key of object
```

```typescript
x === y && y !== z;
x !== y;
!(x === y);
x ?? y;
key in object;
```

:::
