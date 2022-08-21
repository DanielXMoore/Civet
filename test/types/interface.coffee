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
