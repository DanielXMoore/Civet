{testCase} = require "../helper"

describe "[TS] function", ->
  testCase """
    has types
    ---
    const x = (a: number, b: number) : number ->
      return a + b
    ---
    const x = function(a: number, b: number) : number {
      return a + b;
    };
  """

  testCase """
    optional parameter
    ---
    const x = (a: number, b?: number) : number ->
      return a + b
    ---
    const x = function(a: number, b?: number) : number {
      return a + b;
    };
  """
