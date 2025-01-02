# Civet ESLint plugin

This plugin enables using [ESLint](https://eslint.org/)
(and optionally [typescript-eslint](https://typescript-eslint.io/))
directly on your `.civet` files.  Specifically, it provides a
[processor](https://eslint.org/docs/latest/use/configure/plugins#specify-a-processor)
for converting `.civet` files into TypeScript or JavaScript,
and provides some recommended rules for Civet code.

## Installation

Install the plugin, along with Civet, ESLint, and (optionally)
typescript-eslint if you haven't already:

```sh
npm install -D eslint-plugin-civet @danielx/civet eslint @eslint/js typescript-eslint
```

## Simple Usage with typescript-eslint

Here is a sample `eslint.config.mjs` (ESM mode):

```js
import civetPlugin from "eslint-plugin-civet/ts"

export default [
  // Rules from eslint.configs.recommended
  ...civetPlugin.configs.jsRecommended,
  // Rules from tseslint.configs.strict
  ...civetPlugin.configs.strict,
]
```

Here is a sample `eslint.config.cjs` (CJS mode):

```js
const civetPlugin = require("eslint-plugin-civet/ts")

module.exports = [
  // Rules from eslint.configs.recommended
  ...civetPlugin.configs.jsRecommended,
  // Rules from tseslint.configs.strict
  ...civetPlugin.configs.strict,
]
```

This will load the plugin, enable the processor for `*.civet` files,
and turn on eslint's recommended rules and typescript-eslint's strict rules.
Alternatively, change `configs.strict` to `configs.recommended` or another of
[typescript-eslint's available configurations](https://typescript-eslint.io/users/configs).

## Simple Usage with ESLint and JavaScript

If you'd rather not use typescript-eslint, and just want to
use ESLint to check your Civet code as JavaScript,
here is a sample `eslint.config.mjs` (ESM mode):

```js
import civetPlugin from "eslint-plugin-civet"

export default [
  ...civetPlugin.configs.recommended
]
```

Here is a sample `eslint.config.cjs` (CJS mode):

```js
module.exports = [
  ...require("eslint-plugin-civet").configs.recommended
]
```

This will load the plugin, enable the processor for `*.civet` files,
and turn on ESLint's recommended rules.  Alternatively, change
`configs.recommended` to `configs.all` to enable all of ESLint's rules.

## Complex Usage with ESLint and JavaScript

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
      civet: civetPlugin,
    },
    processor: "civet/civet",
    // Here is where you would override specific rules.
    // We provide an `overrides` rule set that disables rules that
    // don't work well with Civet output.
    ...civetPlugin.configs.overrides,
  },
]
```

## Civet Configuration

If you need to customize the Civet compiler's configuration
(beyond just `js: true` vs. `js: false`), `import { civet }`
from either `"eslint-plugin-civet"` or `"eslint-plugin-civet/ts"
(also available as `.civet` from the default import).
This function takes an options object for the Civet compiler,
and returns a plugin:

```js
import { civet } from "eslint-plugin-civet"
const civetPlugin = civet({
  parseOptions: {
    // coffeeCompat: true,
    // ...
  },
})
// rest as before
```

## Example

You can see a full working example in the [example](./example) directory.

## VS Code Configuration

The [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
needs to be configured to recognize Civet files.
Add the following setting to your `.vscode/settings.json`:

```json
{
  "eslint.validate": [
    "astro",
    "civet",
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "html",
    "mdx",
    "vue",
    "markdown",
    "json",
    "jsonc"
  ],
}
```

This list adds `"civet"` to
[the default for `eslint.probe`](https://github.com/microsoft/vscode-eslint/?tab=readme-ov-file#settings-options).
Alternatively, you can list fewer languages; just be sure to include `"civet"`.

Note that
[setting `eslint.validate` bypasses `eslint.probe`](https://github.com/microsoft/vscode-eslint/?tab=readme-ov-file#settings-options),
meaning that failed attempts to lint will now generate errors.
(The plugin's probe mechanism doesn't yet support Civet.)
