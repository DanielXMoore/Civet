// @ts-nocheck
/**
 * Civet grammar for tree-sitter, extending TypeScript.
 *
 * Key Civet additions over TypeScript:
 *  - @    shorthand for `this.` / `this`  (Civet uses @@ for decorators)
 *  - @@   decorator (TypeScript uses @ but Civet repurposes that for this)
 *  - |>   pipe operator
 *  - ->   thin arrow
 *  - unless / until  control flow keywords
 *  - ..  / ...  inclusive/exclusive range literals
 *  - ###  block comment (coffee-style)
 */

// @ts-ignore
const TypeScript = require('tree-sitter-typescript/typescript/grammar');

module.exports = grammar(TypeScript, {
  name: 'civet',

  extras: ($, previous) => [
    ...previous,
    $.hash_comment,
  ],

  conflicts: ($, previous) => previous.concat([
    [$.await_expression, $.range_expression],
  ]),

  rules: {
    // -----------------------------------------------------------------------
    // # and ### comments (CoffeeScript-style)
    // -----------------------------------------------------------------------

    hash_comment: _ => token(
      // ### block comment ###  (coffee-compat mode also allows # line comments,
      // but standard Civet only has ### block comments)
      seq('###', /[^#]*(?:#[^#][^#]*|##[^#][^#]*)*/, '###'),
    ),

    // -----------------------------------------------------------------------
    // @@ decorator (Civet repurposes @ for this-shorthand)
    // -----------------------------------------------------------------------

    decorator: $ => seq(
      '@@',
      choice(
        $.identifier,
        alias($.decorator_member_expression, $.member_expression),
        alias($.decorator_call_expression, $.call_expression),
        alias($.decorator_parenthesized_expression, $.parenthesized_expression),
      ),
    ),

    // -----------------------------------------------------------------------
    // @ shorthand for `this` / `this.foo`
    // -----------------------------------------------------------------------

    at_expression: $ => prec(15, choice(
      // @foo  →  this.foo
      seq('@', alias($.identifier, $.property_identifier)),
      // @  →  this (standalone)
      '@',
    )),

    primary_expression: ($, previous) => choice(
      previous,
      $.at_expression,
    ),

    // -----------------------------------------------------------------------
    // |> pipe operator
    // -----------------------------------------------------------------------

    pipe_expression: $ => prec.left('binary', seq(
      field('left', $.expression),
      '|>',
      field('right', $.expression),
    )),

    // -----------------------------------------------------------------------
    // Range expressions:  lo..hi  (inclusive)  lo...hi  (exclusive)
    // -----------------------------------------------------------------------

    range_expression: $ => prec.left(10, seq(
      field('from', $.expression),
      field('operator', choice('..', '...')),
      field('to', $.expression),
    )),

    // -----------------------------------------------------------------------
    // unless / until
    // -----------------------------------------------------------------------

    unless_statement: $ => prec.right(1, seq(
      'unless',
      field('condition', $.parenthesized_expression),
      field('body', $.statement),
      field('alternative', optional($.else_clause)),
    )),

    until_statement: $ => prec(1, seq(
      'until',
      field('condition', $.parenthesized_expression),
      field('body', $.statement),
    )),

    // -----------------------------------------------------------------------
    // Thin arrow ->
    // -----------------------------------------------------------------------

    arrow_function: ($, previous) => choice(
      previous,
      prec(-1, seq(
        field('parameters', choice(
          $.identifier,
          $._destructuring_pattern,
          $.formal_parameters,
        )),
        '->',
        field('body', choice($.expression, $.statement_block)),
      )),
    ),

    // -----------------------------------------------------------------------
    // Extended rules
    // -----------------------------------------------------------------------

    expression: ($, previous) => choice(
      previous,
      $.pipe_expression,
      $.range_expression,
    ),

    statement: ($, previous) => choice(
      previous,
      $.unless_statement,
      $.until_statement,
    ),

  },
});
