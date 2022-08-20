{testCase} = require "./helper"

describe "shebang", ->
  testCase """
    keeps it at the top
    ---
    #! /usr/bin/env node
    ---
    #! /usr/bin/env node
  """
