<script setup lang="ts">
import { ref } from 'vue';
import { b64 } from '../utils/b64';
import { debounce } from '../utils/debounce';
import VPButton from 'vitepress/dist/client/theme-default/components/VPButton.vue';
const query = new URLSearchParams(location.search);

// Try to load b64 code
let b64Code = ref('');
try {
  const queryCode = query.get('code')?.replace(/ /g, '+');
  if (queryCode) b64Code.value = queryCode;
} catch (err) {}
if (!b64Code.value) b64Code.value = window.localStorage.getItem('code') ?? '';
if (!b64Code.value) b64Code.value = b64.encode(`console.log 'Hello Civet!'`);
// e/o Try to load b64 code

// Try to decode b64 code
let startingCode = '';
try {
  startingCode = b64.decode(b64Code.value);
} catch (err) {}
const userCode = ref(startingCode);
const jsCode = ref('');
// e/o Try to decode b64 code

const updateUrl = debounce(() => {
  query.set('code', b64.encode(userCode.value));
  window.history.replaceState(
    {},
    '',
    `${location.pathname}?${query.toString()}`
  );
}, 500);

function onInput(civet: string, js: string) {
  window.localStorage.setItem('code', b64.encode(civet));
  userCode.value = civet;
  jsCode.value = js;
  updateUrl();
}

const evalOutput = ref<null | string>(null);
const evalComplete = ref<boolean>(true);

window.civetconsole = {};
Object.keys(console).forEach((key) => {
  window.civetconsole[key] = (...args) => {
    console[key](...args);
    evalOutput.value +=
      (key === 'log' ? '' : `[${key.toUpperCase()}] `) +
      args
        .map((arg) =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
        )
        .join(' ') +
      '\n';
  };
});

function runInBrowser() {
  evalOutput.value = ''
  evalComplete.value = false
  try {
    // Indirect eval call (via ?.) causes evaluation in global scope,
    // instead of the scope of this function.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#direct_and_indirect_eval
    const returned = eval?.(jsCode.value);
    if (returned !== undefined) evalOutput.value += `${returned}\n`
  } catch (err) {
    console.error(err);
    evalOutput.value += `[THROWN] ${err.toString()}\n`
  }
  evalComplete.value = true
}

const clearTrigger = ref(false);
function clear() {
  evalOutput.value = null;
  clearTrigger.value = !clearTrigger.value;
}
</script>

<template>
  <Playground
    @input="onInput"
    compile-at-start
    emit-js-output
    hide-link
    :b64-code="b64Code"
    :clear-trigger="clearTrigger"
  />

  <div class="buttons">
    <VPButton text="Clear" @click="clear" theme="sponsor" class="button" />
    <VPButton text="Run" @click="runInBrowser" theme="alt" class="button" />
  </div>

  <div v-if="evalOutput !== null">
    <h2>Console output</h2>
    <pre
      class="eval-output shiki one-dark-pro">{{ evalOutput }}<span v-if="!evalOutput && evalComplete">
    _._     _,-'""`-._        Nothing to show...  
   (,-.`._,'(       |\`-/|  /
       `-.-' \ )-`( , o o)
             `-    \`_`"'-
      </span></pre>
  </div>
</template>

<style>
.playground {
  overflow-y: scroll;
}
.playground .VPContent .container,
.playground .VPContent .content-container,
.playground .VPContent .content {
  max-width: var(--vp-layout-max-width) !important;
}
</style>

<style scoped>
.buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  margin: 15px 0;
  gap: 15px;
}

.eval-output {
  width: calc(50% - 10px);
  border-radius: 5px;
  padding: 16px 18px;
  color: var(--vp-code-block-color);
  background: var(--vp-code-block-bg);
  caret-color: var(--vp-button-brand-border);
  line-height: var(--vp-code-line-height);
  font-size: var(--vp-code-font-size);
}

@media (max-width: 1200px) {
  .eval-output {
    width: 100%;
    overflow-x: scroll;
  }
}
</style>
