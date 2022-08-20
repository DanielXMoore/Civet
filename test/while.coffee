{testCase} = require "./helper"

describe "while", ->
  testCase """
    basic
    ---
    while (x < 3)
      x++
    ---
    while (x < 3) {
      x++;
    };
  """

  testCase """
    optional parens
    ---
    while x < 3
      x++
    ---
    while (x < 3) {
      x++;
    };
  """
