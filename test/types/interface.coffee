{testCase} = require "../helper"

describe "[TS] interface", ->
  testCase """
    basic
    ---
    interface User {
      name: string;
      id: number;
    }
    ---
    interface User {
      name: string;
      id: number;
    };
  """

  testCase """
    nested syntax
    ---
    interface User
      name: string
      id: number
    ---
    interface User {
      name: string;
      id: number;
    };
  """

  testCase """
    nested nested syntax
    ---
    interface User
      name:
        first: string
        last: string
      id: number
    ---
    interface User {
      name: {
        first: string;
        last: string;
      };
      id: number;
    };
  """
