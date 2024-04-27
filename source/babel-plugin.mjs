// Babel plugin for compiling .civet files

/* Example babel.config.json:

{
  "plugins": [
    [
      "@danielx/civet/babel-plugin"
    ]
  ],
  "sourceMaps": "inline"
}

*/

import { compile } from "./main.mjs"

export default function (api, civetOptions) {
  return {
    parserOverride(code, opts, parse) {
      let src
      if (opts.sourceFileName.endsWith(".civet")) {
        const config = {
          ...civetOptions,
          filename: opts.sourceFileName,
          sourceMap: false,
          sync: true, // parserOverride API is synchronous
        }

        config.inlineMap ??= true
        config.js = true
        src = compile(code, config)
      } else {
        src = code
      }

      const ast = parse(src, opts)
      return ast
    }
  }
}
