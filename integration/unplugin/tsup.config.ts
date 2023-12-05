import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: {
    unplugin: 'src/index.ts',
    webpack: 'src/webpack.ts',
    vite: 'src/vite.ts',
    rollup: 'src/rollup.ts',
    esbuild: 'src/esbuild.ts',
  },
  esbuildOptions(opts) {
    opts.chunkNames = 'unplugin-shared';
  },
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  platform: 'node',
  clean: true,
  external: [
    '@danielx/civet',
    'typescript',
    '@typescript/vfs',
    'unplugin',
    'esbuild',
  ],
});
