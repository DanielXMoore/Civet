<script setup>
import { useData } from 'vitepress';

const users = useData().theme.value.contributors;
</script>

<template>
  <ul class="items">
    <li v-for="user in users" :key="user.id" class="item">
      <a :href="user.href" target="_blank" class="user">
        <img :src="user.avatar" :alt="user.login" class="img" />
        <span>
          {{ user.login }}
          <span class="commits">({{ user.contributions }})</span>
        </span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.items {
  list-style: none;
  margin: 10px 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 10px;
}

.item {
  margin: 0;
}

.user {
  display: flex;
  align-items: center;
  background: var(--vp-c-bg-mute);
  border-radius: 5px;
  padding: 10px;
}

.img {
  width: 30px;
  border-radius: 50%;
  margin-right: 10px;
  display: inline-block;
}

.commits {
  color: var(--vp-c-text-2);
}
</style>
