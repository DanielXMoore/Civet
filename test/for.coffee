{testCase} = require "./helper"

describe "for", ->
  testCase """
    basic
    ---
    for (var i = 0; i < 10; i++) console.log(i)
    ---
    for (var i = 0; i < 10; i++) console.log(i);
  """
