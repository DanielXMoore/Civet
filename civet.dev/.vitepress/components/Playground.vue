<script lang="ts" setup>
import { onMounted, ref, watch, nextTick, computed } from 'vue';
import { compileCivetToHtml } from '../utils/compileCivetToHtml';
import { b64 } from '../utils/b64';
import { ligatures } from '../store/ligatures.store';

const emit = defineEmits(['input']);
const props = defineProps<{
  b64Code: string;
  compileAtStart?: boolean;
  emitJsOutput?: boolean;
  clearTrigger?: boolean;
  hideLink?: boolean;
  showPrettier?: boolean;
  showTypescript?: boolean;
  raw?: boolean;
  showComptime?: boolean;
  comptime?: boolean;
}>();

const userCode = ref(b64.decode(props.b64Code));
const compileError = ref<string | undefined>('');
const inputHtml = ref('');
const outputHtml = ref('');
const inputHtmlEl = ref<HTMLDivElement>();
const outputHtmlEl = ref<HTMLDivElement>();
const textareaEl = ref<HTMLTextAreaElement>();

// Compile on input
onMounted(fixTextareaSize);
watch(userCode, codeChanged);

// Clear
watch(
  () => props.clearTrigger,
  () => (userCode.value = '')
);

// Compile client side
const loading = ref(true);
onMounted(async () => {
  if (props.compileAtStart) {
    await compile();
    loading.value = false;
    await nextTick();
    fixTextareaSize();
  }
});

// Prettier toggle for full Playground
const showPrettier = props.showPrettier;
const prettier = ref(true);
watch(prettier, compile);

// TypeScript toggle for full Playground
const showTypescript = props.showTypescript;
const typescript = ref(true);
watch(typescript, compile);

const showComptime = props.showComptime;
const comptime = ref(false);
watch(comptime, compile);
const hasComptime = ref(false);

async function codeChanged() {
  if (showComptime && comptime.value) {
    comptime.value = false; // this triggers compile()
  } else {
    await compile();
  }
}

async function compile() {
  if (showComptime) {
    hasComptime.value = /\bcomptime\b/.test(userCode.value);
  }

  const snippet = await compileCivetToHtml({
    code: userCode.value + '\n',
    jsOutput: props.emitJsOutput || !typescript.value,
    tsOutput: typescript.value,
    prettierOutput: !props.raw && showPrettier && prettier.value,
    parseOptions: { comptime: props.comptime || comptime.value },
  });

  emit('input', userCode.value, snippet.jsCode);

  compileError.value = snippet.error;
  inputHtml.value = snippet.inputHtml;

  if (snippet.outputHtml) {
    outputHtml.value = snippet.outputHtml;
  }

  await nextTick();
  fixTextareaSize();
}

function fixTextareaSize() {
  if (textareaEl.value && inputHtmlEl.value) {
    textareaEl.value.style.height = `${inputHtmlEl.value.clientHeight}px`;
    textareaEl.value.style.width = `${
      inputHtmlEl.value.querySelector('code')!.scrollWidth + 20
    }px`;
  }
}

let feedbackTimeout;
async function copyToClipboard(textarea, pointerEvent) {
  let success = false;
  try {
    const { textContent } = textarea.value!;
    await navigator.clipboard.writeText(textContent as string);
    success = true;
  } catch (err) {
    console.error(err);
  }
  // feedback
  const button = pointerEvent.target;
  if (!button) return;
  button.classList.toggle("success", success);
  button.classList.toggle("failure", !success);
  clearTimeout(feedbackTimeout);
  feedbackTimeout = setTimeout(() => {
    button.classList.remove("success");
    button.classList.remove("failure");
  }, 2_000);
}
function copyInputToClipboard(pointerEvent) {
  copyToClipboard(inputHtmlEl, pointerEvent);
}
function copyOutputToClipboard(pointerEvent) {
  copyToClipboard(outputHtmlEl, pointerEvent);
}

const playgroundUrl = computed(() => {
  return `/playground?code=${b64.encode(userCode.value)}`;
});
</script>

<template>
  <div v-if="props.compileAtStart && loading">Loading playground...</div>
  <div v-else :class="{ wrapper: true,  ligatures: ligatures}">
    <div class="col scroll" @click="textareaEl?.focus()">
      <div class="code code--user">
        <textarea
          :value="userCode"
          :onInput="(e: any) => (userCode = e.target.value)"
          ref="textareaEl"
          resize="false"
          spellcheck="false"
          class="textarea shiki one-dark-pro"
        />
      </div>

      <div class="code code--input" ref="inputHtmlEl">
        <div v-if="inputHtml" v-html="inputHtml" />
        <slot v-else name="input" />
      </div>

      <div class="compilation-info">
        <span v-if="!hideLink">
          Edit inline or
          <a
            :href="playgroundUrl"
            @click.left.exact.prevent
            class="edit-in-the-background"
          >edit in the Playground</a>!
        </span>
        <span v-if="inputHtml && compileError"> ❌ Compile error ❌</span>
        <button class="copy" title="Copy input to clipboard" @click="copyInputToClipboard"/>
      </div>
    </div>

    <div class="col" :class="{ 'col--error': compileError }">
      <div class="code code--output" ref="outputHtmlEl">
        <div v-if="outputHtml" v-html="outputHtml" />
        <slot v-else name="output" />
      </div>
      <div class="compilation-info">
        <label v-if="showComptime && hasComptime">
          <input type="checkbox" v-model="comptime"/>
          comptime
        </label>
        <label>
          <input type="checkbox" v-model="ligatures"/>
          Ligatures
        </label>
        <label v-if="showPrettier">
          <input type="checkbox" v-model="prettier"/>
          Prettier
        </label>
        <label v-if="showTypescript">
          <input type="checkbox" v-model="typescript"/>
          TypeScript
        </label>
        <button class="copy" title="Copy output to clipboard" @click="copyOutputToClipboard"/>
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
  border-radius: var(--border-radius);
  border: 1px solid transparent;
  transition: border-color 0.15s;
  width: calc(50% - 10px);
}

.col--error {
  border: 1px solid var(--vp-c-red-3);
}
.col--error > .code--output:has(.crash) {
  color: var(--vp-c-red-1);
  padding: 0 18px; /* match shiki padding */
  font-size: var(--vp-code-font-size);
}

.scroll {
  overflow-x: auto;
  overflow-y: hidden;
}

@media (max-width: 767px) {
  .col {
    width: 100%;
  }
}

.code {
  width: 100%;
  cursor: text;
  margin-bottom: 20px;
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
  caret-color: var(--vp-c-text-1);
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
  background: transparent;
  resize: none;
  color: transparent;
  overflow-x: visible;
  overflow-y: hidden;
}

.compilation-info {
  position: absolute;
  right: 8px;
  bottom: 3px;
  font-size: 12px;
  color: var(--vp-c-text-dark-1);
  opacity: 0.5;
  z-index: 4;
}

.edit-in-the-background {
  cursor: pointer;
  color: var(--vp-c-green-light);
  padding: 10px 0;
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
  border-radius: var(--border-radius);

  position: relative;
  z-index: 1;
}

.code--input:deep(pre) {
  overflow: visible;
}

input {
  vertical-align: middle;
}

.copy {
  width: 20px;
  height: 20px;
  vertical-align: -5px;
  margin-left: 5px;
  position: relative;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' height='20' width='20' stroke='rgb(128,128,128)' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2'/%3E%3C/svg%3E");
}
.copy:hover, .copy:active {
  filter: brightness(0.75);
}
.dark .copy:hover, .dark .copy:active {
  filter: brightness(1.2);
}
.success::before {
  color: #0a0;
  content: "✓";
  display: inline-block;
  position: absolute;
  top: -1px;
  left: 5px;
}
.failure::before {
  color: #f00;
  content: "✗";
  display: inline-block;
  position: absolute;
  top: -1px;
  left: 4.5px;
}
</style>

<style>
.col--error h3 {
  margin-top: 16px;
}
</style>
