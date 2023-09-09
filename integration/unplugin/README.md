# unplugin-civet

Use Civet in your projects with Vite, Webpack, Rspack, Rollup and esbuild, with `dts` generation supported.

## Usage

The only setup required is adding it your bundler's config:

### Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import civetVitePlugin from '@danielx/civet/vite';

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
import civetRollupPlugin from '@danielx/civet/rollup';

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
import civetEsbuildPlugin from '@danielx/civet/esbuild';

esbuild
  .build({
    // ...
    plugins: [civetEsbuildPlugin()],
  })
  .catch(() => process.exit(1));
```

### Webpack

```js
const civetWebpackPlugin = require('@danielx/civet/webpack');

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
  typecheck?: boolean;
  transformOutput?: (
    code: string,
    id: string
  ) => TransformResult | Promise<TransformResult>;
}
```

- `dts`: Whether to generate `.d.ts` type definition files from the Civet source, which is useful for building libraries. Default: `false`
- `typecheck`: Whether to run type checking on the generated code. Default: `false`.
- `outputExtension`: Output filename extension to use. Default: `.civet.tsx`, or uses `.civet.jsx` if `js` is `true`.
- `js`: Whether to transpile to JS or TS. Default: `false`.
- `transformOutput(code, id)`: Adds a custom transformer over jsx/tsx code produced by `civet.compile`. It gets passed the jsx/tsx source (`code`) and filename (`id`), and should return valid jsx/tsx code.
