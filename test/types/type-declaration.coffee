{testCase} = require "../helper"

describe "[TS] type declaration", ->
  testCase """
    simple
    ---
    type x = Y
    ---
    type x = Y;
  """

  testCase """
    type parameters
    ---
    type Z<X, Y> = Array<X>
    ---
    type Z<X, Y> = Array<X>;
  """

  testCase """
    binary ops
    ---
    type A = B | C
    ---
    type A = B | C;
  """

  testCase """
    multiple ops
    ---
    type X = B | C | D
    type Y = B & C | D
    ---
    type X = B | C | D;
    type Y = B & C | D;
  """

  testCase """
    typeof
    ---
    const data = [1, 2, 3]
    type Data = typeof data
    ---
    const data = [1, 2, 3];
    type Data = typeof data;
  """
