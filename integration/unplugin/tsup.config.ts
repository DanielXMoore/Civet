import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/*.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  platform: 'node',
  clean: true
});
