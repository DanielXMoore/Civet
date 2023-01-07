---
title: 'Getting started'
---

# {{ $frontmatter.title }}

If you have now been convinced that Civet is right for your current/next project,
here is how to set up your environment to get productive right away and have a Good Time℠.

## Quick start

Try out the transpiler interactively in the
[Playground](https://civet-web.vercel.app/).

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
  "ts-node": {
    "transpileOnly": true,
    "compilerOptions": {
      "module": "ES2020"
    }
  }
}
```

## Executing code

Simple execution of .civet source file without `import`s:

```sh
civet source.civet ...args...
```

Directly execute a .civet source file without `import`s in Node:

```sh
node -r @danielx/civet/register.js source.civet ...args...
```

Execute an ESM .civet source file with `import`s in Node using ts-node:

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

## Building a project

We strongly recommend using [esbuild](https://esbuild.github.io/) as your project bundler:

```js
import esbuild from 'esbuild'
import civetPlugin from '@danielx/civet/esbuild-plugin'

esbuild.build({
  // ...
  plugins: [
    civetPlugin
  ]
}).catch(() => process.exit(1))
```

::: info
You can also add `.js` and `.ts` extensions if you want to mix and match!
Even `.coffee` will work if you require `coffeescript/register` or add a loader for it.
:::

---

If you want to use other bundlers, check out our [integrations page](/integrations) for a suitable plugin.
