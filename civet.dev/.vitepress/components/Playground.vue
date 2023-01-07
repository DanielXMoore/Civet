<template>
  <div class="codes">
    <div class="code">
      <slot name="input" />
    </div>
    <div class="code">
      <slot name="output" />
    </div>
  </div>
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
  padding: 0 18px;
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
