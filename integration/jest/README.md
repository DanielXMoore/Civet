# civet-jest

`civet-jest` is a [Jest transformer](https://jestjs.io/docs/code-transformation)
for automatically transpiling [Civet](https://civet.dev/) code into JavaScript
when testing via [Jest](https://jestjs.io/).

It does not yet support chaining with
[babel-jest](https://github.com/jestjs/jest/tree/main/packages/babel-jest),
so JSX is not supported.

## Usage

### Installation

1. Install Civet if you haven't already: `npm install -D @danielx/civet`
2. Install this plugin: `npm install -D civet-jest`

### Configuration

Edit your `jest.config.*` file to define the transform and allow the `.civet`
file extension.  Here is an complete example `jest.config.mjs`:

```js
import {defaults} from 'jest-config'

export default {
  extensionsToTreatAsEsm: [ '.civet' ],
  moduleFileExtensions: [ ...defaults.moduleFileExtensions, 'civet' ],
  testMatch: [ '<rootDir>/test/**/*.civet' ],
  transform: {
    '\\.civet': 'civet-jest',
  },
  verbose: true,
}
```

This directory has a similar [`jest.config.mjs`](jest.config.mjs)
that enables local testing via `yarn test`.

### package.json script

In CommonJS mode, you should be able to just use:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

In [ESM mode](https://jestjs.io/docs/ecmascript-modules),
you need something like this:

```json
{
  "scripts": {
    "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest"
  }
}
```

This directory has a similar [`package.json`](package.json)
that enables local testing via `yarn test`.
