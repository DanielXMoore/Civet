// civetlint will use eslint.config.civet, not this file.
// We provide this in case you want copy/pastable JavaScript configuration,
// e.g. if you're using eslint directly instead of civetlint.

//import civetPlugin from "eslint-plugin-civet"
import tsCivetPlugin from "eslint-plugin-civet/ts"
//import js from "@eslint/js"

console.log("Using eslint.config.mjs")

export default [
  //--- Simple version, TypeScript:
  ...tsCivetPlugin.configs.jsRecommended,
  ...tsCivetPlugin.configs.recommended,
  ...tsCivetPlugin.configs.stylistic,
  //--- Simple version, JavaScript:
  //...civetPlugin.configs.recommended,
  //--- Longer version (for customization, JavaScript only):
  //js.configs.recommended,
  //{
  //  files: ["**/*.civet"],
  //  plugins: {
  //    civet: civetPlugin
  //    //civet: civetPlugin.civet(options)
  //  },
  //  processor: "civet/civet",
  //  ...civetPlugin.configs.overrides
  //}
]
