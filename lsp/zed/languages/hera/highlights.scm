; Hera-grammar level only.  Handler-line and code-block content is routed
; through queries/injections.scm to the embedded Civet grammar — anything
; in those regions is coloured by the injection, not by these rules.

; ── Comments ───────────────────────────────────────────────────────────────────

(comment) @comment.line

; ── Strings ────────────────────────────────────────────────────────────────────

(string) @string

; ── Regex / character class ────────────────────────────────────────────────────

(regex)           @string.regex
(character_class) @string.regex

; ── Type annotation marker ─────────────────────────────────────────────────────

(type_marker) @operator

; ── Arrow ──────────────────────────────────────────────────────────────────────

(arrow) @operator

; ── Operators ──────────────────────────────────────────────────────────────────

(operator) @operator

; ── Identifiers ────────────────────────────────────────────────────────────────
; Rule names conventionally start with an uppercase letter, so PascalCase
; identifiers get the `@type` highlight (matches the TextMate grammar's
; `support.class.hera` for rules); other identifiers (rare — typically
; `:paramName` after `:`) fall through to `@variable`.

((identifier) @type
 (#match? @type "^[A-Z]"))

(identifier) @variable

; ── Punctuation ────────────────────────────────────────────────────────────────

((punctuation) @punctuation.bracket
 (#match? @punctuation.bracket "^[(){}\\[\\]]$"))

((punctuation) @punctuation.delimiter
 (#match? @punctuation.delimiter "^[;.,]$"))
