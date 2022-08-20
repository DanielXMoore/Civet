{testCase} = require "./helper"

describe "class", ->
  testCase """
    basic
    ---
    class X {}
    ---
    class X {};
  """

  testCase """
    private field
    ---
    class X {
      #p1 = 3
      #privateField
    }
    ---
    class X {
      #p1 = 3;
      #privateField;
    };
  """

  testCase """
    static block
    ---
    class X {
      static
        x = 1
    }
    ---
    class X {
      static {
        x = 1;
      };
    };
  """

  testCase """
    extends shorthand
    ---
    class A < B
      static
        x = 3
    ---
    class A extends B {
      static {
        x = 3;
      };
    };
  """

  testCase """
    extends with braces
    ---
    class A extends B {
      static
        x = 3
    }
    ---
    class A extends B {
      static {
        x = 3;
      };
    };
  """
