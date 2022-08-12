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

  testCase """
    method definition
    ---
    x =
      id()
        return 5
    ---
    x = {
      id() {
        return 5;
      },
    };
  """

  testCase """
    method get definition
    ---
    x =
      get id()
        return 5
    ---
    x = {
      get id() {
        return 5;
      },
    };
  """

  testCase """
    method set definition
    ---
    x =
      get set(v)
        return 5
    ---
    x = {
      get set(v) {
        return 5;
      },
    };
  """

  testCase """
    private method definition
    ---
    x =
      get #id()
        return 5
    ---
    x = {
      get #id() {
        return 5;
      },
    };
  """

  testCase """
    async method definition
    ---
    x =
      async x()
        return 5
    ---
    x = {
      async x() {
        return 5;
      },
    };
  """

  testCase """
    generator method definition
    ---
    x =
      *x()
        return 5
    ---
    x = {
      *x() {
        return 5;
      },
    };
  """

  testCase """
    async generator method definition
    ---
    x =
      async * x()
        return 5
    ---
    x = {
      async * x() {
        return 5;
      },
    };
  """
