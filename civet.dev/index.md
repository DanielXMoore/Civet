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

Civet on the left, compiled TypeScript output on the right:

<Playground>
i .= 0
loop
  i++
  break if i > 5
</Playground>

[JSX](/cheatsheet#jsx)? No problem!

<Playground>
ListItem := (props: Props) =>
  <li .item>{props.value}
</Playground>

<Sponsors />

## Contributors

Thank you for your work and dedication to the Civet project!

<Contributors />
