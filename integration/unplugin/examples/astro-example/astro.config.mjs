import { defineConfig } from 'astro/config';
import CivetPlugin from '../../dist/index.mjs';

import solidJs from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [CivetPlugin.vite({})],
  },
  integrations: [solidJs()],
});
