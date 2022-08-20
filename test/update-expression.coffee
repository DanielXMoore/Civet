{testCase} = require "./helper"

describe "update expression", ->
  testCase """
    postfix ++
    ---
    x++
    ---
    x++;
  """

  testCase """
    postfix --
    ---
    x--
    ---
    x--;
  """

  testCase """
    prefix ++
    ---
    ++x
    ---
    ++x;
  """

  testCase """
    prefix --
    ---
    --x
    ---
    --x;
  """
