---
title: Playground
aside: false
editLink: false
lastUpdated: false
---

<script setup lang="ts">
import PlaygroundFull from './.vitepress/components/PlaygroundFull.vue'
import VPBadge from 'vitepress/dist/client/theme-default/components/VPBadge.vue';
import { useData } from 'vitepress';
const data = useData().page.value;
</script>

<h1>
  Playground <VPBadge type="info">Civet {{ data.civetVersion }}</VPBadge>
</h1>
<p>Copy the URL to share your code!</p>

<ClientOnly>
  <PlaygroundFull />
</ClientOnly>
