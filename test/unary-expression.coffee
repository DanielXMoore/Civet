{testCase} = require "./helper"

describe "unary expression", ->
  testCase """
    delete
    ---
    delete x.y
    ---
    delete x.y;
  """

  testCase """
    void
    ---
    void x
    ---
    void x;
  """

  testCase """
    typeof
    ---
    typeof x
    ---
    typeof x;
  """
