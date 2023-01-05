<script lang="ts" setup>
import * as shiki from 'shiki';
import type { Highlighter } from 'shiki';
import { compileCivet } from '../compileCivet';
import { ref, onServerPrefetch, onMounted, useSlots } from 'vue';

const inputExampleCode = decodeURI(
  useSlots().default?.()[0].children?.toString() ?? ''
);

const outputHtml = ref('');
const inputHtml = ref('');
const inputError = ref('');

// TODO: createHighlighter only once
async function createHighlighter() {
  return await shiki.getHighlighter({
    // @ts-ignore
    ...(!import.meta.env.SSR && {
      paths: {
        languages: '/shiki/languages',
        themes: '/shiki/themes',
        wasm: '/shiki',
      },
    }),
    theme: 'one-dark-pro',
    langs: ['coffee', 'tsx'],
  });
}

async function generateHtmlCode(highlighter: Highlighter) {
  inputHtml.value = highlighter.codeToHtml(inputExampleCode, {
    lang: 'coffee',
  });
  try {
    const output = await compileCivet(inputExampleCode);
    outputHtml.value = highlighter.codeToHtml(output.code, {
      lang: 'tsx',
    });
  } catch (err) {
    console.error(err);
    inputError.value = err;
  }
}

onServerPrefetch(async () => {
  const highlighter = await createHighlighter();
  await generateHtmlCode(highlighter);
});

onMounted(async () => {
  const highlighter = await createHighlighter();
  await generateHtmlCode(highlighter);
});
</script>

<template>
  <div class="codes">
    <div hidden><slot /></div>
    <div class="code" v-html="inputHtml" />
    <div class="code" v-html="outputHtml" />
  </div>
  {{ inputError }}
</template>

<style scoped>
.codes {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
}

.code {
  margin: 8px 0;
  width: 100%;
}

@media (min-width: 768px) {
  .code {
    width: calc(50% - 10px);
  }
}

.code:deep(code) {
  display: block;
  padding: 0 24px;
  width: fit-content;
  min-width: 100%;
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
  color: var(--vp-code-block-color);
  transition: color 0.5s;
}

.code:deep(pre) {
  height: 100%;
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 16px 0;
  background: transparent;
  overflow-x: auto;
  background-color: var(--vp-code-block-bg) !important;
  border-radius: 5px;
}
</style>
