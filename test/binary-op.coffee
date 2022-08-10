{testCase} = require "./helper"

describe "binary operations", ->
  testCase """
    bitwise shift
    ---
    a << b
    a >> b
    a >>> b
    ---
    a << b;
    a >> b;
    a >>> b;
  """

  testCase """
    multiplicative
    ---
    a * b
    a / b
    a % b
    ---
    a * b;
    a / b;
    a % b;
  """

  testCase """
    additive
    ---
    a + b
    a - b
    ---
    a + b;
    a - b;
  """

  testCase """
    relational
    ---
    a < b
    a > b
    a <= b
    a >= b
    a == b
    a === b
    a != b
    a !== b
    ---
    a < b;
    a > b;
    a <= b;
    a >= b;
    a == b;
    a === b;
    a != b;
    a !== b;
  """

  testCase """
    bitwise
    ---
    a | b
    a & b
    a ^ b
    ---
    a | b;
    a & b;
    a ^ b;
  """

  testCase """
    logical
    ---
    a || b
    a or b
    a && b
    a and b
    a ?? b
    ---
    a || b;
    a || b;
    a && b;
    a && b;
    a ?? b;
  """
