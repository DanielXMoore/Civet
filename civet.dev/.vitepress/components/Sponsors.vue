<script lang="ts" setup>
import { useData } from 'vitepress';
import type { OpenCollectiveInfo } from '../utils/getOpenCollectiveInfo';

const { sponsors, backers } = useData().theme.value
  .openCollective as OpenCollectiveInfo;
</script>

<template>
  <section>
    <h2>Sponsors</h2>
    <p>
      Thank you to all of our sponsors for your invaluable support and
      contribution to the Civet language!
    </p>
    <ul class="sponsors">
      <li v-for="sponsor in sponsors" class="item">
        <a :href="sponsor.href" target="_blank" class="sponsor">
          <img
            v-if="sponsor.image"
            :src="sponsor.image"
            :alt="sponsor.name"
            :title="sponsor.name"
            class="img"
          />
          <span v-else>{{ sponsor.name }}</span>
        </a>
      </li>
    </ul>

    <p>
      <a
        href="https://opencollective.com/civet"
        target="_blank"
        rel="noopener noreferrer"
      >
        Support the future development of Civet!
      </a>
    </p>
  </section>
</template>

<style scoped>
.sponsors {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0;
}

.item {
  margin-top: 0;
}

.sponsor {
  display: flex;
  width: 140px;
  height: 140px;
  justify-content: center;
  align-items: center;
  text-align: center;

  background: var(--vp-c-bg-mute);
  border-radius: 5px;
  padding: 10px;
}

.img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 5px;
}
</style>
