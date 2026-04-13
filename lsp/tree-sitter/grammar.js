// @ts-nocheck
/**
 * Minimal Civet tree-sitter grammar for syntax highlighting.
 *
 * Covers all token types needed for Zed/editors without inheriting the full
 * 300k-line TypeScript parser. Handles:
 *   strings, template literals, comments (// /* ### ), numbers, identifiers,
 *   keywords, type keywords, builtins, operators, and Civet-specific syntax
 *   (@  @@  |>  ..  ...  ->  :=  unless  until).
 */

module.exports = grammar({
  name: 'civet',

  // Lets tree-sitter distinguish keywords from identifiers at word boundaries.
  word: $ => $.identifier,

  extras: $ => [/\s+/],

  // When 'function'/'class' is followed by an identifier, both function_declaration
  // / class_declaration and a plain keyword+identifier are valid parses.
  // Declare the ambiguity so tree-sitter uses GLR and prefers the declaration form.
  conflicts: $ => [
    [$.function_declaration, $.keyword],
    [$.class_declaration, $.keyword],
  ],

  rules: {
    program: $ => repeat($._item),

    _item: $ => choice(
      $.line_comment,
      $.block_comment,
      $.hash_comment,
      $.string,
      $.template_string,
      $.number,
      $.private_identifier,
      $.decorator,
      $.at_expression,
      $.function_declaration,
      $.class_declaration,
      $.keyword,
      $.type_keyword,
      $.constant,
      $.identifier,
      $.operator,
      $.punctuation,
    ),

    // ── Comments ─────────────────────────────────────────────────────────────

    line_comment: _ => token(seq('//', /[^\r\n]*/)),

    block_comment: _ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),

    // ### block comment ### — no lookahead needed; uses alternation to avoid ###
    hash_comment: _ => token(
      seq('###', /[^#]*(?:#[^#][^#]*|##[^#][^#]*)*/, '###'),
    ),

    // ── Strings ──────────────────────────────────────────────────────────────

    // Single- and double-quoted strings with escape sequences and multiline support.
    string: _ => token(choice(
      seq("'", /[^'\\]*(?:\\(?:.|\n)[^'\\]*)*/, "'"),
      seq('"', /[^"\\]*(?:\\(?:.|\n)[^"\\]*)*/, '"'),
    )),

    template_string: $ => seq(
      '`',
      repeat(choice(
        $.escape_sequence,
        $.template_substitution,
        $.template_chars,
        '$',              // lone $ not followed by {
      )),
      '`',
    ),

    // Any chars that are not `, \, or $
    template_chars: _ => /[^`\\$]+/,

    escape_sequence: _ => token(seq('\\', /[\s\S]/)),

    template_substitution: $ => seq('${', repeat($._item), '}'),

    // ── Numbers ──────────────────────────────────────────────────────────────

    number: _ => token(choice(
      /0[xX][0-9a-fA-F][0-9a-fA-F_]*/,
      /0[oO][0-7][0-7_]*/,
      /0[bB][01][01_]*/,
      /[0-9][0-9_]*n/,
      /[0-9][0-9_]*\.[0-9][0-9_]*(?:[eE][+-]?[0-9]+)?/,
      /[0-9][0-9_]*(?:[eE][+-]?[0-9]+)?/,
    )),

    // ── Identifiers ──────────────────────────────────────────────────────────

    // Private class fields: #foo
    private_identifier: _ => /#[a-zA-Z_$][a-zA-Z0-9_$]*/,

    // @@ decorator — lexer picks '@@' (2 chars) over '@' (1 char) via maximal munch.
    decorator: $ => seq('@@', $.identifier),

    // @ this-shorthand: @foo → this.foo, @ → this
    at_expression: $ => prec.right(seq('@', optional($.identifier))),

    identifier: _ => /[a-zA-Z_$][a-zA-Z0-9_$]*/,

    // ── Function and class declarations ──────────────────────────────────────

    // Captures the name as a distinct node so highlights.scm can colour it
    // independently of ordinary identifier/call uses.
    // Name is required (not optional) to avoid a shift/reduce conflict with
    // the keyword rule; anonymous `function(` and `class {` still match the
    // keyword fallback in _item.
    function_declaration: $ => seq(
      'function',
      field('name', $.identifier),
    ),

    class_declaration: $ => seq(
      'class',
      field('name', $.identifier),
    ),

    // ── Keywords ─────────────────────────────────────────────────────────────

    keyword: _ => choice(
      // JavaScript control flow
      // 'function'/'class' stay here for anonymous/expression forms;
      // named forms are matched by function_declaration/class_declaration.
      'break', 'case', 'catch', 'class', 'const', 'continue',
      'debugger', 'default', 'delete', 'do', 'else', 'export',
      'extends', 'finally', 'for', 'from', 'function',
      'if', 'import', 'in', 'instanceof', 'let', 'new',
      'of', 'return', 'static', 'super', 'switch',
      'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
      'async', 'await',
      // TypeScript
      'abstract', 'as', 'declare', 'enum', 'implements', 'interface',
      'namespace', 'override', 'private', 'protected', 'public',
      'readonly', 'satisfies',
      // Civet
      'unless', 'until', 'then',
      'and', 'or', 'not', 'is',
    ),

    // Type-system keywords (highlighted differently)
    type_keyword: _ => choice(
      'type', 'keyof', 'infer', 'never', 'unknown',
    ),

    // Built-in value keywords (highlighted as constants/builtins)
    constant: _ => choice(
      'true', 'false', 'null', 'undefined', 'this',
    ),

    // ── Operators ────────────────────────────────────────────────────────────

    operator: _ => token(choice(
      // Civet-specific
      '|>', '->', ':=', '.=', '<?',
      // Ranges (... before .. so longer wins)
      '...', '..',
      // Multi-char operators (longer first within token(choice) for clarity)
      '>>>=', '**=', '&&=', '||=', '??=',
      '<<=', '>>=',
      '===', '!==', '==', '!=', '<=', '>=',
      '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=',
      '&&', '||', '??', '?.', '=>',
      '++', '--', '**',
      '>>>', '>>', '<<',
      // Single-char
      '+', '-', '*', '/', '%',
      '=', '!', '<', '>',
      '&', '|', '^', '~',
      '?', ':',
    )),

    punctuation: _ => /[(){}\[\];.,]/,
  },
});
