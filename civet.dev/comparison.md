---
title: Comparison to JavaScript/TypeScript
aside: false
---

# {{ $frontmatter.title }}

Civet aims to be 99% compatible with existing JavaScript/TypeScript code.
However, there are a few intentional deviations.

In the examples below, Civet code is on
<span class="wide">the left</span><span class="narrow">top</span>,
and compiled TypeScript output is on
<span class="wide">the right</span><span class="narrow">bottom</span>.

[[toc]]

## Single-Argument Arrow Functions

In Civet, arrow functions with a single argument need to wrap that argument in
parentheses; otherwise, it gets treated like an implicit function call.

<Playground>
(x) => x + 1
x => x + 1
</Playground>

The advantage of this approach is that zero-argument functions do not need `()`
to indicate arguments:

<Playground>
=> console.log("Hello")
createEffect => console.log(signal())
</Playground>

## Implicit Return

In Civet, all functions implicitly return the value of their last statement.
You can disable this functionality by adding a semicolon at the end of
the last statement, declaring a `void` return type, or adding an
explicit `return`.

<Playground>
function more(x) {
  x+1
}
function hello() {
  console.log("Hello world!")
}
function hello() {
  console.log("Hello world!");
}
function hello(): void {
  console.log("Hello world!")
}
function hello() {
  console.log("Hello world!")
  return
}
</Playground>

By contrast, in JavaScript, only arrow functions without braces
implicitly return a value.  This case works in Civet too;
just be sure not to have a trailing semicolon which turns off implicit returns.
And in Civet you get implicit returns from arrow functions
with braces or indented blocks too.

<Playground>
(x) => x + 1
(x) => x + 1;
=> console.log("Hello world!")
=> console.log("Hello world!");
(x) => {
  if (x > 5)
    "large"
  else
    "small"
}
</Playground>

If you don't like implicit returns outside of single-line arrow functions,
you can turn off this feature entirely via a `"civet"` directive
at the top of your file:

<Playground>
"civet -implicitReturns"
function hello() {
  console.log("Hello world!")
}
=>
  console.log("Hello world!")
(x) => x + 1
</Playground>

## Operator Spacing

Because Civet allows for implicit function calls without parentheses,
symbol operators (`+`, `-`, etc.) need to be spaced consistently:

* Unary operators (`+`, `-`, `~`, `!`) cannot have spaces after them.
* Binary operators
  (`+`, `-`, `*`, `**`, `/`, `%`, `%%`, `==`, `===`, `<`, `>`, `<=`, `>=`,
  `<<`, `>>`, `>>>`, `&`, `&&`, `|`, `||`, `??`)
  should either have spaces on both sides, or no space on either side.
  (Currently we also allow space after but not before the operator.)
* Comma operator is forbidden in some contexts, e.g.,
  array/object indexing.
* Type parameters and arguments `<T>` cannot have spaces before them.
* Regular expression literals cannot start with a space.
  (Use `\ ` or `[ ]`.)

<Playground>
x+y    // addition
x + y  // addition
x +y   // unary
//invalid: + y
</Playground>

<Playground>
x/y/z      // division
x / y / z  // division
x /y/ z    // regular expression
//invalid: x /y
</Playground>

<Playground>
x<y>z      // comparison
x < y > z  // comparison
// JSX:
x <y> z
//invalid: x <y
</Playground>

## Comments

Civet supports
[`///...///` regular expression blocks](https://civet.dev/reference#regular-expressions).
Thus, you should avoid comments that start with a triple slash —
unless they are at the start of the file, as in
[TypeScript triple-slash directives](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html).

<Playground>
/// A comment because at the top of file
if s
  /// not a comment
  ///.exec s
</Playground>

## Indentation

Because Civet allows for indented blocks as shorthand for braced blocks,
it generally requires you to respect your own indentation.

<Playground>
(x) =>
  console.log("Hello")
  x+1
</Playground>

<Playground>
if (condition)
  console.log("condition holds")
  console.log("condition still holds")
</Playground>

By contrast, in JavaScript, the last indented line would have been
treated as if it were at the top level.

## Automatic Semicolon Insertion

JavaScript has [complicated rules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#automatic_semicolon_insertion)
for automatic semicolon insertion.
Civet has a different set of rules for what separates different statements,
which are hopefully closer to your intuition.
Binary operators and member access can continue on the next line,
but only when spaced in the natural way (e.g. space after the binary operator).

<Playground>
x +
y
- z
-negative
[array]
.length
{name: value}
</Playground>

By contrast, JavaScript would treat the code on
<span class="wide">the left</span><span class="narrow">top</span>
as three binary operators with an index access (and a member access),
followed by a code block with a label.

## Keywords

Civet has some additional keywords beyond
[JavaScript's](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words)
and
[TypeScript's](https://github.com/microsoft/TypeScript/issues/2536#issuecomment-87194347),
preventing them from being variable names.
These include `and`, `or`, `is`, `not`, `unless`, and `until`.
If you use these variables in your code, please rename them,
e.g., by appending an underscore.

## Labels

In Civet, labels are written `:label` instead of `label:`.
(The one exception is `$:` which can be written as `$:`
for Svelte compatibility.)

<Playground>
:label while (true) {
  break label
}
$: document.title = title
</Playground>

(This is to enable most object literals not needing braces.)

## Decorators

Civet uses `@` as
[shorthand for `this`, `static`, and `constructor`](/reference#this).
Decorators need to be written with `@@`:

<Playground>
@@Object.seal
class Civet
  @name = "Civet"
</Playground>

Civet also does not support decorators on the same line as methods.
This lets you use implicit function call syntax:

<Playground>
class Civet
  @@description translate "Caffeine time!"
  drink()
    @fetch @coffeeCup
</Playground>

## JSX

To allow for automatic closing of JSX tags, Civet requires JSX children
to be properly indented.

<Playground>
<div>
  <h1>Hello</h1>
  <p>Text</p>
"not inside div anymore"
</Playground>

If you're OK with explicitly closing all tags, you can turn off the
indentation requirement via a `"civet"` directive:

<Playground>
"civet coffeeJSX"
<div>
  <h1>Hello</h1>
  <p>Text</p>
still inside div
</div>
</Playground>

Another discrepancy is that Civet automatically combines consecutive JSX tags
at the same indentation level into a JSX fragment.
(Otherwise, only the last tag would serve a purpose.)

<Playground>
<h1>Hello</h1>
<p>Text</p>
</Playground>

## Sloppy Mode Features

Civet generally assumes (but does not enforce)
that you are following JavaScript's
[strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode),
so it does not support:

* [with](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with)
  (consider [using](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management))
* octal values of the form `0644` (use `0o644` instead)

## Anything Else

If some existing JS/TS code does not parse in Civet and it does not fall into
one of the categories above, it is likely a bug; please
[report it](https://github.com/DanielXMoore/Civet/issues).

<br/>

# Comparison to CoffeeScript

If you are coming to Civet from a [CoffeeScript](https://coffeescript.org)
background, check out
[this comparison](https://github.com/DanielXMoore/Civet/blob/main/notes/Comparison-to-CoffeeScript.md).
