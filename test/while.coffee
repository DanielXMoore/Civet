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

  testCase """
    variable that starts with while isn't interpreted as block
    ---
    while2
    x
    ---
    while2;
    x;
  """
