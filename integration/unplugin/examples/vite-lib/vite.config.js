import CivetPlugin from '../../dist/index.js';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.civet',
      fileName: 'main',
      formats: ['cjs', 'es'],
    },
  },
  plugins: [CivetPlugin.vite({ dts: true })],
});
