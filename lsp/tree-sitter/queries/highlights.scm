; ── Comments ───────────────────────────────────────────────────────────────────

(line_comment)  @comment.line
(block_comment) @comment.block
(hash_comment)  @comment.block

; ── Strings ────────────────────────────────────────────────────────────────────

(string)          @string
(template_string) @string
(escape_sequence) @string.escape
(template_substitution ["${" "}"] @punctuation.special)

; ── Numbers ────────────────────────────────────────────────────────────────────

(number) @number

; ── Constants & builtins ───────────────────────────────────────────────────────

((constant) @boolean
 (#match? @boolean "^(true|false)$"))

((constant) @constant.builtin
 (#match? @constant.builtin "^(null|undefined)$"))

((constant) @variable.builtin
 (#match? @variable.builtin "^this$"))

; ── Identifiers ────────────────────────────────────────────────────────────────

(private_identifier) @property

; PascalCase identifiers → types
((identifier) @type
 (#match? @type "^[A-Z]"))

; ALL_CAPS identifiers → constants
((identifier) @constant
 (#match? @constant "^[A-Z_][A-Z\\d_]+$"))

(identifier) @variable

; ── @ this-shorthand ──────────────────────────────────────────────────────────

(at_expression "@"          @variable.builtin)
(at_expression (identifier) @property)

; ── @@ decorators ─────────────────────────────────────────────────────────────

(decorator "@@" @attribute)
(decorator (identifier) @attribute)

; ── Keywords ──────────────────────────────────────────────────────────────────

(type_keyword) @type.builtin

(keyword) @keyword

; ── Operators ─────────────────────────────────────────────────────────────────

(operator) @operator

; ── Punctuation ───────────────────────────────────────────────────────────────

((punctuation) @punctuation.bracket
 (#match? @punctuation.bracket "^[(){}\\[\\]]$"))

((punctuation) @punctuation.delimiter
 (#match? @punctuation.delimiter "^[;.,]$"))
