assert = require "assert"
{compile} = require "../../source/main"

describe "Types", ->
  describe "JS", ->
    it "omits types in JS mode", ->
      js = compile """
        interface User {
          name: string
          id: number
        }

        const u : User = z
      """, js: true

      assert.equal js, """
        ;

        const u = z;
      """
