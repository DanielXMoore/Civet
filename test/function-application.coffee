{testCase} = require "./helper"

describe "function application", ->
  testCase """
    basic
    ---
    f x
    ---
    f(x);
  """

  testCase """
    chained
    ---
    f(x)(7)
    ---
    f(x)(7);
  """
