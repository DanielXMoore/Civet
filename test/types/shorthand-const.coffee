{testCase} = require "../helper"

describe "[TS] shortand const", ->
  testCase """
    works with types
    ---
    x : string := y
    ---
    const x : string = y;
  """
