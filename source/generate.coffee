"civet coffeeCompat"
# TODO: Sourcemaps
# track output line/column
# - track source line/column
#   - map src string into position / line char lookup
# construct source mapping data

export default gen = (node, options) ->
  if node is null or node is undefined
    return ""

  if typeof node is "string"
    # increment output line/column
    options?.updateSourceMap? node

    return node

  if Array.isArray(node)
    return node.map (child) ->
      gen child, options
    .join('')

  if typeof node is "object"
    if options.js and node.ts
      return ""
    if !options.js and node.js
      return ""

    if node.$loc?
      {token, $loc} = node
      options?.updateSourceMap?(token, $loc.pos)
      return token

    if !node.children
      debugger
      throw new Error("Unknown node", JSON.stringify(node))

    return gen node.children, options

  debugger
  throw new Error("Unknown node", JSON.stringify(node))

# Remove empty arrays, empty string, null, undefined from node tree
# Useful for debugging so I don't need to step though tons of empty nodes
export prune = (node) ->
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
    node.children = prune(node.children) or []
    return node

  return node
