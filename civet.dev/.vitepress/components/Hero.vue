<script setup>
import VPHero from 'vitepress/dist/client/theme-default/components/VPHero.vue';

const actions = [
  {
    theme: 'brand',
    text: 'Reference',
    link: '/reference',
  },
  {
    theme: 'alt',
    text: 'Cheatsheet',
    link: '/cheatsheet',
  },
  {
    theme: 'alt',
    text: 'Civet playground',
    link: '/playground',
  },
];
</script>

<template>
  <VPHero
    class="hero"
    name="Civet"
    text="The Modern Way to Write TypeScript"
    tagline="Expressive Syntax and Faster Coding with Civet"
    :image="{
      src: 'https://user-images.githubusercontent.com/13007891/210392977-03a3b140-ec63-4ce9-b6e3-0a0f7cac6cbe.png',
      alt: 'Civet logo',
    }"
    :actions="actions"
  />
</template>

<style scoped>
@media (min-width: 768px) {
  .VPHero {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .VPHero:deep(.VPImage) {
    margin-top: 30px;
    margin-left: 50px;
  }
}
</style>
