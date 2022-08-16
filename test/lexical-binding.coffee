{testCase} = require "./helper"

describe "lexical binding", ->
  testCase """
    let
    ---
    let x
    let x = 2
    ---
    let x;
    let x = 2;
  """

  testCase """
    array destructuring
    ---
    let [ x, y ] = a
    let [
      x
      y
    ] = a
    ---
    let [ x, y ] = a;
    let [
      x,
      y,
    ] = a;
  """

  testCase """
    array destructuring elision
    ---
    let [ ,,, y ] = a
    let [
      ,,,x
      y
    ] = a
    ---
    let [ ,,, y ] = a;
    let [
      ,,,x,
      y,
    ] = a;
  """

  testCase """
    BindingRestElement
    ---
    let [ x, ...y ] = a
    let [
      x
      ...y
    ] = a
    ---
    let [ x, ...y ] = a;
    let [
      x,
      ...y
    ] = a;
  """

  testCase """
    Nested array destructuring
    ---
    let [ [ x, ...y] ] = a
    let [
      [
        x
        ...y
      ]
    ] = a
    ---
    let [ [ x, ...y] ] = a;
    let [
      [
        x,
        ...y
      ],
    ] = a;
  """
