---
title: Homepage
aside: false
---

<script setup>
  import Hero from './.vitepress/components/Hero.vue'
  import Contributors from './.vitepress/components/Contributors.vue'
</script>

<Hero />

Civet on the left, compiled TypeScript output on the right:

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

[JSX](/cheatsheet#jsx)? No problem!

::: code-group

```coffee
ListItem := (props: Props) =>
  <li .item>{props.value}
```

```jsx
const ListItem = (props: Props) => {
  return <li class="item">{props.value}</li>;
};
```

:::

## Contributors

Thank you for your work and dedication to the Civet project!

<Contributors />
