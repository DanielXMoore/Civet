import { compile } from "./main.mjs"

export default function (api) {
  return {
    parserOverride(code, opts, parse) {
      const src = opts.sourceFileName.endsWith(".civet") ? compile(code) : code
      const ast = parse(src, opts)
      return ast
    }
  }
}
