<script lang="ts" setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { compileCivetToHtml } from '../utils/compileCivetToHtml';

const props = defineProps<{ code?: string }>();
const exampleCode = decodeURI(props.code!);
const userCode = ref(exampleCode);

const compileError = ref<string | undefined>('');
const inputHtml = ref('');
const outputHtml = ref('');
const inputHtmlEl = ref<HTMLDivElement>();
const textareaEl = ref<HTMLTextAreaElement>();

function fixTextareaHeight() {
  if (textareaEl.value && inputHtmlEl.value) {
    textareaEl.value.style.height = `${inputHtmlEl.value.clientHeight}px`;
    textareaEl.value.style.width = `${
      inputHtmlEl.value.querySelector('code')!.scrollWidth + 20
    }px`;
  }
}

onMounted(fixTextareaHeight);

watch(userCode, async () => {
  const snippet = await compileCivetToHtml(userCode.value + '\n');

  compileError.value = snippet.error;
  inputHtml.value = snippet.inputHtml;

  if (snippet.outputHtml) {
    outputHtml.value = snippet.outputHtml;
  }

  await nextTick();
  fixTextareaHeight();
});
</script>

<template>
  <div class="wrapper">
    <div class="col" @click="textareaEl?.focus()">
      <div class="code code--user">
        <textarea
          v-model="userCode"
          ref="textareaEl"
          resize="false"
          spellcheck="false"
          class="textarea shiki one-dark-pro"
        />
      </div>

      <div class="code code--input" ref="inputHtmlEl">
        <div v-if="inputHtml" v-html="inputHtml" />
        <slot v-else name="input" />
        <div class="compilation-info">
          <span v-if="inputHtml && compileError">❌ Compile error</span>
          <span v-else>Edit this snippet!</span>
        </div>
      </div>
    </div>

    <div class="col">
      <div class="code code--output">
        <div v-if="outputHtml" v-html="outputHtml" />
        <slot v-else name="output" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
}

.col {
  margin: 8px 0;
  position: relative;
  background: var(--vp-code-block-bg);
  border-radius: 5px;
  border: 1px solid transparent;
  transition: border-color 0.1s;
  width: calc(50% - 10px);
}

@media (max-width: 767px) {
  .col {
    width: 100%;
  }
}

.code {
  width: 100%;
  cursor: text;
}

.code--user {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
  min-height: 100%;
  background: transparent;
}

.code--input {
  z-index: 2;
}

.textarea {
  min-width: 100%;
  height: 100%;
  padding: 16px 18px;
  caret-color: var(--vp-button-brand-border);
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
  background: transparent;
  resize: none;
  color: transparent;
  overflow: hidden;
}

.compilation-info {
  position: absolute;
  right: 8px;
  bottom: 2px;
  font-size: 12px;
  color: var(--vp-c-text-dark-1);
  opacity: 0.4;
}

.code:deep(code) {
  display: block;
  padding: 0 18px;
  width: fit-content;
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
  background-color: transparent !important;
  border-radius: 5px;
  overflow: visible;
  position: relative;
  z-index: 1;
}

@media (max-width: 1000px) {
  .textarea,
  .compilation-info {
    display: none;
  }
  .code:deep(pre) {
    overflow: auto;
  }
}
</style>
