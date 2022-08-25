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
    keys are not reserved
    ---
    a =
      if: "cool"
      case: 1
    ---
    a = {
      if: "cool",
      case: 1,
    };
  """

  testCase """
    spread
    ---
    y = {...x}
    ---
    y = {...x};
  """

  it "single line literal", ->
    throws """
      a: b
    """

  it "multi line unnested literal", ->
    throws """
      a: b
      b: c
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

  # describe.only "", ->
  testCase """
    optional commas
    ---
    x = {
      a
      b,
      c
    }
    ---
    x = {
      a,
      b,
      c,
    };
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
              4,
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
    expression in values
    ---
    x =
      a: getA()
      b: getB()
    ---
    x = {
      a: getA(),
      b: getB(),
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
      set id(v)
        @id = v
    ---
    x = {
      set id(v) {
        this.id = v;
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

  testCase """
    shorthand key value notation
    ---
    return {
      x: ->
        y
      options
      z: ->
        "y"
    }
    ---
    return {
      x: function() {
        y;
      },
      options,
      z: function() {
        "y";
      },
    };
  """

  testCase """
    identifiers that start with get/set
    ---
    return {
      getx: -> x
      sety: (y) -> @y = y
    }
    ---
    return {
      getx: function() { x },
      sety: function(y) { this.y = y },
    };
  """

  testCase """
    shorthand key value notation
    ---
    return {
      getCompilationSettings: ->
        options
      getSourceFile
      getDefaultLibFileName: ->
        "lib.d.ts"
    }
    ---
    return {
      getCompilationSettings: function() {
        options;
      },
      getSourceFile,
      getDefaultLibFileName: function() {
        "lib.d.ts";
      },
    };
  """
