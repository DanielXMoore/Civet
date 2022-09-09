{testCase} = require "../helper"

describe "[TS] as", ->
  testCase """
    const assignment with type suffix
    ---
    x : U8 := 255
    ---
    const x : U8 = 255;
  """
