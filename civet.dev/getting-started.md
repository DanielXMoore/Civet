---
title: 'Getting started'
---

# {{ $frontmatter.title }}

Now that you're convinced Civet is right for your current/next project,
here is how to set up your environment to get productive right away and have a Good Time℠.
[Cue&nbsp;the&nbsp;music](https://suno.com/song/55ffcf58-339a-4961-a285-0fbe685885f7)! 🎧

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

If you use VSCode, install the
[Civet VSCode extension](https://marketplace.visualstudio.com/items?itemName=DanielX.civet).
You will get best results if you also disable the built-in TypeScript extension.

To use TypeScript for type checking
(which the VSCode plugin does automatically),
create a `tsconfig.json` file. For example:

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "preserve",
    "lib": ["es2021"],
    "moduleResolution": "bundler",
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "esModuleInterop": true
  },
  "ts-node": {
    "transpileOnly": true,
    "compilerOptions": {
      "module": "nodenext"
    }
  }
}
```

If you do not set
[`strict: true`](https://www.typescriptlang.org/tsconfig#strict), we recommend
at least setting
[`noImplicitAny: true`](https://www.typescriptlang.org/tsconfig#noImplicitAny);
otherwise, Civet's generated code sometimes introduces unexpected `any` types.

## Executing code

Simple execution of a .civet source file (CommonJS or ESM):

```sh
civet source.civet ...args...
```

Directly execute a .civet CommonJS or ESM source file in Node:

```sh
node --import @danielx/civet/register source.civet ...args...
```

On Node <20.6.0, you also need to specify `--loader @danielx/civet/esm`
for ESM `import` of .civet files.

Directly execute a .civet or .ts source file that mixes .civet and .ts code,
using [ts-node](https://typestrong.org/ts-node/):

```sh
node --loader ts-node/esm --loader @danielx/civet/esm source.civet ...args...
```

## Transpilation

Simple compilation of one .civet source file to TypeScript:

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
const tsCode = await compile(civetCode)
const tsCodeWithSourceMap = await compile(civetCode, {inlineMap: true})
const jsCode = await compile(civetCode, {js: true})
```

To transpile within a CommonJS NodeJS app
(assuming `npm i -D @danielx/civet`):

```js
{compile} = require("@danielx/civet")
// rest as above
```

If you need compilation to be synchronous, pass in the `sync: true` option.
This will disable certain features with `comptime`.

To transpile in the browser, you can load the browser build `dist/browser.js`
via a `<script>` tag, and access the global variable `Civet`, as in
`Civet.compile`.
Alternatively, if you're using a build system, you can import `"@danielx/civet"`
normally, but you'll need to mark `"fs"` as an external dependency
(see e.g. [esbuild instructions](https://esbuild.github.io/api/#external>)
and [Vite instructions](https://vitejs.dev/guide/build#library-mode)).

See the
[API types](https://github.com/DanielXMoore/Civet/blob/main/types/types.d.ts)
for more details about the Civet API.

## Typechecking

You can ask Civet to run TypeScript to check for type errors in your Civet code
(the analog of `tsc`):

```sh
civet --typecheck
```

This command returns an error code if there are any type errors,
so you can use it in an NPM script and in CI.

Alternatively, you can typecheck just specific files:

```sh
civet --typecheck new.civet
```

You can typecheck and generate JavaScript/TypeScript files at the same time.
This could be a good NPM `build` script, for example.
Note that JavaScript/TypeScript files will be generated
even if there are type errors.

```sh
civet -c --typecheck src/**/*.civet
```

You can also use TypeScript to generate `.d.ts` declaration files
(if there are no type errors):

```sh
civet --emit-declaration
civet --emit-declaration src/**/*.civet
```

## Building a project

Use Civet's built-in [unplugin](https://github.com/DanielXMoore/Civet/blob/main/source/unplugin) to integrate with many
bundlers: Vite, esbuild, Astro, Rollup, Webpack, or Rspack.  For example:

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
      // declarationExtension: '.civet.d.ts', // extension for .d.ts files
      // implicitExtension: true,        // import "./x" checks for x.civet
      // outputExtension: '.tsx',        // appended to .civet internally
      // ts: 'civet',                    // TS -> JS transpilation mode
      // typecheck: false,               // check types via tsc
      // cache: false,                   // Cache compilation results based on mtime, useful for watch
      // config: null,                   // Civet config filename; null to skip
      // parseOptions: {                 // directives to apply globally
      //   comptime: false,              // evaluate comptime blocks
      // },
    })
  ]
}).catch(() => process.exit(1))
```

::: info
You can mix and match `.civet` files with `.js` and `.ts` files.
Even `.coffee` will work if you require `coffeescript/register` or add a loader for it.
:::

See the [unplugin documentation](https://github.com/DanielXMoore/Civet/blob/main/source/unplugin) for more configurations,
including [full working examples](https://github.com/DanielXMoore/Civet/blob/main/integration/unplugin-examples).

These plugins should support metaframeworks built upon these bundlers.
For example, the esbuild unplugin supports [tsup](https://github.com/egoist/tsup):

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
