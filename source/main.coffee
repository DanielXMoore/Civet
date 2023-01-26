"civet coffeeCompat"

import parser from "./parser.hera"
{ parse } = parser
import generate, { prune } from "./generate.coffee"
import * as util from "./util.coffee"
{ SourceMap, base64Encode } = util
export { parse, generate, util }

# Rules that are not cacheable
# Essentially anything that depends on mutable state in the parser like indents and the rules that depend on them
# One day this will be better supported by Hera
uncacheable = new Set [
  "ActualAssignment"
  "ApplicationStart"
  "Arguments"
  "ArgumentsWithTrailingMemberExpressions"
  "ArrowFunction"
  "ArrowFunctionTail"
  "AssignmentExpression"
  "AssignmentExpressionTail"
  "BinaryOpExpression"
  "BinaryOpRHS"
  "BracedBlock"
  "BracedObjectLiteralContent"
  "BracedOrEmptyBlock"
  "CallExpression"
  "CallExpressionRest"
  "CoffeeCommentEnabled"
  "CommaDelimiter"
  "ConditionalExpression"
  "Declaration"
  "Debugger"
  "ElseClause"
  "Expression"
  "ExpressionStatement"
  "ExpressionWithIndentedApplicationSuppressed"
  "ExtendedExpression"
  "FatArrowBody"
  "FunctionDeclaration"
  "FunctionExpression"
  "HoistableDeclaration"
  "ImplicitArguments"
  "ImplicitInlineObjectPropertyDelimiter"
  "ImplicitNestedBlock"
  "IndentedApplicationAllowed"
  "IndentedFurther"
  "IndentedJSXChildExpression"
  "InlineObjectLiteral"
  "InsertIndent"
  "JSXChild"
  "JSXChildren"
  "JSXElement"
  "JSXFragment"
  "JSXImplicitFragment"
  "JSXMixedChildren"
  "JSXNested"
  "JSXNestedChildren"
  "JSXOptionalClosingElement"
  "JSXOptionalClosingFragment"
  "JSXTag"
  "LeftHandSideExpression"
  "MemberExpression"
  "MemberExpressionRest"
  "Nested"
  "NestedBindingElement"
  "NestedBindingElements"
  "NestedBlockExpression"
  "NestedBlockExpression"
  "NestedBlockStatement"
  "NestedBlockStatements"
  "NestedElement"
  "NestedElementList"
  "NestedImplicitObjectLiteral"
  "NestedImplicitPropertyDefinition"
  "NestedImplicitPropertyDefinitions"
  "NestedInterfaceProperty"
  "NestedJSXChildExpression"
  "NestedObject"
  "NestedPropertyDefinitions"
  "NonSuppressedTrailingMemberExpressions"
  "ObjectLiteral"
  "PopIndent"
  "PrimaryExpression"
  "PushIndent"
  "PushJSXOpeningElement"
  "PushJSXOpeningFragment"
  "Samedent"
  "ShortCircuitExpression"
  "SingleLineAssignmentExpression"
  "SingleLineComment"
  "SingleLineStatements"
  "SnugNamedProperty"
  "Statement"
  "StatementListItem"
  "SuppressIndentedApplication"
  "SuppressTrailingMemberProperty"
  "ThinArrowFunction"
  "TrackIndented"
  "TrailingMemberExpressions"
  "TrailingMemberPropertyAllowed"
  "TypedJSXElement"
  "TypedJSXFragment"
  "UnaryExpression"
  "UpdateExpression"
]

export compile = (src, options) ->
  if (!options)
    options = {}
  else
    options = {...options}

  filename = options.filename or "unknown"

  # TODO: This makes source maps slightly off in the first line.
  if filename.endsWith('.coffee') and not
     /^(#![^\r\n]*(\r\n|\n|\r))?\s*['"]civet/.test src
    src = "\"civet coffeeCompat\"; #{src}"

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
    code = generate ast, options

    if options.inlineMap
      srcMapJSON = sm.json(filename, "")
      # NOTE: separate comment to prevent this string getting picked up as actual sourceMappingURL in tools
      return "#{code}\n#{"//#"} sourceMappingURL=data:application/json;base64,#{base64Encode JSON.stringify(srcMapJSON)}\n"
    else
      return {
        code,
        sourceMap: sm
      }

  result = generate ast, options

  if options.errors?.length
    #TODO: Better error display
    throw new Error "Parse errors: #{options.errors.join("\n")} "

  return result

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

# TODO: Import ParseError class from Hera
export isCompileError = (err) ->
  err instanceof Error and
  [err.message, err.name, err.filename, err.line, err.column, err.offset].every (value) -> value isnt undefined

export default { parse, generate, util, compile, isCompileError }
