{testCase} = require "./helper"

describe "existential", ->
  # v1.1 remove unnecessary parens
  testCase """
    default
    ---
    a?
    ---
    ((a) != null);
  """
