{testCase} = require "./helper"

describe "@ -> this", ->
  testCase """
    @
    ---
    @
    ---
    this;
  """

  testCase """
    @id
    ---
    @id
    ---
    this.id;
  """

  testCase """
    @[]
    ---
    @[x]
    ---
    this[x];
  """

  testCase """
    private
    ---
    @#id
    ---
    this.#id;
  """
