// @ts-nocheck
/**
 * Minimal Hera tree-sitter grammar for syntax highlighting.
 *
 * Line-oriented: lines at column 0 or 2 are the Hera grammar surface
 * (parsed as a flat sequence of grammar tokens); lines at column 4+ are
 * handler / embedded code bodies opaque to this grammar and delegated to
 * the Civet tree-sitter via the injection query.  When the LSP is up its
 * semanticTokens override the injected coloring with full type info.
 *
 * Architecture:
 *   - `extras: [/[ \t]/]` — only horizontal whitespace is skipped between
 *     tokens, so `\n` is grammatically significant and can anchor line
 *     classification.
 *   - `_indent` matches `\n+ [ \t]{4,}`, winning maximal-munch over the
 *     plain `newline` token whenever a 4+-space indent follows.
 *   - `handler_line` captures the rest of an indented line as opaque
 *     `handler_content`; the injection query pipes that text to Civet.
 *   - On outdent (a column 0/2 line), the lexer can no longer match
 *     `_indent` and falls back to the Hera-grammar tokens — natural
 *     "pop" behavior, no explicit state.
 *
 * Reference: Hera's self-defined grammar at
 * /home/daniel/apps/Hera/source/hera.hera.
 */

module.exports = grammar({
  name: 'hera',

  word: $ => $.identifier,

  // Horizontal whitespace only.  Newlines are explicit so we can decide
  // per-line whether content is grammar or embedded.
  extras: $ => [/[ \t]/],

  rules: {
    program: $ => repeat($._line),

    _line: $ => choice(
      $.handler_line,
      $.newline,
      $._hera_items,
    ),

    // One or more Hera-grammar tokens on a column 0 or 2 line.  Marked
    // left-associative so tree-sitter prefers extending the current items
    // over splitting them across multiple adjacent `_hera_items` siblings
    // (the next `_line` alternative could otherwise match a single `_item`
    // and create gratuitous ambiguity).
    _hera_items: $ => prec.left(repeat1($._item)),

    _item: $ => choice(
      $.comment,
      $.code_block,
      $.string,
      $.regex,
      $.character_class,
      $.type_marker,
      $.inline_handler,
      $.arrow,
      $.number,
      $.operator,
      $.identifier,
      $.punctuation,
    ),

    // ── Inline handler ───────────────────────────────────────────────────
    // After `->` on a column-0/2 line, anything to end-of-line is regular
    // Civet (single-expression inline handler body, e.g. `-> -3.1`,
    // `-> [a, b, c]`, `-> { foo: 1 }`).  Capture the trailing text as a
    // single opaque field; queries/injections.scm routes it to the Civet
    // grammar so we don't have to model the JS surface inside this grammar.
    inline_handler: $ => seq($.arrow, field('content', $.inline_handler_content)),
    inline_handler_content: _ => /[^\n]+/,

    // ── Newlines and handler-line gate ───────────────────────────────────
    // `_indent` consumes one-or-more newlines plus a 4+-space indent so a
    // blank line preceding an indented block still maps to the start of
    // a handler line.  Maximal-munch makes this win over `newline` when
    // applicable.
    newline: _ => /\n+/,
    _indent: _ => token(seq(/\n+/, /[ \t]{4,}/)),

    handler_line: $ => seq(
      $._indent,
      field('content', $.handler_content),
    ),
    handler_content: _ => /[^\n]*/,

    // ── Hera grammar comments ────────────────────────────────────────────
    // `# ...` to end of line.
    comment: _ => token(seq('#', /[^\r\n]*/)),

    // ── Code blocks ──────────────────────────────────────────────────────
    // Triple-backtick code body (top-of-file TS imports, etc.).  Body is
    // exposed as `code_body` so the injection query can route it through
    // an embedded grammar.
    code_block: $ => seq('```', field('content', $.code_body), '```'),
    code_body: _ => token.immediate(/(?:[^`]|`[^`]|``[^`])*/),

    // ── Strings ──────────────────────────────────────────────────────────
    // Hera grammar literals are double-quoted only.  Single-quoted strings
    // are a handler-body concern and stay inside `handler_content` for the
    // injected grammar to handle.
    string: _ => token(seq(
      '"',
      /(?:[^"\\\n]|\\[^\n])*/,
      '"',
    )),

    // ── Regex literals ───────────────────────────────────────────────────
    // `/pattern/`.  The first body element must not be a space (so a bare
    // `/` surrounded by whitespace — Hera's choice operator `A / B` —
    // lexes as `operator`, not regex).  An escape sequence `\.` is valid
    // as the first element (real Hera grammars often start with `/\{`).
    regex: _ => token(seq(
      '/',
      choice(
        /[^\s/\\]/,    // normal first char
        /\\[^\n]/,     // escape sequence as first char
      ),
      /(?:[^/\\\n]|\\[^\n])*/,
      '/',
    )),

    // ── Character classes ────────────────────────────────────────────────
    // `[abc]`, `[^abc]+` — standalone regex literals in Hera's `CharacterClassExpression`.
    character_class: _ => token(seq(
      '[',
      /(?:[^\]\\\n]|\\[^\n])*/,
      ']',
      /[?+*]?/,
    )),

    // ── Type annotation marker ───────────────────────────────────────────
    // `::` introduces a same-line TS type expression.  The type's tokens
    // (identifiers, `|`, etc.) classify through the normal token rules.
    type_marker: _ => '::',

    // ── Arrow ────────────────────────────────────────────────────────────
    arrow: _ => '->',

    // ── Operators ────────────────────────────────────────────────────────
    // Hera-grammar operators only.  Inline-handler content (everything
    // past `->`) and indented-line handler content (column 4+) are both
    // routed through the injected Civet grammar, so we don't model JS
    // operators here.
    operator: _ => token(choice(
      '/', '+', '*', '?', '&', '!', '$', ':', '|',
    )),

    // ── Numbers ──────────────────────────────────────────────────────────
    // Numbers appear at the Hera-grammar level in inline-handler bodies
    // (`-> $1`), TS literal-type unions in `::` annotations (`:: 1 | 2`),
    // and regex quantifiers (`{3,5}`) outside character classes.
    number: _ => token(/[0-9]+(?:\.[0-9]+)?/),

    // ── Identifiers ──────────────────────────────────────────────────────
    identifier: _ => /[_a-zA-Z][_a-zA-Z0-9]*/,

    // ── Punctuation ──────────────────────────────────────────────────────
    // Includes braces/brackets that appear at the Hera-grammar level on
    // inline handlers (`-> {`) and TS type-annotation bodies (`:: {…}`).
    // `[` as a standalone is rare here — `character_class` (multi-char
    // token) wins by maximal munch when there's a closing `]`.
    punctuation: _ => /[(){}\[\];.,]/,
  },
});
