{testCase} = require "../helper"

describe "[TS] import", ->
  testCase """
    type
    ---
    import type {
      CompilerOptions
      LanguageServiceHost
    } from "typescript"
    ---
    import type {
      CompilerOptions,
      LanguageServiceHost,
    } from "typescript";
  """
