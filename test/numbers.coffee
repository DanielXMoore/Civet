{testCase} = require "./helper"

describe "Civet", ->
  testCase """
    floats
    ---
    x = -3.12
    ---
    x = -3.12;
  """

  testCase """
    hex
    ---
    x = 0xff
    ---
    x = 0xff;
  """

  testCase """
    hex _
    ---
    x = 0xffff_ffff
    ---
    x = 0xffff_ffff;
  """

  testCase """
    big integer
    ---
    x = 0n
    x = 123_456n
    ---
    x = 0n;
    x = 123_456n;
  """
