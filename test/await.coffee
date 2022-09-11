{testCase} = require "./helper"

describe "await expression", ->
  testCase """
    basic
    ---
    await x
    ---
    await x;
  """

  testCase """
    repeated
    ---
    await await x
    ---
    await await x;
  """
