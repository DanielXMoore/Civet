{testCase} = require "./helper"

describe "export", ->
  testCase """
    default
    ---
    export default x
    ---
    export default x;
  """

  testCase """
    const
    ---
    export const x = 3
    ---
    export const x = 3;
  """

  testCase """
    named
    ---
    export {}
    export {a}
    export {a,}
    export {a, b, c}
    ---
    export {};
    export {a};
    export {a,};
    export {a, b, c};
  """

  testCase """
    from
    ---
    export * from "./cool.js"
    ---
    export * from "./cool.js";
  """

  testCase """
    from as
    ---
    export * as x from "./cool.js"
    ---
    export * as x from "./cool.js";
  """
