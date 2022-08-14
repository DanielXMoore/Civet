{testCase} = require "./helper"

describe "lexical binding", ->
  testCase """
    let
    ---
    let x
    let x = 2
    ---
    let x;
    let x = 2;
  """
