{testCase} = require "./helper"

describe "array", ->
  testCase """
    empty literal
    ---
    []
    ---
    [];
  """

  testCase """
    spread
    ---
    y = [...x]
    ---
    y = [...x];
  """

  testCase """
    elision
    ---
    [ , , , ,,, ,,, ,, ,]
    ---
    [ , , , ,,, ,,, ,, ,];
  """

  testCase """
    elision keeps comments
    ---
    [ , ,/*  ea*/ , ,,, ,/**/,, ,, ,]
    ---
    [ , ,/*  ea*/ , ,,, ,/**/,, ,, ,];
  """

  testCase """
    inline assignment
    ---
    [x=y]
    ---
    [x=y];
  """

  testCase """
    kitchen sink
    ---
    [ , ,/*  ea*/ , ,x=y,...z, ,/**/,, ,, ,]
    ---
    [ , ,/*  ea*/ , ,x=y,...z, ,/**/,, ,, ,];
  """
