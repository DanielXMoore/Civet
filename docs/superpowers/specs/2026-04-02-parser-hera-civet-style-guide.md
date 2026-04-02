# parser.hera Civet Style Guide

Cheat sheet for converting `source/parser.hera` to Civet conventions.
Apply to both the top-level code block (lines 7–235) and grammar action blocks.
Goal: simpler, more readable code — not features for their own sake.

## Declarations

| JS | Civet |
|----|-------|
| `const x = value` | `x := value` |
| `let x = value` | `x .= value` |
| `let x` | `let x` (keep — uninitialized) |
| `const { a, b } = obj` | `{ a, b } := obj` |
| `const [ a, b ] = arr` | `[ a, b ] := arr` |

## Operators

| JS | Civet |
|----|-------|
| `===` | `is` |
| `!==` | keep as `!==` |
| `&&` | `and` |
| `\|\|` | `or` |
| `!x` | `not x` |
| `x.length` | `x#` *(only when reads clearly)* |

## Conditionals

| JS | Civet |
|----|-------|
| `if (x)` | `if x` |
| `if (!x)` | `unless x` |
| `if (x) return y` | `return y if x` |
| `if (!x) return y` | `return y unless x` |
| multi-line `if (!x) { ... }` | `unless x` with indented body |

## Returns

| Context | Rule |
|---------|------|
| Grammar action blocks | Always explicit: `return $X`, `return $skip`, etc. |
| Top-level code block | Implicit return for last expression when obvious |
| Intentional void return | Keep explicit bare `return` |

## Functions & Methods

| JS | Civet |
|----|-------|
| `function foo(a, b) {` | `function foo(a, b)` + indented body |
| `(x) => { return y }` | `(x) => y` |
| `arr.map((x) => x.name)` | `arr.map .name` *(property access shorthand)* |
| `arr.map((x) => expr)` | `arr.map (x) => expr` |
| `.then(function() { ... })` | `.then =>` + indented body |

## Pattern Matching & Null Checks

| JS | Civet |
|----|-------|
| `x.type === "Foo"` | `x.type is "Foo"` |
| `x.type === "Foo" && x.y === "bar"` | `x is like { type: "Foo", y: "bar" }` *(only when it simplifies)* |
| `Array.isArray(x)` | keep as-is |
| `x != null` | `x?` |
| `x == null` | `not x?` |
