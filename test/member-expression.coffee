{testCase} = require "./helper"

describe "member expression", ->
  testCase """
    new.target
    ---
    new.target
    ---
    new.target;
  """

  testCase """
    import.meta
    ---
    import.meta
    ---
    import.meta;
  """
