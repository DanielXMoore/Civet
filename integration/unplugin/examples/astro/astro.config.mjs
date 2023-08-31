import { defineConfig } from 'astro/config';
import civetVitePlugin from '@danielx/civet/vite';

import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [civetVitePlugin({})],
  },
  integrations: [solidJs()],
});
