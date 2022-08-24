{testCase, throws} = require "./helper"

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
    one liner
    ---
    (x) -> x
    ---
    function(x) { x };
  """

  testCase """
    one liner keeps comments
    ---
    (/**/x) -> /**/x
    ---
    function(/**/x) { /**/x };
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

  testCase """
    return
    ---
    (x) ->
      return x
    ---
    function(x) {
      return x;
    };
  """

  it "doesn't allow import inside of function ", ->
    throws """
      (x) ->
        import * from 'x';
    """

  testCase """
    fat arrow
    ---
    () => x
    x => x
    ---
    () => x;
    x => x;
  """

  testCase """
    decs inside function
    ---
    function () {
      var x = 3
    }
    ---
    function () {
      var x = 3;
    };
  """

  testCase """
    return nested object
    ---
    config = ->
      return
        a: getA()
        b: getB()
    ---
    config = function() {
      return {
        a: getA(),
        b: getB(),
      };
    };
  """
