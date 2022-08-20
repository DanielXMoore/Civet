{testCase} = require "./helper"

describe "template literal", ->
  testCase """
    basic
    ---
    `abchidng`
    ---
    `abchidng`;
  """

  testCase """
    substitutions
    ---
    `abchidng${x}`
    ---
    `abchidng${x}`;
  """

  testCase """
    $$$
    ---
    `$$$`
    ---
    `$$$`;
  """

  testCase """
    escapes
    ---
    `\\${}\\``
    ---
    `\\${}\\``;
  """

  testCase """
    tagged
    ---
    x`yo`
    ---
    x`yo`;
  """
