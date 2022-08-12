{testCase} = require "./helper"

describe "comment", ->
  testCase """
    keeps comments as written
    ---
    // Hi
    ---
    // Hi
  """

  testCase """
    keeps comments at beginning and end of file
    ---
    // Hi
    x
    /* bye */
    ---
    // Hi
    x;
    /* bye */
  """
