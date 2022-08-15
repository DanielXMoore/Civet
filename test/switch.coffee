{testCase} = require "./helper"

describe "switch", ->
  testCase """
    basic
    ---
    switch (x) {
      case 1:
        break
    }
    ---
    switch (x) {
      case 1:
        break
    };
  """

  testCase """
    optional parens
    ---
    switch x {
      case 1:
        break
    }
    ---
    switch (x) {
      case 1:
        break
    };
  """
