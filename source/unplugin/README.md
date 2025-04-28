# unplugin-civet

Use Civet in your projects bundled with Vite, Webpack, Rspack, Rollup, or esbuild, with `.d.ts` generation support.

## Usage

The only setup required is adding the plugin to your bundler's config.
Jump to:

* [Vite](#vite)
* [ESBuild](#esbuild)
* [Astro](#astro)
* [Farm](#farm)
* [Rolldown](#rolldown)
* [Rollup](#rollup)
* [Webpack](#webpack)

You probably also want to pass in [options](#options).

### Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import civetVitePlugin from '@danielx/civet/vite'

export default defineConfig({
  // ...
  plugins: [
    civetVitePlugin({
      // options
    }),
  ],
})
```

To use Civet files as Web Workers, you can use
[Vite's `?worker` query suffix](https://vite.dev/guide/features.html#import-with-query-suffixes):

```ts
import MyWorker from './worker.civet?worker'
```

If you use
[Vite's constructor syntax](https://vitejs.dev/guide/features.html#import-with-constructors),
you need to add a `.tsx` extension like so:

```ts
worker = new Worker(new URL('./worker.civet.tsx', import.meta.url))
//or
worker = new Worker(new URL('./worker.civet.tsx', import.meta.url), { type: 'module' })
```

You'll also need to pass the `civetVitePlugin` via the
[`worker.plugins` option](https://vitejs.dev/config/worker-options#worker-plugins):

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import civetVitePlugin from '@danielx/civet/vite'

export default defineConfig({
  // ...
  plugins: [
    civetVitePlugin({
      // options
    }),
  ],
  worker: {
    plugins: () => [
      civetVitePlugin({
        // options
      }),
    ],
    // format: "es",  // if using { type: 'module' }
  },
})
```

### ESBuild

```ts
import esbuild from 'esbuild'
import civetEsbuildPlugin from '@danielx/civet/esbuild'

esbuild
  .build({
    // ...
    // sourcemap: true, // build and link sourcemap files
    plugins: [civetEsbuildPlugin()],
  })
  .catch(() => process.exit(1));
```

### Astro

```ts
// astro.config.ts
import { defineConfig } from 'astro/config'
import civet from '@danielx/civet/astro'

// https://astro.build/config
export default defineConfig({
  // ...
  integrations: [
    civet({
      // options
    }),
  ],
})
```

To use Civet files as Web Workers, see the [Vite directions](#vite) above.
You'll also need to import and pass the Civet Vite plugin via the
[`vite.worker.plugins` option](https://vitejs.dev/config/worker-options#worker-plugins):

```ts
// astro.config.ts
import { defineConfig } from 'astro/config'
import civet from '@danielx/civet/astro'
import civetVitePlugin from '@danielx/civet/vite'

// https://astro.build/config
export default defineConfig({
  // ...
  integrations: [
    civet({
      // options
    }),
  ],
  vite: {
    worker: {
      plugins: () => [
        civetVitePlugin({
          // options
        }),
      ],
      // format: "es",  // if using { type: 'module' }
    },
  },
})
```

### Farm

```ts
// farm.config.ts
import { defineConfig } from '@farmfe/core'
import civetFarmPlugin from '@danielx/civet/farm'

export default defineConfig({
  // ...
  plugins: [
    civetFarmPlugin({
      // options
    })
  ],
})
```

### Rolldown

```ts
// rolldown.config.ts
import { defineConfig } from 'rolldown'
import civetRolldownPlugin from '@danielx/civet/rolldown'

export default defineConfig({
  // ...
  plugins: [
    civetRolldownPlugin({
      // options
    }),
  ],
})
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
}
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
  emitDeclaration?: boolean
  declarationExtesion?: string
  implicitExtension?: boolean
  outputExtension?: string
  ts?: 'civet' | 'esbuild' | 'tsc' | 'preserve'
  typecheck?: boolean | string
  cache?: boolean
  config?: string | false | null
  parseOptions?: {
    comptime?: boolean
    coffeeCompat?: boolean
    // ... any other Civet configuration option
  }
  transformOutput?: (
    code: string,
    id: string
  ) => TransformResult | Promise<TransformResult>
}
```

- `emitDeclaration`: Whether to generate `.d.ts` type definition files from the Civet source, which is useful for building libraries. Default: `false`. (Requires installing `typescript`.)
- `declarationExtension`: Output filename extension for `.d.ts` files. Default: `".civet.d.ts"`.
- `typecheck`: Whether to run type checking on the generated code. (Requires installing `typescript`.) Default: `false`.
  - Specifying `true` aborts the build (with an error code) on TypeScript errors.
  - Alternatively, you can specify a string with any combination of `error`, `warning`, `suggestion`, or `message` to specify which diagnostics abort the build. For example, `"none"` ignores all diagnostics, `"error+warning"` aborts on errors and warnings, and `"all"` aborts on all diagnostics.
- `implicitExtension`: Whether to allow importing `filename.civet` via `import "filename"`. Default: `true`.
  - *Note*: Incompatible with `typecheck: true` (TypeScript needs an explicit `.civet` extension)
- `outputExtension`: JavaScript or TypeScript extension to append to `.civet` for internal purposes. Default: `".jsx"`, or `".tsx"` if `ts` is `"preserve"`.
- `ts`: Mode for transpiling TypeScript features into JavaScript. Default: `"civet"`. Options:
  - `"civet"`: Use Civet's JS mode. (Not all TS features supported.)
  - `"esbuild"`: Use esbuild's transpiler. (Fast and more complete. Requires installing `esbuild`.)
  - `"tsc"`: Use the TypeScript compiler. (Slow but complete. Requires installing `typescript`.)
  - `"preserve"`: Don't transpile TS code.
    Some bundlers, like esbuild and Vite, can handle TS directly. Also useful when using `transformOutput` to handle TS code, or using a plugin that modifies TS AST.
    Note that some bundlers require additional plugins to handle TS.
    For example, for Webpack, you would need to install `ts-loader` and add it to your webpack config.
    Unfortunately, Rollup's TypeScript plugin is incompatible with this plugin, so you need to set `ts` to another option.
- `cache`: Cache compilation results based on file's mtime.
  Useful when bundling the same source files for both CommonJS and ESM,
  or for longer running processes like `watch` or `serve`.  Default: `true`.
  Be sure to re-use plugins instead of calling the plugin generator repeatedly.
- `threads`: Use specified number of Node worker threads to
  compile Civet files faster. Default: `0` (don't use threads), or `CIVET_THREADS` environment variable if set.
- `config`: Civet config filename to load, or `false`/`null` to avoid looking
  for the default config filenames in the project root directory.
  See [Civet config](https://civet.dev/config).
- `parseOptions`: Options object to pass to the Civet parser,
  like adding `"civet"` directives to all files.  Default: `{}`.
  These options override any options specified in a
  [config file](https://civet.dev/config).
  Notably, unlike config files, you can specify the following option:
  - `comptime`: Whether to evaluate
    [`comptime` blocks](https://civet.dev/reference#comptime-blocks)
    at compile time.  Default: `false`.
- `transformOutput(code, id)`: Adds a custom transformer over jsx/tsx code produced by `civet.compile`. It gets passed the jsx/tsx source (`code`) and filename (`id`), and should return valid jsx/tsx code.

## Examples

See also [full examples of unplugin](../../integration/unplugin-examples)
in Astro, esbuild, NextJS, Farm, Rolldown, Rollup, Vite, and Webpack.
