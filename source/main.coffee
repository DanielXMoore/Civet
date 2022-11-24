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
          when "TrackIndented", "Samedent", "IndentedFurther", "PushIndent", "PopIndent", "Nested", "InsertIndent",\
            "Arguments", "ArgumentsWithTrailingCallExpressions", "ImplicitApplication", "IndentedApplicationAllowed", "ApplicationStart",\
            "CallExpression", "CallExpressionRest", "LeftHandSideExpression", "ActualAssignment", "UpdateExpression",\
            "UnaryExpression", "BinaryOpExpression", "BinaryOpRHS", "ConditionalExpression", "ShortCircuitExpression",\
            "NestedPropertyDefinitions", "NestedObject", "NestedObjectLiteral", "NestedBlockStatement",\
            "NestedInterfaceProperty",\
            "AssignmentExpressionTail", "AssignmentExpression", "ExtendedExpression", "Expression",\
            "ElseClause",\
            "CoffeeCommentEnabled", "SingleLineComment"

            break
          else
            cache = new Map
            caches.set(ruleName, cache)

      if cache
        if result
          cache.set(state.pos, {...result})
        else
          cache.set(state.pos, result)

      return

  return events
