{testCase} = require "../helper"

describe "[TS] destructuring", ->
  # TODO: the double semi-colon should be fixed eventually
  testCase """
    basic
    ---
    const hello = ({ first, last }: Person) =>
      `Hello ${first} ${last}!`
    ---
    const hello = ({ first, last }: Person) =>
      `Hello ${first} ${last}!`;;
  """
