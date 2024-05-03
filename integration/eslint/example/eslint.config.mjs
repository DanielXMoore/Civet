//import civetPlugin from "eslint-plugin-civet"
import tsCivetPlugin from "eslint-plugin-civet/ts"
//import js from "@eslint/js"

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
