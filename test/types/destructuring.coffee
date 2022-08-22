{testCase} = require "../helper"

describe "[TS] destructuring", ->
  testCase """
    basic
    ---
    const hello = ({ first, last }: Person) =>
      `Hello ${first} ${last}!`
    ---
    const hello = ({ first, last }: Person) =>
      `Hello ${first} ${last}!`;
  """
