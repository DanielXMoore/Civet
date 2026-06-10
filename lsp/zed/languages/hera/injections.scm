; Multi-line handler bodies (indent >= 4) and single-line inline handler
; content (everything past `->` on a grammar line) are both regular Civet
; — delegate to the Civet grammar so we don't model the JS surface inside
; this grammar.  `injection.combined` aggregates adjacent captures into
; one scope so multi-line handler statements parse as a single block.
((handler_line
   content: (handler_content) @injection.content)
 (#set! injection.language "civet")
 (#set! injection.combined))

((inline_handler
   content: (inline_handler_content) @injection.content)
 (#set! injection.language "civet")
 (#set! injection.combined))

; Code-block bodies (top-of-file TS imports, embedded handler blocks).
; Single-block injection — code blocks are intentionally self-contained.
((code_block
   content: (code_body) @injection.content)
 (#set! injection.language "civet"))
