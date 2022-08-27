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
    (x) => x
    ---
    () => x;
    (x) => x;
  """

  testCase """
    fat arrow nested body
    ---
    x = =>
      x x
    ---
    x = () =>
      x(x);
  """

  testCase """
    fat interprets single arg without parens as function application
    ---
    x =>
      5
    ---
    x(() =>
      5);
  """

  testCase """
    fat arrow nested body with multiple statements
    ---
    x = =>
      x x
      a
      b
    ---
    x = () =>
      x(x);
      a;
      b;
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
    return nested braceless object
    ---
    config = ->
      return
        a: x
        b: y
    ---
    config = function() {
      return {
        a: x,
        b: y,
      };
    };
  """

  testCase """
    return nested braceless object with methods
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
