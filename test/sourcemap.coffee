{parse} = require "../source/parser"
{prune} = generate = require "../source/generate"

{locationTable, lookupLineColumn, Sourcemap} = require "../source/util"

assert = require "assert"

describe "source map", ->
  it "should generate a source mapping", ->
    src = """
      x := a + 3
      y++

      y = x + a
    """

    sm = Sourcemap src

    ast = prune parse src

    table = locationTable src

    assert.deepEqual lookupLineColumn(table, 11), [1, 0]

    code = generate ast,
      updateSourceMap: sm.updateSourceMap

    srcMapJSON = sm.srcMap("yo.civet", "yo.ts")

    # console.log src, code

    # console.dir ast,
    #   depth: null

    # console.dir sm.data,
    #   depth: 8

    base64Encode = (src) ->
      Buffer.from(src).toString('base64')

    # console.log "#{code}\n//# sourceMappingURL=data:application/json;base64,#{base64Encode JSON.stringify(srcMapJSON)}"
