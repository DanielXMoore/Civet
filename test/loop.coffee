{testCase} = require "./helper"

describe "loop", ->
  testCase """
    basic
    ---
    loop
      x++
      break
    ---
    while(true) {
      x++;
      break;
    };
  """
