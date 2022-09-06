{testCase} = require "../helper"

# TODO
describe.skip "[TS] non null assertion", ->
  testCase """
    !
    ---
    meta!.sourcemap = sm.srcMap(fileName)
    ---
    meta!.sourcemap = sm.srcMap(fileName);
  """
