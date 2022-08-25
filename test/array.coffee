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
    optional commas
    ---
    [
      a
      b,
      c
    ]
    ---
    [
      a,
      b,
      c,
    ];
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

  testCase """
    multi-objects
    ---
    const data = [
    {
        key: 1,
        value: "Some label"

        },
        {
        key: 2,
        value: "Another label"
        },
    ];
    ---
    const data = [
    {
        key: 1,
        value: "Some label"

        },
        {
        key: 2,
        value: "Another label"
        },
    ];
  """
