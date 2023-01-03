---
title: 'Getting started'
---

# {{ $frontmatter.title }}

If You have now been convinced that Civet is right for your current/next project.
Here is how to set up your environment to get productive right away and have a Good Time℠.

## Installation

Install Civet package:

```sh
npm i -D @danielx/civet
```

Create `tsconfig.json` file:

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

## Building files

Simple compile civet source file to TypeScript:

```sh
npx civet < source.civet > output.ts
```

Execute a civet source file in node using ts-node:

```sh
node --loader ts-node/esm --loader @danielx/civet/esm source.civet
```

## Building a project

We strongly recommend to use [esBuild](https://esbuild.github.io/) as Your project bundler:

```js
import esbuild from 'esbuild'
import civetPlugin from '@danielx/civet/esbuild-plugin'

esbuild.build({
  ...,
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

If you want to use other bundlers, check out our [integrations page](/integrations) for suitable plugin.
