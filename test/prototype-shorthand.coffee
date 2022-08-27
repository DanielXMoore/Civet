{testCase} = require "./helper"

describe "prototype shorthand", ->
  testCase """
    without following identifier
    ---
    a::
    ---
    a.prototype;
  """

  testCase """
    with following identifier
    ---
    a::b
    ---
    a.prototype.b;
  """

  testCase """
    multiple
    ---
    a::::::
    ---
    a.prototype.prototype.prototype;
  """
