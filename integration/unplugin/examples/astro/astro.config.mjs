import { defineConfig } from 'astro/config';
import civet from '@danielx/civet/astro';

import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  integrations: [
    civet({
      ts: 'preserve',
    }),
    solidJs(),
  ],
});
