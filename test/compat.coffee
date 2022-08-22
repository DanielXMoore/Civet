{testCase} = require "./helper"

describe "coffee compat", ->
  testCase """
    ==
    ---
    "use coffee-compat"
    a == b
    ---
    "use coffee-compat"
    a === b;
  """

  testCase """
    !=
    ---
    "use coffee-compat"
    a != b
    ---
    "use coffee-compat"
    a !== b;
  """
