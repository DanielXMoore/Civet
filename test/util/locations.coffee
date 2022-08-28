assert = require "assert"
{locationTable, lookupLineColumn} = require "../../source/util"

describe "util", ->
  describe "locationTable", ->
    it.only "should create a table to map positions to line/column", ->
      text = """
        1 2 3
        4 5 6
        7 8 9
      """

      table = locationTable(text)

      assert.equal table[0], 6 # "1 2 3\n".length
      assert.equal table[1], 12
      assert.equal table[2], 17 # no trailing newline in input
      assert.equal table.length, 3

      assert.deepEqual lookupLineColumn(table, 0), [0, 0]
      assert.deepEqual lookupLineColumn(table, 6), [1, 0]
      assert.deepEqual lookupLineColumn(table, 12), [2, 0]
      assert.deepEqual lookupLineColumn(table, 17), [3, 0]
