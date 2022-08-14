{testCase} = require "./helper"

describe "call-expression", ->
  testCase """
    parens
    ---
    x(y)
    ---
    x(y);
  """

  testCase """
    space args
    ---
    x y
    x y z
    x y, z
    ---
    x(y);
    x(y(z));
    x(y, z);
  """
