{testCase} = require "./helper"

describe "if", ->
  testCase """
    if
    ---
    if (true) {
      return false
    }
    ---
    if (true) {
      return false;
    };
  """

  testCase """
    else
    ---
    if (true) {
      return false
    } else {
      return true
    }
    ---
    if (true) {
      return false;
    } else {
      return true;
    };
  """

  testCase """
    no parens
    ---
    if true
      return false
    ---
    if (true) {
      return false;
    };
  """

  testCase """
    no parens else
    ---
    if true
      return false
    else
      return
    ---
    if (true) {
      return false;
    }
    else {
      return;
    };
  """

  testCase """
    weird spacing
    ---
    if (true) 5
    else 3
    ---
    if (true) 5
    else 3;
  """

  testCase """
    unless
    ---
    unless x
      return y
    ---
    if (!(x)) {
      return y;
    };
  """

  testCase """
    unless more complex exp
    ---
    unless x + z
      return y
    ---
    if (!(x + z)) {
      return y;
    };
  """
