import civetPlugin from "eslint-plugin-civet"
import js from "@eslint/js"

export default [
  //--- Simple version:
  //civetPlugin.configs.recommended
  //--- Longer version (easier to customize):
  js.configs.recommended,
  {
    files: ["**/*.civet"],
    plugins: {
      civet: civetPlugin
    },
    processor: "civet/civet",
    ...civetPlugin.configs.overrides
  }
]
