# TODO: Sourcemaps
# track output line/column
# - track source line/column
#   - map src string into position / line char lookup
# construct source mapping data

gen = (node, options) ->
  if node is null or node is undefined
    return ""

  if typeof node is "string"
    # increment output line/column
    updateOutputPosition options.sourceMap, node

    return node

  if Array.isArray(node)
    return node.map (child) ->
      gen child, options
    .join('')

  if typeof node is "object"
    if options.js and node.ts
      return ""

    if node.$loc?
      {token, $loc} = node
      updateOutputPosition(options.sourceMap, token)
      return token

    if !node.children
      throw new Error("Unknown node", JSON.stringify(node))

    return gen node.children, options

  throw new Error("Unknown node", JSON.stringify(node))

module.exports = gen

EOL = /\r?\n|\r/

updateOutputPosition = (state, str) ->
  return unless state

  outLines = str.split(EOL)

  if outLines.length > 1 # there was a line break
    lineNum += outLines.length - 1
    colNum = outLines[outLines.length - 1].length
  else
    colNum += str.length

  # Update state
  state.lineNum = lineNum
  state.colNum = colNum

# Remove empty arrays, empty string, null, undefined from node tree
# Useful for debugging so I don't need to step though tons of empty nodes
prune = (node) ->
  if node is null or node is undefined
    return

  if node.length is 0
    return

  if Array.isArray(node)
    a = node.map (n) ->
      prune(n)
    .filter (n) -> !!n

    if a.length > 1
      return a
    if a.length is 1
      return a[0]
    return

  if node.children?
    node.children = prune node.children
    return node

  return node

gen.prune = prune
