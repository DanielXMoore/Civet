{testCase} = require "./helper"

describe "function", ->
  # TODO: var f, return x
  testCase """
    basic
    ---
    f = (x) ->
      x
    ---
    f = function(x) {
      x;
    };
  """

  testCase """
    empty parameters
    ---
    ->
      x
    ---
    function() {
      x;
    };
  """


  testCase """
    longhand
    ---
    function()
      x
    ---
    function() {
      x;
    };
  """
