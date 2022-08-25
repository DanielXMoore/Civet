{testCase, throws} = require "./helper"

describe "regexp", ->
  testCase """
    flags
    ---
    /abc/suy
    ---
    /abc/suy;
  """

  testCase """
    escapes
    ---
    /\u200C/
    ---
    /\u200C/;
  """

  testCase """
    classes
    ---
    /[ab]/
    ---
    /[ab]/;
  """

  testCase """
    space plus
    ---
    / +/
    ---
    / +/;
  """

  it "throws when regexp is actually unclosed comment", ->
    throws """
      /*/
    """
