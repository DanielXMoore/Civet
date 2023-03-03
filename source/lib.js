/**
 * lib.js holds functions that are used inside parser.hera
 *
 * The rules inside parser.hera should be simple and short.
 * Most of the helpers/transforms should make their way into
 * here eventually.
 */

/**
 * Clone an AST node including children (removing parent pointes)
 * This gives refs new identities which may not be what we want.
 *
 * TODO: preserve ref identities
 */
function clone(node) {
  removeParentPointers(node)
  return deepCopy(node)
}

function deepCopy(node) {
  if (node == null) return node
  if (typeof node !== "object") return node

  if (Array.isArray(node)) {
    return node.map(deepCopy)
  }

  // Use from entries to clone objects
  // map the values to clone the children
  return Object.fromEntries(
    Object.entries(node).map(([key, value]) => {
      return [key, deepCopy(value)]
    })
  )
}

function removeParentPointers(node) {
  if (node == null) return
  if (typeof node !== "object") return

  // NOTE: Arrays are transparent and skipped when traversing via parent
  if (Array.isArray(node)) {
    for (const child of node) {
      removeParentPointers(child)
    }
    return
  }

  node.parent = null
  if (node.children) {
    for (const child of node.children) {
      removeParentPointers(child)
    }
  }
}

// Gather child nodes that match a predicate
// while recursing into nested expressions
// without recursing into nested blocks/for loops
function gatherNodes(node, predicate) {
  if (node == null) return []

  if (Array.isArray(node)) {
    return node.flatMap((n) => gatherNodes(n, predicate))
  }

  if (predicate(node)) {
    return [node]
  }

  switch (node.type) {
    case "BlockStatement":
      return []
    case "ForStatement":
      // Descend into expressions but not into declarations or the body of the for loop
      const isDec = node.declaration?.type === "Declaration"
      return node.children.flatMap((n) => {
        if (isDec && n === node.declaration) return []
        return gatherNodes(n, predicate)
      })
    default:
      return gatherNodes(node.children, predicate)
  }

  return []
}

// Gather nodes that match a predicate recursing into all unmatched children
// i.e. if the predicate matches a node it is not recursed into further
function gatherRecursive(node, predicate, skipPredicate) {
  if (node == null) return []

  if (Array.isArray(node)) {
    return node.flatMap((n) => gatherRecursive(n, predicate, skipPredicate))
  }

  if (skipPredicate?.(node)) return []

  if (predicate(node)) {
    return [node]
  }

  return gatherRecursive(node.children, predicate, skipPredicate)
}

function gatherRecursiveAll(node, predicate) {
  if (node == null) return []

  if (Array.isArray(node)) {
    return node.flatMap((n) => gatherRecursiveAll(n, predicate))
  }

  const nodes = gatherRecursiveAll(node.children, predicate)
  if (predicate(node)) {
    nodes.push(node)
  }

  return nodes
}

module.exports = {
  clone,
  deepCopy,
  gatherNodes,
  gatherRecursive,
  gatherRecursiveAll,
  removeParentPointers,
}
