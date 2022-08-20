{testCase} = require "./helper"

describe "block statement", ->
  testCase """
    block
    ---
    {
      let x = 3
    }
    ---
    {
      let x = 3;
    };
  """
