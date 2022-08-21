{testCase, throws} = require "./helper"

describe "conditional expression", ->
  testCase """
    basic
    ---
    x ? y : z
    ---
    x ? y : z;
  """

  it "needs space before ?", ->
    throws """
      x? y : z
    """
