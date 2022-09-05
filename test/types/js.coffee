assert = require "assert"
{compile} = require "../../source/main"

describe "Types", ->
  describe "JS", ->
    it "omits interface declarations in JS mode", ->
      js = compile """
        interface User {
          name: string
          id: number
        }
      """, js: true

      assert.equal js, """
        ;
      """

    it "omits 'as' in JS mode", ->
      js = compile """
        x := 3 as ID
      """, js: true

      assert.equal js, """
        const x = 3;
      """

    it "omits type suffix in JS mode", ->
      js = compile """
        const items: DocumentSymbol[] = []
      """, js: true

      assert.equal js, """
        const items = [];
      """
