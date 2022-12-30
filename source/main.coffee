"civet coffeeCompat"

{ parse } = require "./parser"
{ prune } = gen = require "./generate"
{ SourceMap, base64Encode } = util = require "./util.coffee"

defaultOptions = {}

# Rules that are not cacheable
# Essentially anything that depends on mutable state in the parser like indents and the rules that depend on them
# One day this will be better supported by Hera
uncacheable = new Set [
  "TrackIndented", "Samedent", "IndentedFurther", "PushIndent", "PopIndent", "Nested", "InsertIndent",
  "Arguments", "ArgumentsWithTrailingCallExpressions", "ApplicationStart",
  "CallExpression", "CallExpressionRest", "LeftHandSideExpression", "ActualAssignment", "UpdateExpression",
  "UnaryExpression", "BinaryOpExpression", "BinaryOpRHS", "ConditionalExpression", "ShortCircuitExpression",
  "InlineObjectLiteral", "ImplicitInlineObjectPropertyDelimiter",
  "ImplicitNestedBlock",
  "ObjectLiteral",
  "NestedObject",
  "NestedImplicitObjectLiteral",
  "BracedObjectLiteralContent",
  "NestedPropertyDefinitions",
  "NestedImplicitPropertyDefinition", "NestedImplicitPropertyDefinitions", "NestedBlockStatement",
  "NestedElement", "NestedElementList", "NestedBindingElement", "NestedBindingElements", "NestedInterfaceProperty",
  "MemberExpression", "PrimaryExpression",
  "IndentedApplicationAllowed", "ExpressionWithIndentedApplicationSuppressed", "SuppressIndentedApplication",
  "AssignmentExpressionTail", "AssignmentExpression", "ExtendedExpression", "Expression", "MemberExpressionRest",
  "ElseClause",
  "CoffeeCommentEnabled", "SingleLineComment", "Debugger",
  "JSXElement", "TypedJSXElement", "JSXFragment", "TypedJSXFragment",
  "JSXChild", "JSXChildren", "JSXNestedChildren", "JSXMixedChildren"
]

module.exports =
  parse: parse
  compile: (src, options=defaultOptions) ->
    filename = options.filename or "unknown"

    if !options.noCache
      events = makeCache()

    ast = prune parse(src, {
      filename
      events
    })

    if options.ast
      return ast

    if options.sourceMap or options.inlineMap
      sm = SourceMap(src)
      options.updateSourceMap = sm.updateSourceMap
      code = gen ast, options

      if options.inlineMap
        srcMapJSON = sm.json(filename, "")
        # NOTE: separate comment to prevent this string getting picked up as actual sourceMappingURL in tools
        return "#{code}\n#{"//#"} sourceMappingURL=data:application/json;base64,#{base64Encode JSON.stringify(srcMapJSON)}\n"
      else
        return {
          code,
          sourceMap: sm
        }

    gen ast, options
  generate: gen
  util: util

# logs = []
makeCache = ->
  caches = new Map

  # stack = []

  events =
    enter: (ruleName, state) ->
      cache = caches.get(ruleName)
      if cache
        if cache.has(state.pos)
          # logs.push "".padStart(stack.length * 2, " ") + ruleName + ":" + state.pos + "💰"
          result = cache.get(state.pos)
          return {
            cache: if result then { ...result }
          }

      # logs.push "".padStart(stack.length * 2, " ") + ruleName + ":" + state.pos + "\u2192"
      # stack.push(ruleName)

      return

    exit: (ruleName, state, result) ->
      cache = caches.get(ruleName)

      if !cache and !uncacheable.has(ruleName)
        cache = new Map
        caches.set(ruleName, cache)

      if cache
        if result
          cache.set(state.pos, {...result})
        else
          cache.set(state.pos, result)

      if parse.config.verbose and result
        console.log "Parsed #{JSON.stringify state.input[state.pos...result.pos]} [pos #{state.pos}-#{result.pos}] as #{ruleName}"#, JSON.stringify(result.value)
      # stack.pop(ruleName)
      # logs.push "".padStart(stack.length * 2, " ") + ruleName + ":" + state.pos + " " + (if result then "✅" else "❌")

      return

  return events
