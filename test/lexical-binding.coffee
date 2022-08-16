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

  testCase """
    object destructuring
    ---
    let { x, y } = a
    let {
      x
      y
    } = a
    ---
    let { x, y } = a;
    let {
      x,
      y,
    } = a;
  """

  testCase """
    empty object destructuring
    ---
    let { } = a
    ---
    let { } = a;
  """

  testCase """
    simple object destructuring as
    ---
    let {x: y} = a
    ---
    let {x: y} = a;
  """

  testCase """
    object rest
    ---
    let { z, ...x } = a
    ---
    let { z, ...x } = a;
  """

  testCase """
    kitchen sink
    ---
    let {
      x
      y
      z=[1, 2, 3]
      p: [
        v
        vv
        {vvv: b}
      ]
      ...q
    } = a
    ---
    let {
      x,
      y,
      z=[1, 2, 3],
      p: [
        v,
        vv,
        {vvv: b},
      ],
      ...q
    } = a;
  """
