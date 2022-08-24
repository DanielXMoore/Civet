{testCase} = require "../helper"

describe "[TS] as", ->
  testCase """
    type as
    ---
    var x = "yo" as B
    ---
    var x = "yo" as B;
  """
