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
    a b, c d
    ---
    x(y);
    x(y(z));
    x(y, z);
    a(b, c(d));
  """

  testCase """
    optional function
    ---
    x?.(y)
    x?(y)
    x? y
    ---
    x?.(y);
    x?.(y);
    x?.(y);
  """
