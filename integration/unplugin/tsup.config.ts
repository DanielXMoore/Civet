import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: {
    unplugin: 'src/index.ts',
    webpack: 'src/webpack.ts',
    vite: 'src/vite.ts',
    rollup: 'src/rollup.ts',
    esbuild: 'src/esbuild.ts',
  },
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  platform: 'node',
  clean: true,
});
