import civetPlugin from "@danielx/civet/eslint"
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
