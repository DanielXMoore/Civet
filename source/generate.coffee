gen = (node, options) ->
  if node is null or node is undefined
    return ""

  if typeof node is "string"
    return node

  if Array.isArray(node)
    return node.map (child) ->
      gen child, options
    .join('')

  if typeof node is "object"
    if options?.js and node.ts
      return ""

    if !node.children
      throw new Error("Unknown node", JSON.stringify(node))

    return node.children.map (child) ->
      gen child, options
    .join('')

  throw new Error("Unknown node", JSON.stringify(node))

module.exports = gen
