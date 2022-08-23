{testCase} = require "./helper"

describe "function application", ->
  testCase """
    basic
    ---
    f x
    ---
    f(x);
  """

  testCase """
    chained
    ---
    f(x)(7)
    ---
    f(x)(7);
  """

  testCase """
    arguments on separate lines
    ---
    const config2 = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      currentProjectPath,
      existingOptions,
      tsConfigPath,
      undefined,
    )
    ---
    const config2 = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      currentProjectPath,
      existingOptions,
      tsConfigPath,
      undefined,
    );
  """

  testCase """
    arguments on separate lines, optional commas
    ---
    const config2 = ts.parseJsonConfigFileContent(
      config
      ts.sys
      currentProjectPath,
      existingOptions
      tsConfigPath,
      undefined
    )
    ---
    const config2 = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      currentProjectPath,
      existingOptions,
      tsConfigPath,
      undefined,
    );
  """

  testCase """
    arguments on separate lines, multiple argumenns per line
    ---
    const config2 = ts.parseJsonConfigFileContent(
      config, ts.sys
      currentProjectPath,
      existingOptions
      tsConfigPath, undefined
    )
    ---
    const config2 = ts.parseJsonConfigFileContent(
      config, ts.sys,
      currentProjectPath,
      existingOptions,
      tsConfigPath, undefined,
    );
  """
