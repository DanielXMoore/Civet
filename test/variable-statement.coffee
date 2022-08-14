{testCase, throws} = require "./helper"

describe "variable statement", ->
  testCase """
    var
    ---
    var x
    var x = 3
    ---
    var x;
    var x = 3;
  """
