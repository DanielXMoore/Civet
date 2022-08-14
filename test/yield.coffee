{testCase} = require "./helper"

describe "yield expression", ->
  testCase """
    basic
    ---
    yield x
    ---
    yield x;
  """

  testCase """
    repeated
    ---
    yield yield x
    ---
    yield yield x;
  """
