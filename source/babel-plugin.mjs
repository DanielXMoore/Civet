import { compile } from "./main.mjs"

export default function (api, civetOptions) {
  return {
    parserOverride(code, opts, parse) {
      let src
      if (opts.sourceFileName.endsWith(".civet")) {
        const config = Object.assign({}, civetOptions, {
          filename: opts.sourceFileName,
          sourceMap: opts.sourceMaps ?? true,
        })

        if (config.sourceMap) {
          ({ code: src } = compile(code, config))
        } else {
          src = compile(code, config)
        }
      } else {
        src = code
      }
      const ast = parse(src, opts)
      return ast
    }
  }
}
