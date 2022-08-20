{testCase} = require "./helper"

describe "is", ->
  testCase """
    converts is to ===
    ---
    a is b
    ---
    a === b;
  """
