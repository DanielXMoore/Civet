{testCase} = require "./helper"

describe "assignment operations", ->
  testCase """
    assignment
    ---
    a = b
    ---
    a = b;
  """

  testCase """
    mutation
    ---
    a += b
    a -= b
    ---
    a += b;
    a -= b;
  """

  testCase """
    allows newlines
    ---
    a =
    b
    ---
    a =
    b;
  """
