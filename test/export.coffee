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

  testCase """
    optional comma
    ---
    export {
      a
      b,
      c
      d }
    ---
    export {
      a,
      b,
      c,
      d };
  """

  testCase """
    optional comma as
    ---
    export {
      a as A
      b as B,
      c as C
      d as D}
    ---
    export {
      a as A,
      b as B,
      c as C,
      d as D};
  """

  testCase """
    maintains comments and whitespace
    ---
    /**/ export /**/ { // cool
      a as /**/ A /**/ // ahoy
      /**/b as B, // ye
         /**/c as C // hey
      d as D /**/} // yo
    ---
    /**/ export /**/ { // cool
      a as /**/ A, /**/ // ahoy
      /**/b as B, // ye
         /**/c as C, // hey
      d as D /**/}; // yo
  """
