{testCase} = require "./helper"

describe "optional chain", ->
  testCase """
    same as JS
    ---
    a?.b
    a?.[b]
    a?.(b)
    ---
    a?.b;
    a?.[b];
    a?.(b);
  """

  testCase """
    array shorthand
    ---
    a?[b]
    ---
    a?.[b];
  """

  testCase """
    function shorthand
    ---
    a? b
    a?(b)
    ---
    a?.(b);
    a?.(b);
  """
