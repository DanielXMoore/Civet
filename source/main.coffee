"civet coffeeCompat"

{ parse } = require "./parser"
{ prune } = gen = require "./generate"
{ SourceMap, base64Encode } = util = require "./util.coffee"

defaultOptions = {}

module.exports =
  parse: parse
  compile: (src, options=defaultOptions) ->
    filename = options.filename or "unknown"

    if options.cache
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

makeCache = ->
  caches = new Map

  events =
    enter: (ruleName, state) ->
      cache = caches.get(ruleName)
      if cache
        if cache.has(state.pos)
          result = cache.get(state.pos)
          return {
            cache: if result then { ...result }
          }

      return

    exit: (ruleName, state, result) ->
      cache = caches.get(ruleName)

      if !cache
        switch ruleName
          # Rules that are not cacheable
          # Essentially anything that depends on mutable state in the parser like indents and the rules that depend on them
          # One day this will be better supported by Hera
          when "TrackIndented", "Samedent", "IndentedFurther", "PushIndent", "PopIndent", "Nested", "InsertIndent",\
            "Arguments", "ArgumentsWithTrailingCallExpressions", "ApplicationStart",\
            "CallExpression", "CallExpressionRest", "LeftHandSideExpression", "ActualAssignment", "UpdateExpression",\
            "UnaryExpression", "BinaryOpExpression", "BinaryOpRHS", "ConditionalExpression", "ShortCircuitExpression",\
            "NestedPropertyDefinitions", "NestedObject", "NestedImplicitObjectLiteral", "NestedImplicitPropertyDefinitions", "NestedBlockStatement",\
            "NestedElement", "NestedElementList", "NestedBindingElement", "NestedBindingElements", "NestedInterfaceProperty",\
            "MemberExpression", "PrimaryExpression",\
            "IndentedApplicationAllowed", "ExpressionWithIndentedApplicationSuppressed", "SuppressIndentedApplication",\
            "AssignmentExpressionTail", "AssignmentExpression", "ExtendedExpression", "Expression", "MemberExpressionRest",\
            "ElseClause",\
            "CoffeeCommentEnabled", "SingleLineComment", "Debugger",\
            "JSXElement", "JSXChild", "JSXChildren", "JSXFragment", "JSXNestedChildren"

            break
          else
            cache = new Map
            caches.set(ruleName, cache)

      if cache
        if result
          cache.set(state.pos, {...result})
        else
          cache.set(state.pos, result)

      if parse.config.verbose and result
        console.log "Parsed #{JSON.stringify state.input[state.pos...result.pos]} [pos #{state.pos}-#{result.pos}] as #{ruleName}"#, JSON.stringify(result.value)

      return

  return events
