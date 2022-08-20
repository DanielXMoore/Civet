{testCase} = require "./helper"

describe "do", ->
  testCase """
    basic
    ---
    do
      console.log(i++)
    while (i < 10)
    ---
    do {
      console.log(i++);
    }
    while (i < 10);
  """

  testCase """
    optional parens
    ---
    do
      console.log(i++)
    while i < 10
    ---
    do {
      console.log(i++);
    }
    while (i < 10);
  """
