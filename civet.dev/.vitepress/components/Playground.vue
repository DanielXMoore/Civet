<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch, nextTick, computed } from 'vue';
import { compileCivetToHtml } from '../utils/compileCivetToHtml';
import { b64 } from '../utils/b64';
import { ligatures } from '../store/ligatures.store';
import {
  registerCivetLanguage,
  registerCivetLspProviders,
} from '../../../lsp/monaco/dist/monaco.js';
import {
  createCivetLspWorker,
  createCivetLspWorkerClient,
  type CivetLspDiagnostic,
} from '../../../lsp/server/dist/worker.js';
import {
  forwardMap,
  type Position as SourcePosition,
  type SourcemapLines,
} from '@danielx/civet/ts-diagnostic';

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
  useMonaco?: boolean;
}>();

type PlaygroundLspClient = ReturnType<typeof createCivetLspWorkerClient> & {
  updateMarkers(): void;
};
type OutputCursor = {
  top: number;
  left: number;
  height: number;
  hover: boolean;
};

const userCode = ref(b64.decode(props.b64Code));
const compileError = ref<unknown>();
const inputHtml = ref('');
const outputHtml = ref('');
const sourceMapLines = ref<SourcemapLines>();
const outputSourceText = ref<string>();
const outputOffsetMap = ref<number[]>();
const inputHtmlEl = ref<HTMLDivElement>();
const outputHtmlEl = ref<HTMLDivElement>();
const textareaEl = ref<HTMLTextAreaElement>();
const monacoEl = ref<HTMLDivElement>();
const monacoReady = ref(false);
const outputCursor = ref<OutputCursor>();
const monacoHorizontalPadding = 18;
let monacoEditor: any;
let monacoModel: any;
let lspClient: PlaygroundLspClient | undefined;
let lspProviders: { dispose(): void } | undefined;

// Compile on input
onMounted(fixTextareaSize);
watch(userCode, async (code) => {
  if (monacoEditor && monacoEditor.getValue() !== code) {
    monacoEditor.setValue(code);
  }
  await codeChanged();
});

watch(ligatures, (enabled) => {
  monacoEditor?.updateOptions({ fontLigatures: enabled });
});

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

  if (props.useMonaco) {
    // Kick off Monaco loading while the textarea fallback remains active.
    void initMonaco().catch((error) => {
      console.error('Monaco failed to initialize', error);
    });
  }
});

onUnmounted(() => {
  lspClient?.dispose();
  lspProviders?.dispose();
  monacoEditor?.dispose();
  monacoModel?.dispose();
});

// Prettier toggle for full Playground
const showPrettier = props.showPrettier;
const prettier = ref(true);
watch(prettier, compile);

// TypeScript toggle for full Playground
const showTypescript = props.showTypescript;
const typescript = ref(true);
watch(typescript, compile);

const showTypeDiagnostics = ref(true);
const compileFatal = ref(false);
watch(showTypeDiagnostics, () => {
  lspClient?.updateMarkers();
});

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

  compileError.value = snippet.errors?.[0];
  compileFatal.value = snippet.fatal;
  inputHtml.value = snippet.inputHtml;
  sourceMapLines.value = snippet.sourceMapLines;
  outputSourceText.value = snippet.civetOutput;

  if (snippet.outputHtml) {
    outputHtml.value = snippet.outputHtml;
  }

  outputOffsetMap.value = snippet.prettierOutput
    ? buildFormattedOffsetMap(snippet.civetOutput ?? '', snippet.prettierOutput)
    : undefined;
  await nextTick();
  lspClient?.updateMarkers();
  fixTextareaSize();
  updateOutputCursorFromEditor();
}

async function initMonaco() {
  if (!monacoEl.value || monacoEditor) return;

  const [{ default: EditorWorker }, monaco] = await Promise.all([
    import('monaco-editor/esm/vs/editor/editor.worker?worker'),
    import('monaco-editor/esm/vs/editor/edcore.main.js'),
  ]);

  (globalThis as any).MonacoEnvironment ??= {
    getWorker: () => new EditorWorker(),
  };

  registerCivetLanguage(monaco);
  await registerCivetTextMateSyntax(monaco);

  const uri = monaco.Uri.parse('file:///workspace/index.civet');
  monacoModel = monaco.editor.getModel(uri) ??
    monaco.editor.createModel(userCode.value, 'civet', uri);
  if (monacoModel.getValue() !== userCode.value) {
    monacoModel.setValue(userCode.value);
  }

  monacoEditor = monaco.editor.create(monacoEl.value, {
    model: monacoModel,
    theme: 'civet-playground-dark',
    automaticLayout: true,
    folding: false,
    glyphMargin: false,
    minimap: { enabled: false },
    fontFamily: 'Fira Code, var(--vp-font-family-mono)',
    fontLigatures: ligatures.value,
    fontSize: 14,
    fixedOverflowWidgets: true,
    lineDecorationsWidth: monacoHorizontalPadding,
    lineHeight: 21,
    lineNumbers: 'off',
    lineNumbersMinChars: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerLanes: 0,
    tabSize: 2,
    insertSpaces: true,
    scrollBeyondLastLine: false,
    scrollbar: {
      vertical: 'hidden',
      handleMouseWheel: false,
      alwaysConsumeMouseWheel: false,
    },
    padding: { top: 16, bottom: 16 },
  });
  resizeMonacoEditor();
  monacoEditor.onDidContentSizeChange(resizeMonacoEditor);

  lspClient = createPlaygroundLspClient(monaco, uri.toString());
  lspClient.start(monacoModel.getValue()).then(() => {
    lspProviders?.dispose();
    lspProviders = registerCivetLspProviders(monaco, {
      uri: uri.toString(),
      client: lspClient!,
      model: monacoModel,
    });
  }).catch((error) => {
    console.error('Civet LSP failed to start', error);
  });

  monacoEditor.onDidChangeModelContent(() => {
    const code = monacoEditor.getValue();
    if (code !== userCode.value) {
      userCode.value = code;
    }
    lspClient?.change(code);
  });
  monacoEditor.onDidChangeCursorPosition((event: any) => {
    updateOutputCursor(event.position, false);
  });
  monacoEditor.onMouseMove((event: any) => {
    if (event.target.position) {
      updateOutputCursor(event.target.position, true);
    }
  });
  monacoEditor.onMouseLeave?.(() => {
    updateOutputCursorFromEditor();
  });
  monacoReady.value = true;
  await nextTick();
  updateOutputCursorFromEditor();
}

async function registerCivetTextMateSyntax(monaco: any) {
  const languages = monaco.languages as any;
  if (languages.__civetTextMateSyntaxRegistered) {
    return languages.__civetTextMateSyntaxRegistered;
  }

  languages.__civetTextMateSyntaxRegistered = (async () => {
    const [
      { createHighlighterCore },
      { createOnigurumaEngine },
      { shikiToMonaco, textmateThemeToMonacoTheme },
      wasm,
      { default: oneDarkPro },
      { default: civetGrammar },
    ] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/oniguruma'),
      import('@shikijs/monaco'),
      import('shiki/wasm'),
      import('shiki/themes/one-dark-pro.mjs'),
      import('../../../lsp/vscode/syntaxes/civet.json'),
    ]);

    const themeName = 'civet-playground-dark';
    const transparentEditorColors = {
      'editor.background': '#00000000',
      'editorGutter.background': '#00000000',
      'editorOverviewRuler.border': '#00000000',
    };
    const semanticTokenColors = {
      class: '#e5c07b',
      enum: '#e5c07b',
      enumMember: '#d19a66',
      function: '#61afef',
      interface: '#e5c07b',
      member: '#61afef',
      namespace: '#e5c07b',
      parameter: '#d19a66',
      property: '#e06c75',
      type: '#e5c07b',
      typeParameter: '#e5c07b',
      variable: '#e5c07b',
      'variable.local': '#abb2bf',
      comment: { foreground: '#7f848e', fontStyle: 'italic' },
    };
    const theme = {
      ...oneDarkPro,
      name: themeName,
      colors: {
        ...oneDarkPro.colors,
        ...transparentEditorColors,
      },
    };
    const highlighter = await createHighlighterCore({
      themes: [theme],
      langs: [{ ...civetGrammar, name: 'civet' }],
      engine: await createOnigurumaEngine(wasm),
    });

    shikiToMonaco(highlighter, monaco);
    const monacoTheme = textmateThemeToMonacoTheme(theme);
    monaco.editor.defineTheme(themeName, {
      ...monacoTheme,
      semanticHighlighting: true,
      colors: {
        ...monacoTheme.colors,
        ...transparentEditorColors,
      },
      semanticTokenColors,
    });
  })();

  return languages.__civetTextMateSyntaxRegistered;
}

function resizeMonacoEditor() {
  if (!monacoEl.value || !monacoEditor) return;

  const height = Math.max(monacoEditor.getContentHeight(), 84);
  monacoEl.value.style.height = `${height}px`;
  monacoEditor.layout({
    width: Math.max(monacoEl.value.clientWidth - monacoHorizontalPadding, 0),
    height,
  });
}

function createPlaygroundLspClient(monaco: any, uri: string) {
  const worker = createCivetLspWorker({
    civetUrl: new URL('@danielx/civet/browser.min', import.meta.url),
    serverUrl: new URL('../../../lsp/server/dist/browser.js', import.meta.url),
  });
  const client = createCivetLspWorkerClient({
    worker,
    uri,
    workspaceName: 'Playground',
  }) as PlaygroundLspClient;
  let diagnosticsCache: CivetLspDiagnostic[] = [];

  const updateMarkers = () => {
    const showTypes = showTypeDiagnostics.value && !compileFatal.value;
    const diagnostics = showTypes
      ? diagnosticsCache
      : diagnosticsCache.filter((diagnostic) => diagnostic.source !== 'typescript');
    monaco.editor.setModelMarkers(monacoModel, 'civet-lsp', diagnostics.map(toMarker));
  };

  client.onDiagnostics(({ diagnostics }) => {
    diagnosticsCache = diagnostics;
    updateMarkers();
  });

  const dispose = client.dispose;
  client.dispose = () => {
    monaco.editor.setModelMarkers(monacoModel, 'civet-lsp', []);
    dispose();
  };
  client.updateMarkers = updateMarkers;
  return client;

  function toMarker(diagnostic: CivetLspDiagnostic) {
    return {
      severity: diagnostic.severity === 1 ? monaco.MarkerSeverity.Error :
        diagnostic.severity === 2 ? monaco.MarkerSeverity.Warning :
        diagnostic.severity === 3 ? monaco.MarkerSeverity.Info :
        monaco.MarkerSeverity.Hint,
      message: diagnostic.message,
      source: diagnostic.source ?? 'civet',
      startLineNumber: diagnostic.range.start.line + 1,
      startColumn: diagnostic.range.start.character + 1,
      endLineNumber: diagnostic.range.end.line + 1,
      endColumn: diagnostic.range.end.character + 1,
    };
  }
}

function updateTextarea(
  textarea: HTMLTextAreaElement,
  value: string,
  selectionStart: number,
  selectionEnd = selectionStart
) {
  textarea.value = userCode.value = value
  textarea.setSelectionRange(selectionStart, selectionEnd)
}

function handleTextareaKeydown(event: KeyboardEvent) {
  const textarea = event.target as HTMLTextAreaElement | null
  if (!textarea) return

  // Escape exits the textarea to enable keyboard navigation via tab
  if (event.key === 'Escape') {
    textarea.blur()
    return
  }

  // Enable insertion and indentation by tab
  if (event.key !== 'Tab') return
  event.preventDefault()
  let {value, selectionStart, selectionEnd} = textarea

  // No selection
  if (selectionStart === selectionEnd) {
    if (event.shiftKey) {
      // Unindent current line
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
      if (value[lineStart] !== '\t') return
      updateTextarea(textarea,
        `${value.slice(0, lineStart)}${value.slice(lineStart + 1)}`,
        Math.max(lineStart, selectionStart - 1))
    } else {
      // Normal tab insertion
      updateTextarea(textarea,
        `${value.slice(0, selectionStart)}\t${value.slice(selectionStart)}`,
        selectionStart + 1)
    }
    return
  }

  // Multi-line indentation
  let index = value.lastIndexOf('\n', selectionStart - 1) + 1
  const lineStarts = [index]
  while (true) {
    index = value.indexOf('\n', index)
    if (index < 0 || index >= selectionEnd - 1) break
    index++
    lineStarts.push(index)
  }

  if (event.shiftKey) {
    // Shift-Tab dedents
    for (let i = lineStarts.length - 1; i >= 0; i--) {
      const position = lineStarts[i]
      if (value[position] !== '\t') continue
      value = `${value.slice(0, position)}${value.slice(position + 1)}`
      if (position < selectionStart) selectionStart--
      if (position < selectionEnd) selectionEnd--
    }
  } else {
    // Tab indents
    for (let i = lineStarts.length - 1; i >= 0; i--) {
      const position = lineStarts[i]
      value = `${value.slice(0, position)}\t${value.slice(position)}`
    }
    selectionStart +=
      lineStarts.filter(position => position < selectionStart).length
    selectionEnd +=
      lineStarts.filter(position => position < selectionEnd).length
  }
  updateTextarea(textarea, value, selectionStart, selectionEnd)
}

function fixTextareaSize() {
  if (!textareaEl.value || !inputHtmlEl.value) return;
  textareaEl.value.style.height = `${inputHtmlEl.value.clientHeight}px`;
  textareaEl.value.style.width = `${
    inputHtmlEl.value.querySelector('code')!.scrollWidth + 20
  }px`;
}

function updateOutputCursorFromEditor() {
  if (!monacoEditor) {
    outputCursor.value = undefined;
    return;
  }
  updateOutputCursor(monacoEditor.getPosition(), false);
}

function updateOutputCursor(
  position: { lineNumber: number; column: number } | null | undefined,
  hover: boolean
) {
  if (!position || !sourceMapLines.value) {
    outputCursor.value = undefined;
    return;
  }

  const generatedPosition = forwardMap(sourceMapLines.value, {
    line: position.lineNumber - 1,
    character: position.column - 1,
  });
  outputCursor.value = outputCursorForPosition(generatedPosition, hover);
}

// Convert a generated-code line/column into an absolute overlay position in
// the rendered Shiki output. The last code block is used so non-fatal compile
// errors can show their caret block before the generated TypeScript block.
function outputCursorForPosition(
  position: SourcePosition,
  hover: boolean
): OutputCursor | undefined {
  const output = outputHtmlEl.value;
  if (!output) return undefined;

  const codeBlocks = output.querySelectorAll('code');
  const code = codeBlocks[codeBlocks.length - 1];
  if (!code?.textContent) return undefined;

  const mappedCode = outputSourceText.value ?? code.textContent;
  let offset = offsetForPosition(mappedCode, position);
  if (offset === undefined) return undefined;
  offset = outputOffsetMap.value?.[offset] ?? offset;

  const rangeRect = textOffsetRect(code, offset);
  if (!rangeRect) return undefined;

  const outputRect = output.getBoundingClientRect();
  return {
    top: rangeRect.top - outputRect.top,
    left: rangeRect.left - outputRect.left,
    height: rangeRect.height || parseFloat(getComputedStyle(code).lineHeight),
    hover,
  };
}

function offsetForPosition(
  text: string,
  position: SourcePosition
): number | undefined {
  let offset = 0;
  for (let line = 0; line < position.line; line++) {
    const nextLine = text.indexOf('\n', offset);
    if (nextLine < 0) return undefined;
    offset = nextLine + 1;
  }

  const lineEnd = text.indexOf('\n', offset);
  const maxColumn = (lineEnd < 0 ? text.length : lineEnd) - offset;
  return offset + Math.min(position.character, Math.max(maxColumn, 0));
}

// Build a raw-generated-code offset -> formatted-output offset table once per
// compile. Prettier mostly preserves token order, so a lockstep resync handles
// nearby insertions/removals such as added whitespace or trailing commas.
function buildFormattedOffsetMap(source: string, formatted: string): number[] {
  const map: number[] = [];
  let sourceOffset = 0;
  let formattedOffset = 0;

  while (sourceOffset < source.length) {
    map[sourceOffset] = formattedOffset;

    if (formattedOffset >= formatted.length) {
      sourceOffset++;
      continue;
    }

    const sourceChar = source[sourceOffset];
    const formattedChar = formatted[formattedOffset];
    if (
      sourceChar === formattedChar ||
      isWhitespace(sourceChar) && isWhitespace(formattedChar)
    ) {
      sourceOffset++;
      formattedOffset++;
      continue;
    }

    if (isWhitespace(sourceChar)) {
      sourceOffset++;
      continue;
    }
    if (isWhitespace(formattedChar)) {
      formattedOffset++;
      continue;
    }

    const maxDistance = Math.max(
      source.length - sourceOffset,
      formatted.length - formattedOffset
    );
    let resynced = false;
    for (let distance = 1; distance <= maxDistance; distance++) {
      const nextFormattedOffset = formattedOffset + distance;
      if (formatted[nextFormattedOffset] === sourceChar) {
        formattedOffset = nextFormattedOffset;
        resynced = true;
        break;
      }

      const nextSourceOffset = sourceOffset + distance;
      if (source[nextSourceOffset] === formattedChar) {
        while (sourceOffset < nextSourceOffset) {
          map[sourceOffset] = formattedOffset;
          sourceOffset++;
        }
        resynced = true;
        break;
      }
    }
    if (resynced) {
      continue;
    }

    sourceOffset++;
    formattedOffset++;
  }

  map[source.length] = formatted.length;
  return map;
}

function isWhitespace(char: string | undefined): boolean {
  return Boolean(char && /\s/.test(char));
}

function textOffsetRect(element: Element, offset: number): DOMRect | undefined {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const length = node.data.length;
    if (remaining < length) {
      return textCaretRect(node, remaining);
    }
    remaining -= length;
  }

  if (offset === element.textContent?.length) {
    const lastText = lastTextNode(element);
    if (lastText) return textCaretRect(lastText, lastText.data.length);
  }
}

function lastTextNode(element: Element): Text | undefined {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let last: Text | undefined;
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    last = node;
  }
  return last;
}

function textCaretRect(node: Text, offset: number): DOMRect | undefined {
  const range = document.createRange();
  if (offset < node.data.length) {
    range.setStart(node, offset);
    range.setEnd(node, offset + 1);
    const nextRect = range.getBoundingClientRect();
    if (nextRect.width || nextRect.height) {
      return new DOMRect(nextRect.left, nextRect.top, 0, nextRect.height);
    }
  }

  if (offset > 0) {
    range.setStart(node, offset - 1);
    range.setEnd(node, offset);
    const previousRect = range.getBoundingClientRect();
    if (previousRect.width || previousRect.height) {
      return new DOMRect(
        previousRect.right,
        previousRect.top,
        0,
        previousRect.height
      );
    }
  }
}

let feedbackTimeout;
async function copyToClipboard(text: string, pointerEvent) {
  let success = false;
  try {
    await navigator.clipboard.writeText(text);
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
  if (monacoReady.value) {
    copyToClipboard(monacoEditor?.getValue() ?? userCode.value, pointerEvent);
  } else {
    copyToClipboard(inputHtmlEl.value?.textContent ?? '', pointerEvent);
  }
}
function copyOutputToClipboard(pointerEvent) {
  copyToClipboard(outputHtmlEl.value?.textContent ?? '', pointerEvent);
}

const playgroundUrl = computed(() => {
  return `/playground?code=${b64.encode(userCode.value)}`;
});
</script>

<template>
  <div v-if="props.compileAtStart && loading">Loading playground...</div>
  <div v-else :class="{ wrapper: true,  ligatures: ligatures}">
    <div
      :class="{ col: true, scroll: !monacoReady, 'col--monaco': monacoReady }"
      @click="monacoReady ? monacoEditor?.focus() : textareaEl?.focus()"
      style="tab-size: 4"
    >
      <div
        v-if="props.useMonaco"
        :class="{ code: true, 'code--monaco': true, 'code--monaco-loading': !monacoReady }"
        ref="monacoEl"
      >
      </div>

      <div v-if="!monacoReady" class="code code--user">
        <textarea
          :value="userCode"
          :onInput="(e: any) => (userCode = e.target.value)"
          @keydown="handleTextareaKeydown"
          ref="textareaEl"
          resize="false"
          spellcheck="false"
          class="textarea shiki one-dark-pro"
        />
      </div>

      <div v-if="!monacoReady" class="code code--input" ref="inputHtmlEl">
        <div v-if="inputHtml" v-html="inputHtml" />
        <slot v-else name="input" />
      </div>

      <div class="compilation-info">
        <span
          v-if="props.useMonaco && !monacoReady"
          class="monaco-loading"
          aria-label="Loading Monaco"
          title="Loading Monaco editor and diagnostics"
        />
        <label
          v-if="monacoReady"
          class="diagnostics-toggle"
          title="Show TypeScript type diagnostics"
        >
          <input type="checkbox" v-model="showTypeDiagnostics"/>
          Diagnostics
        </label>
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
        <span
          v-if="outputCursor"
          :class="{
            'output-cursor': true,
            'output-cursor--hover': outputCursor.hover,
          }"
          :style="{
            top: `${outputCursor.top}px`,
            left: `${outputCursor.left}px`,
            height: `${outputCursor.height}px`,
          }"
        />
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

.col--monaco {
  overflow: visible;
  z-index: 5;
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

.code--monaco {
  box-sizing: border-box;
  min-height: 84px;
  margin-bottom: 28px;
  padding-right: 18px;
  overflow: visible;
}

.code--monaco-loading {
  position: absolute;
  inset: 0;
  visibility: hidden;
  pointer-events: none;
}

.code--monaco :deep(.monaco-editor),
.code--monaco :deep(.monaco-editor-background),
.code--monaco :deep(.margin) {
  background: transparent !important;
}

.monaco-loading {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 8px;
  vertical-align: -2px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: monaco-loading-spin 0.8s linear infinite;
}

@keyframes monaco-loading-spin {
  to {
    transform: rotate(360deg);
  }
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

.diagnostics-toggle {
  margin-right: 8px;
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

.code--output {
  position: relative;
}

.code--output:deep(.playground-output-separator) {
  border: 0;
  border-top: 1px solid var(--vp-c-divider);
  margin: 0 18px;
}

.output-cursor {
  position: absolute;
  z-index: 3;
  width: 2px;
  min-height: 1em;
  pointer-events: none;
  background: var(--vp-c-green-2);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--vp-c-green-2) 35%, transparent);
  opacity: 0.9;
  transition: top 0.08s ease, left 0.08s ease, opacity 0.12s ease;
}

.output-cursor--hover {
  background: var(--vp-c-yellow-2);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--vp-c-yellow-2) 35%, transparent);
  opacity: 0.75;
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
