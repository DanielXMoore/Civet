//import type { AstroIntegration } from 'astro';
interface AstroIntegration {
  name: string,
  hooks: {
    "astro:config:setup": (data: { updateConfig: (config: unknown) => void }) => void
  }
}

import civetUnplugin, { type PluginOptions } from '.'

export default function(opts: PluginOptions = {}): AstroIntegration {
  return {
    name: "@danielx/civet",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [civetUnplugin.vite(opts)],
          }
        });
      },
    },
  };
}
