{testCase} = require "./helper"

describe "for", ->
  testCase """
    basic
    ---
    for (var i = 0; i < 10; i++) console.log(i)
    ---
    for (var i = 0; i < 10; i++) console.log(i);
  """

  testCase """
    in
    ---
    for (var i in x) console.log(i)
    ---
    for (var i in x) console.log(i);
  """

  testCase """
    in optional parens
    ---
    for var i in x
      console.log(i)
    ---
    for (var i in x) {
      console.log(i);
    };
  """

  testCase """
    of
    ---
    for (var i of x) console.log(i)
    ---
    for (var i of x) console.log(i);
  """

  testCase """
    of optional parens
    ---
    for var i of x
      console.log(i)
    ---
    for (var i of x) {
      console.log(i);
    };
  """

  testCase """
    of non-dec
    ---
    for (i of x) {
      console.log(i)
    }
    ---
    for (i of x) {
      console.log(i);
    };
  """

  testCase """
    of optional parens await
    ---
    for await var i of x
      console.log(i)
    ---
    for await (var i of x) {
      console.log(i);
    };
  """
