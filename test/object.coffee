{testCase, throws} = require "./helper"

describe "object", ->
  testCase """
    empty literal
    ---
    {}
    ---
    {};
  """

  testCase """
    basic
    ---
    a = {x: 1, y: 2}
    ---
    a = {x: 1, y: 2};
  """

  testCase """
    spread
    ---
    y = {...x}
    ---
    y = {...x};
  """

  testCase """
    keeps comments
    ---
    { /**/ x}
    ---
    { /**/ x};
  """

  testCase """
    spread
    ---
    { ...x }
    ---
    { ...x };
  """

  it "doesn't allow bare assignments inside", ->
    throws """
      {x=y}
    """

    throws """
      {x+=y}
    """

    throws """
      {x-=y}
    """

    throws """
      {x<=y}
    """

  testCase """
    allows for extra newlines and whitespace with braces
    ---
    x = {
      a:
              4
    }
    ---
    x = {
      a:
              4
    };
  """

  testCase """
    nested object syntax
    ---
    x =
      a: 1
      b: 2
      c:
        d: "a"
        e: "b"
    ---
    x = {
      a: 1,
      b: 2,
      c: {
        d: "a",
        e: "b",
      },
    };
  """
