---
title: 'Getting started'
---

# {{ $frontmatter.title }}

If you have now been convinced that Civet is right for your current/next project,
here is how to set up your environment to get productive right away and have a Good Time℠.

## Quick start

Try out the transpiler interactively in the
[Playground](/playground).

Or transpile Civet code interactively in the command-line REPL:

```sh
npx @danielx/civet -c
```

Or run Civet code directly in the command-line REPL:

```sh
npx @danielx/civet
```

## Installation

To install Civet package as a dev dependency in your project:

```sh
npm i -D @danielx/civet
```

For command-line usage outside `package.json` scripts,
it is also helpful to install Civet globally,
which enables a `civet` command-line interface:

```sh
npm i -g @danielx/civet
```

The instructions below assume such a global install;
if you do not want to, use `npx @danielx/civet` in place of `civet`.

To use TypeScript for type checking, create a `tsconfig.json` file. For example:

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "lib": ["es2021"],
    "moduleResolution": "nodenext",
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "esModuleInterop": true
  },
  "ts-node": {
    "transpileOnly": true,
    "compilerOptions": {
      "module": "ES2020"
    }
  }
}
```

## Executing code

Simple execution of a .civet source file (CommonJS or ESM):

```sh
civet source.civet ...args...
```

Directly execute a .civet CommonJS source file in Node:

```sh
node -r @danielx/civet/register source.civet ...args...
```

Directly execute a .civet ESM source file in Node:

```sh
node --loader @danielx/civet/esm source.civet ...args...
```

Directly execute a .civet or .ts source file that mixes .civet and .ts code,
using [ts-node](https://typestrong.org/ts-node/):

```sh
node --loader ts-node/esm --loader @danielx/civet/esm source.civet ...args...
```

## Transpilation

Simple compilation of one civet source file to TypeScript:

```sh
npx @danielx/civet < source.civet > output.ts
```

Compile several .civet source files to .civet.tsx (default extension):

```sh
civet -c *.civet
```

Compile several .civet source files to .js:

```sh
civet --js -c *.civet -o .js
```

To see all command-line options:

```sh
civet --help
```

To transpile within an ESM NodeJS app
(assuming `npm i -D @danielx/civet`):

```js
import {compile} from "@danielx/civet"
const tsCode = compile(civetCode)
const tsCodeWithSourceMap = compile(civetCode, {inlineMap: true})
const jsCode = compile(civetCode, {js: true})
```

To transpile within a CommonJS NodeJS app
(assuming `npm i -D @danielx/civet`):

```js
{compile} = require("@danielx/civet")
// rest as above
```

To transpile in the browser, you can load the browser build `dist/browser.js`
via a `<script>` tag, and access the global variable `Civet`, as in
`Civet.compile`.
Alternatively, if you're using a build system, you can import `"@danielx/civet"`
normally, but you'll need to mark `"fs"` as an external dependency
(see e.g. [esbuild instructions](https://esbuild.github.io/api/#external>)
and [Vite instructions](https://vitejs.dev/guide/build#library-mode)).

## Building a project

Use Civet's built-in [unplugin](https://github.com/DanielXMoore/Civet/blob/main/integration/unplugin) to integrate with many
bundlers: Vite, esbuild, Rollup, Webpack, or Rspack.  For example:

```js
import esbuild from 'esbuild'
import civetPlugin from '@danielx/civet/esbuild'

esbuild.build({
  // ...
  // sourcemap: true, // build and link sourcemap files
  plugins: [
    civetPlugin({
      // Options and their defaults:
      // emitDeclaration: false,         // generate .d.ts files?
      // implicitExtension: true,        // import "./x" checks for x.civet
      // outputExtension: '.tsx',        // appended to .civet in output
      // ts: 'civet',                    // TS -> JS transpilation mode
      // typecheck: false,               // check types via tsc
    })
  ]
}).catch(() => process.exit(1))
```

::: info
You can mix and match `.civet` files with `.js` and `.ts` files.
Even `.coffee` will work if you require `coffeescript/register` or add a loader for it.
:::

See the [unplugin documentation](https://github.com/DanielXMoore/Civet/blob/main/integration/unplugin) for more configurations,
including [full working examples](https://github.com/DanielXMoore/Civet/blob/main/integration/unplugin/examples).

These plugins should support metaframeworks built upon these bundlers.
For example, the Vite unplugin supports [Astro](https://astro.build/)
([full example](https://github.com/DanielXMoore/Civet/blob/main/integration/unplugin/examples/astro)),
and the esbuild unplugin supports [tsup](https://github.com/egoist/tsup):

```js
// tsup.config.ts
import { defineConfig } from 'tsup';
import civetPlugin from '@danielx/civet/esbuild';

export default defineConfig({
  entryPoints: ['main.civet'],
  esbuildPlugins: [
    civetPlugin({
      // options
    }),
  ],
});
```

---

If you want to use other bundlers, check out our [integrations page](/integrations) for a suitable plugin.
