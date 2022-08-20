gen = (node) ->
  if node is null or node is undefined
    return ""

  if typeof node is "string"
    return node

  if Array.isArray(node)
    return node.map(gen).join('')

  if typeof node is "object"
    ; # TODO

  throw new Error("Unknown node", JSON.stringify(node))

module.exports = gen
