import civetVitePlugin from '@danielx/civet/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.civet',
      fileName: 'main',
      formats: ['cjs', 'es'],
    },
  },
  plugins: [
    civetVitePlugin({
      ts: 'tsc',
      emitDeclaration: true,
      typecheck: true,
    })
  ],
});
