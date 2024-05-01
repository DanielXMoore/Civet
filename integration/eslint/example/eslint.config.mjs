import civetPlugin from "eslint-plugin-civet"
import js from "@eslint/js"

export default [
  js.configs.recommended,
  {
    files: ["**/*.civet"],
    plugins: {
      civet: civetPlugin
    },
    processor: "civet/civet"
  }
]
