import civetVitePlugin from '@danielx/civet/vite';
import { defineConfig } from 'vite';

const civet = civetVitePlugin({
  ts: "preserve"
});

export default defineConfig({
  plugins: [civet],
  worker: {
    plugins: () => [civet],
  },
});
