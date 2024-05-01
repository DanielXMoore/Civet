# Civet ESLint plugin

This plugin enables using [ESLint](https://eslint.org/) directly on your
`.civet` files.  Specifically, it provides a
[processor](https://eslint.org/docs/latest/use/configure/plugins#specify-a-processor)
for converting `.civet` files into `.js`, and provides some
recommended rulesets for Civet code.

Note: Currently the plugin compiles to JavaScript, not TypeScript,
so you cannot check for TypeScript-specific linting errors.

## Installation

Install the plugin, along with ESLint and Civet if you haven't already:

```sh
npm install -D eslint @eslint/js eslint-plugin-civet @danielx/civet
```

## Simple Usage

Here is a sample `eslint.config.mjs` (ESM mode):

```js
import civetPlugin from "eslint-plugin-civet"

export default [
  civetPlugin.configs.recommended
]
```

Here is a sample `eslint.config.cjs` (CJS mode):

```js
module.exports = [
  require("eslint-plugin-civet").configs.recommended
]
```

This will load the plugin, enable the processor for `*.civet` files,
and turn on ESLint's recommended rules.  Alternatively, change
`configs.recommended` to `configs.all` to enable all of ESLint's rules.

## Complex Usage

Here is a sample `eslint.config.mjs` that more explicitly configures
behavior for `.civet` files and otherwise:

```js
import civetPlugin from "eslint-plugin-civet"
import js from "@eslint/js"

export default [
  // Enable recommended rules for all files
  js.configs.recommended,
  // Load plugin and enable processor for .civet files
  {
    files: ["**/*.civet"],
    plugins: {
      civet: civetPlugin
    },
    processor: "civet/civet",
    // Here is where you would override specific rules.
    // We provide an `overrides` rule set that disables rules that
    // don't work well with Civet output.
    ...civetPlugin.configs.overrides
  }
]
```
