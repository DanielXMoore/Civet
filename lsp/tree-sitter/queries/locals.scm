(function_declaration) @local.scope
(arrow_function) @local.scope
(function_expression) @local.scope
(method_definition) @local.scope

(variable_declarator name: (identifier) @local.definition)
(required_parameter (identifier) @local.definition)
(optional_parameter (identifier) @local.definition)

(identifier) @local.reference
