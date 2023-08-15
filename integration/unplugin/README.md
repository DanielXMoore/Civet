# unplugin-civet

Use Civet in your projects with Vite, Webpack, Rspack, Rollup and esbuild, with `dts` generation supported.

## Usage

The only setup required is to install the plugin and adding it your bundler's config:

```bash
npm i -D unplugin-civet
```

### Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import civetVitePlugin from 'unplugin-civet/vite';

export default defineConfig({
  // ...
  plugins: [
    civetVitePlugin({
      // options
    }),
  ],
});
```

### Rollup

```ts
// rollup.config.ts
import civetRollupPlugin from 'unplugin-civet/rollup';

export default {
  // ...
  plugins: [
    civetRollupPlugin({
      // options
    }),
  ],
};
```

### ESBuild

```ts
import esbuild from 'esbuild';
import civetEsbuildPlugin from 'unplugin-civet/esbuild';

esbuild
  .build({
    // ...
    plugins: [civetEsbuildPlugin()],
  })
  .catch(() => process.exit(1));
```

### Webpack

```js
const civetWebpackPlugin = require('unplugin-civet/webpack');

module.exports = {
  // ...
  plugins: [
    civetWebpackPlugin({
      // options
    }),
  ],
};
```

## Options

```ts
interface PluginOptions {
  dts?: boolean;
  outputExtension?: string;
  js?: boolean;
  transformOutput?: (
    code: string,
    id: string
  ) => TransformResult | Promise<TransformResult>;
}
```

- `dts`: `unplugin-civet` also supports generating `.d.ts` type definition files from the civet source, which is useful for building libraries.
- `outputExtension`: Output filename extension to use. Default: `.civet.jsx`, or `.civet.tsx` if `js` is `false`.
- `js`: Whether to transpile to JS or TS.
- `transformOutput`: Replace the `civet.compile` tranformer with a custom transformer. It gets passed the civet source and filename, and should return valid TS/JS code.
