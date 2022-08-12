{testCase} = require "./helper"

describe "object", ->
  testCase """
    empty literal
    ---
    {}
    ---
    {};
  """

  testCase """
    spread
    ---
    y = {...x}
    ---
    y = {...x};
  """

  testCase """
    keeps comments
    ---
    { /**/ x}
    ---
    { /**/ x};
  """
