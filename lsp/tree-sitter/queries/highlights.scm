; ── Comments ──────────────────────────────────────────────────────────────────

(comment) @comment
(hash_comment) @comment.block

; ── Types ─────────────────────────────────────────────────────────────────────

(type_identifier) @type
(predefined_type) @type.builtin

((identifier) @type
 (#match? @type "^[A-Z]"))

(type_arguments
  "<" @punctuation.bracket
  ">" @punctuation.bracket)

; ── Variables & parameters ────────────────────────────────────────────────────

(identifier) @variable
(property_identifier) @property

(required_parameter (identifier) @variable.parameter)
(optional_parameter (identifier) @variable.parameter)

(this) @variable.builtin
(super) @variable.builtin

; ── @ this-shorthand ──────────────────────────────────────────────────────────

(at_expression "@" @variable.builtin)
(at_expression (property_identifier) @property)

; ── Functions ─────────────────────────────────────────────────────────────────

(function_declaration name: (identifier) @function)
(function_expression  name: (identifier) @function)
(method_definition    name: (property_identifier) @function.method)

(call_expression function: (identifier) @function)
(call_expression function: (member_expression
  property: (property_identifier) @function.method))

(variable_declarator
  name: (identifier) @function
  value: [(function_expression) (arrow_function)])

; ── Pipe operator ─────────────────────────────────────────────────────────────

(pipe_expression "|>" @operator)

; ── Range operator ────────────────────────────────────────────────────────────

(range_expression operator: ".." @operator)
(range_expression operator: "..." @operator)

; ── Literals ──────────────────────────────────────────────────────────────────

(true)  @constant.builtin
(false) @constant.builtin
(null)  @constant.builtin
(undefined) @constant.builtin

(string)          @string
(template_string) @string
(regex)           @string.special
(number)          @number

; ── Keywords ──────────────────────────────────────────────────────────────────

[
  "abstract" "declare" "enum" "export" "implements" "interface"
  "keyof" "namespace" "private" "protected" "public" "type"
  "readonly" "override" "satisfies"
] @keyword

[
  "async" "await"
  "break" "case" "catch" "class" "const"
  "continue" "debugger" "default" "delete" "do" "else"
  "finally" "for" "from" "function"
  "if" "import" "in" "instanceof"
  "let" "new" "of" "return"
  "static" "switch" "target" "throw" "try"
  "typeof" "var" "void" "while" "with" "yield"
  "extends"
] @keyword

; Civet-specific keywords
["unless" "until"] @keyword

; ── Operators ─────────────────────────────────────────────────────────────────

[
  "-" "--" "-=" "+" "++" "+="
  "*" "*=" "**" "**="
  "/" "/=" "%" "%="
  "<" "<=" "<<" "<<="
  "=" "==" "===" "!" "!=" "!=="
  "=>" "->"
  ">" ">=" ">>" ">>=" ">>>" ">>>="
  "~" "^" "&" "|"
  "^=" "&=" "|=" "&&" "||" "??" "&&=" "||=" "??="
] @operator

; ── Punctuation ───────────────────────────────────────────────────────────────

[";" "." "," (optional_chain)] @punctuation.delimiter
["(" ")" "[" "]" "{" "}"] @punctuation.bracket

; ── Decorators ────────────────────────────────────────────────────────────────

(decorator "@@" @attribute)

; ── Special identifiers ───────────────────────────────────────────────────────

((identifier) @constructor (#match? @constructor "^[A-Z]"))

([
  (identifier)
  (shorthand_property_identifier)
  (shorthand_property_identifier_pattern)
] @constant (#match? @constant "^[A-Z_][A-Z\\d_]+$"))
