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
    // sourcemap: true, // build and link sourcemap files
    plugins: [civetEsbuildPlugin()],
  })
  .catch(() => process.exit(1));
```

### Webpack

```js
const civetWebpackPlugin = require('@danielx/civet/webpack').default;

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
  emitDeclaration?: boolean;
  outputExtension?: string;
  ts?: 'civet' | 'esbuild' | 'tsc' | 'preserve';
  typecheck?: boolean;
  transformOutput?: (
    code: string,
    id: string
  ) => TransformResult | Promise<TransformResult>;
}
```

- `emitDeclaration`: Whether to generate `.d.ts` type definition files from the Civet source, which is useful for building libraries. Default: `false` (Requires installing `typescript`)
- `typecheck`: Whether to run type checking on the generated code. Default: `false`.
- `outputExtension`: Output filename extension to use. Default: `".civet.tsx"`, or uses `".civet.jsx"` if `js` is `true`.
- `ts`: Mode of transpilation of TS->JS source code. Default: `"civet"`. Options:
  - `civet`: Use Civet's JS mode (Not all TS features supported)
  - `esbuild`: Use esbuild's transpiler (Requires installing `"esbuild"`)
  - `tsc`: Use the typescript compiler (Requires installing `"typescript"`)
  - `preserve`: Don't transpile TS code (Some bundlers like esbuild and vite can handle TS directly. Note that this would require additional plugins for bundlers that can't handle TS)
- `transformOutput(code, id)`: Adds a custom transformer over jsx/tsx code produced by `civet.compile`. It gets passed the jsx/tsx source (`code`) and filename (`id`), and should return valid jsx/tsx code.
