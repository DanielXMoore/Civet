{testCase} = require "./helper"

describe "Civet", ->
  testCase """
    parse
    ---
    x = 3
    f = 2
    ---
    x = 3;
    f = 2;
  """

  testCase """
    import
    ---
    import {x} from "./y"
    ---
    import {x} from "./y";
  """
