{testCase} = require "./helper"

describe "assignment operations", ->
  testCase """
    assignment
    ---
    a = b
    ---
    a = b;
  """

  testCase """
    mutation
    ---
    a += b
    a -= b
    ---
    a += b;
    a -= b;
  """

  testCase """
    allows newlines
    ---
    a =
    b
    ---
    a =
    b;
  """

  testCase """
    assign nested object
    ---
    const DefaultCompilerOptions =
      allowNonTsExtensions: true
      allowJs: true
      target: ts.ScriptTarget.Latest
      moduleResolution: ts.ModuleResolutionKind.NodeJs
      module: ts.ModuleKind.CommonJS
      allowSyntheticDefaultImports: true
      experimentalDecorators: true
    ---
    const DefaultCompilerOptions = {
      allowNonTsExtensions: true,
      allowJs: true,
      target: ts.ScriptTarget.Latest,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      module: ts.ModuleKind.CommonJS,
      allowSyntheticDefaultImports: true,
      experimentalDecorators: true,
    };
  """
