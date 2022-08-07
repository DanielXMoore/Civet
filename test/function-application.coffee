{testCase} = require "./helper"

describe "function application", ->
  testCase """
    basic
    ---
    f x
    ---
    f(x);
  """
