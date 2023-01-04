---
title: JSX
aside: false
---

# {{ $frontmatter.title }}

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

<div>
  <!-- XML Comment -->
  Civet
```

```jsx
<div foo={foo}>Civet</div>
<div {...foo}>Civet</div>
<div {...{[expr]: value}}>Civet</div>

<div>
  {/* XML Comment */}
  Civet
</div>
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
  <!-- XML Comment -->
  Civet
```

```jsx
<div>
  {/* XML Comment */}
  Civet
</div>
```

:::
