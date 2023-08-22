"civet coffeeCompat"

import parser from "./parser.hera"
{ parse } = parser
import generate, { prune } from "./generate.coffee"
import * as util from "./util.coffee"
{ SourceMap } = util
export { parse, generate, util }

import StateCache from "./state-cache.mts"

# Need to no-cache any rule that directly modifies parser state
# indentation stack, jsx stack, etc.

uncacheable = new Set [
  # Meta
  "Debugger"
  "Init"
  "Program"
  "Reset"

  # Indentation
  # We need to no-cache the state modifying rules up to the point where they
  # balance within a parent so PushIndent needs to be marked no-cache even
  # though it only calls TrackIndented which does the actual work.
  "PushIndent"
  "PopIndent"
  "TrackIndented"

  # JSX
  "PushJSXOpeningElement"
  "PushJSXOpeningFragment"
  "PopJSXStack"

  # State
  "AllowAll"
  "AllowClassImplicitCall"
  "AllowBracedApplication"
  "AllowIndentedApplication"
  "AllowMultiLineImplicitObjectLiteral"
  "AllowNewlineBinaryOp"
  "AllowTrailingMemberProperty"

  "ForbidClassImplicitCall"
  "ForbidBracedApplication"
  "ForbidIndentedApplication"
  "ForbidMultiLineImplicitObjectLiteral"
  "ForbidNewlineBinaryOp"
  "ForbidTrailingMemberProperty"

  "RestoreAll"
  "RestoreClassImplicitCall"
  "RestoreMultiLineImplicitObjectLiteral"
  "RestoreBracedApplication"
  "RestoreIndentedApplication"
  "RestoreTrailingMemberProperty"
  "RestoreNewlineBinaryOp"

]

export compile = (src, options) ->
  if (!options)
    options = {}
  else
    options = {...options}

  options.parseOptions ?= {}

  filename = options.filename or "unknown"

  if filename.endsWith('.coffee') and not
     /^(#![^\r\n]*(\r\n|\n|\r))?\s*['"]civet/.test src
    options.parseOptions.coffeeCompat = true

  if !options.noCache
    events = makeCache()

  parse.config = options.parseOptions or {}
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
      return SourceMap.remap code, sm, filename, filename + '.tsx'
    else
      return {
        code,
        sourceMap: sm
      }

  result = generate ast, options

  if options.errors?.length
    #TODO: Better error display
    throw new Error "Parse errors: #{options.errors.map((e) -> e.message).join("\n")} "

  return result

# logs = []
makeCache = ->
  stateCache = new StateCache
  getStateKey = null

  # stack = []

  events =
    enter: (ruleName, state) ->
      return if uncacheable.has(ruleName)

      key = [ruleName, state.pos, ...getStateKey()]

      # We cache `undefined` when a rule fails to match so we need to use `has` here.
      if stateCache.has(key)
        # logs.push "".padStart(stack.length * 2, " ") + ruleName + ":" + state.pos + "💰"
        result = stateCache.get(key)
        return {
          cache: if result then { ...result }
        }

      # logs.push "".padStart(stack.length * 2, " ") + ruleName + ":" + state.pos + "\u2192"
      # stack.push(ruleName)

      return

    exit: (ruleName, state, result) ->
      # special hack to get access to parser state
      if ruleName is "Reset"
        { getStateKey } = result.value

      if !uncacheable.has(ruleName)
        key = [ruleName, state.pos, ...getStateKey()]
        if result
          stateCache.set(key, {...result})
        else
          stateCache.set(key, result)

      if parse.config.verbose and result
        console.log "Parsed #{JSON.stringify state.input[state.pos...result.pos]} [pos #{state.pos}-#{result.pos}] as #{ruleName}"#, JSON.stringify(result.value)
      # stack.pop()
      # logs.push "".padStart(stack.length * 2, " ") + ruleName + ":" + state.pos + " " + (if result then "✅" else "❌")

      return

  return events

# TODO: Import ParseError class from Hera
export isCompileError = (err) ->
  err instanceof Error and
  [err.message, err.name, err.filename, err.line, err.column, err.offset].every (value) -> value isnt undefined

export default { parse, generate, util, compile, isCompileError }
