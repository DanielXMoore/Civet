/**
 * lib.js holds functions that are used inside parser.hera
 *
 * The rules inside parser.hera should be simple and short.
 * Most of the helpers/transforms should make their way into
 * here eventually.
 */

/**
 * Adds parent pointers to all nodes in the AST. Elements within
 * arrays of nodes receive the closest non-array object parent.
 */
function addParentPointers(node, parent) {
  if (node == null) return
  if (typeof node !== "object") return

  // NOTE: Arrays are transparent and skipped when traversing via parent
  if (Array.isArray(node)) {
    for (const child of node) {
      addParentPointers(child, parent)
    }
    return
  }

  node.parent = parent
  if (node.children) {
    for (const child of node.children) {
      addParentPointers(child, node)
    }
  }
}

function addPostfixStatement(statement, ws, post) {
  let children, expressions
  if (post.blockPrefix?.length) {
    let indent = post.blockPrefix[0][0]
    expressions = [...post.blockPrefix, [indent, statement]]
    children = [" {\n", ...expressions, "\n", indent?.slice?.(0, -2), "}"]
  } else {
    expressions = [["", statement]]
    children = [" { ", ...expressions, " }"]
  }

  const block = {
    type: "BlockStatement",
    children,
    expressions,
  }

  children = [...post.children]
  children./**/push(block)

  // This removes trailing whitespace for easier testing
  if (!isWhitespaceOrEmpty(ws)) children./**/push(ws)

  post = { ...post, children, block }
  if (post.type === "IfStatement") {
    post.then = block
  }
  return post
}

/**
 * Adjusts `@binding` inside object properties that need to be aliased
 * see test/function.civet binding pattern
 */
function adjustAtBindings(statements, asThis = false) {
  gatherRecursiveAll(statements, n => n.type === "AtBindingProperty")
    .forEach(binding => {
      const { ref } = binding

      if (asThis) {
        // Convert from @x to x: this.x keeping any whitespace or initializer to the right
        const atBinding = binding.binding
        atBinding.children.pop()
        atBinding.type = undefined

        binding.children.unshift(ref.id, ": this.", ref.base)
        binding.type = "Property"
        binding.ref = undefined
        return
      }

      if (ref.names[0] !== ref.base) {
        binding.children.unshift(ref.base, ": ")
      }
    })
}

function adjustBindingElements(elements) {
  const names = elements.flatMap((p) => p.names || []),
    { length } = elements

  let blockPrefix,
    restIndex = -1,
    restCount = 0

  elements.forEach(({ type }, i) => {
    if (type === "BindingRestElement") {
      if (restIndex < 0) restIndex = i
      restCount++
    }
  })

  if (restCount === 0) {
    return {
      children: elements,
      names,
      blockPrefix,
      length,
    }
  } else if (restCount === 1) {
    const rest = elements[restIndex]
    const after = elements.slice(restIndex + 1)

    const restIdentifier = rest.binding.ref || rest.binding
    names./**/push(...rest.names || [])

    let l = after.length

    if (l) {
      // increment l if trailing comma
      if (arrayElementHasTrailingComma(after[l - 1])) l++

      blockPrefix = {
        type: "PostRestBindingElements",
        children: ["[", insertTrimmingSpace(after, ""), "] = ", restIdentifier, ".splice(-", l.toString(), ")"],
        names: after.flatMap(p => p.names),
      }
    }

    return {
      names,
      children: [...elements.slice(0, restIndex), {
        ...rest,
        children: rest.children.slice(0, -1) // remove trailing comma
      }],
      blockPrefix,
      length,
    }
  }

  const err = {
    type: "Error",
    children: ["Multiple rest elements in array pattern"],
  }

  return {
    names,
    children: [...elements, err],
    blockPrefix,
    length,
  }
}


/**
 * Adjust the alias of a binding property, adding an alias if one doesn't exist or
 * replacing an existing alias. This mutates the property in place.
 */
function aliasBinding(p, ref) {
  if (p.type === "Identifier") {
    // Array element binding
    // TODO: This ignores `name` and `names` properties of Identifier and
    // hackily converts it to a container for a Ref.
    p.children[0] = ref
  } else if (p.type === "BindingRestElement") {
    aliasBinding(p.binding, ref)
  } else if (p.value?.type === "Identifier") {
    // aliased property binding
    aliasBinding(p.value, ref)
  } else {
    // non-aliased property binding
    p.value = ref
    p.children.push(": ", ref)
  }
}

function arrayElementHasTrailingComma(elementNode) {
  const { children } = elementNode, { length } = children

  const lastChild = children[length - 1]
  if (lastChild) {
    const l2 = lastChild.length
    if (lastChild[l2 - 1]?.token === ",") {
      return true
    }
  }
  return false
}

/**
 * Duplicate a block and attach statements prefixing the block.
 * Adds braces if the block is bare.
 *
 * @returns the duplicated block with prefix statements attached or the unchanged block.
 */
function blockWithPrefix(prefixStatements, block) {
  if (prefixStatements && prefixStatements.length) {
    const indent = getIndent(block.expressions[0])
    // Match prefix statements to block indent level
    if (indent) {
      prefixStatements = prefixStatements.map((statement) => [indent, ...statement.slice(1)])
    }

    const expressions = [...prefixStatements, ...block.expressions]

    block = {
      ...block,
      expressions,
      children: block.children === block.expressions ? expressions :
        block.children.map((c) => c === block.expressions ? expressions : c),
    }
    // Add braces if block lacked them
    if (block.bare) {
      // Now copied, so mutation is OK
      block.children = [[" {"], ...block.children, "}"]
      block.bare = false
    }
  }

  return block
}

function closest(node, types) {
  do {
    if (types.includes(node.type)) {
      return node
    }
  } while (node = node.parent)
}

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

function constructInvocation(fn, arg) {
  const fnArr = [fn.leadingComment, fn.expr, fn.trailingComment]

  // Unwrap ampersand blocks
  let expr = fn.expr
  while (expr.type === "ParenthesizedExpression") {
    expr = expr.expression
  }
  if (expr.ampersandBlock) {
    const { ref, body } = expr

    ref.type = "PipedExpression"
    ref.children = [makeLeftHandSideExpression(arg)]

    return {
      type: "UnwrappedExpression",
      children: [skipIfOnlyWS(fn.leadingComment), ...body, skipIfOnlyWS(fn.trailingComment)],
    }
  }

  expr = fn.expr
  const lhs = makeLeftHandSideExpression(expr)

  // Attach comments
  let comment = skipIfOnlyWS(fn.trailingComment)
  if (comment) lhs.children.splice(2, 0, comment)
  comment = skipIfOnlyWS(fn.leadingComment)
  if (comment) lhs.children.splice(1, 0, comment)

  switch (arg.type) {
    case "CommaExpression":
      arg = makeLeftHandSideExpression(arg)
      break
  }

  return {
    type: "CallExpression",
    children: [lhs, "(", arg, ")"],
  }
}

function constructPipeStep(fn, arg, returning) {
  const children = [[fn.leadingComment, fn.expr, fn.trailingComment].map(skipIfOnlyWS), " ", arg]

  // Handle special non-function cases
  switch (fn.expr.token) {
    case "yield":
    case "await":
      if (returning) {
        return [
          children,
          returning
        ]
      }

      return [
        children,
        null
      ]

    case "return":
      // Return ignores ||> returning argument
      return [{
        type: "ReturnStatement",
        children,
      }, null]
  }

  if (returning) {
    return [
      constructInvocation(fn, arg),
      returning
    ]

  }

  return [constructInvocation(fn, arg), null]
}

// Split out leading newlines from the first indented line
const initialSpacingRe = /^(?:\r?\n|\n)*((?:\r?\n|\n)\s+)/

function dedentBlockString({ $loc, token: str }, spacing, trim = true) {
  // If string begins with a newline then indentation assume that it should be removed for all lines
  if (spacing == null) spacing = str.match(initialSpacingRe)

  if (spacing) {
    str = str.replaceAll(spacing[1], "\n")
    const l = spacing.length
    $loc.pos += l
    $loc.length -= l
  }

  if (trim) {
    // Remove leading newline
    str = str.replace(/^(\r?\n|\n)/, "")
      // Remove trailing newline
      .replace(/(\r?\n|\n)[ \t]*$/, "")
  }

  // escape unescaped backticks and `${`
  str = str.replace(/(\\.|`|\$\{)/g, s => {
    if (s[0] === "\\") {
      return s
    }
    return `\\${s}`
  })

  return {
    $loc,
    token: str,
  }
}

function dedentBlockSubstitutions($0) {
  const [s, strWithSubstitutions, e] = $0

  if (strWithSubstitutions.length === 0) {
    return $0
  }

  let initialSpacing, i = 0, l = strWithSubstitutions.length, results = [s]
  // Get initial spacing from the first string token if it is not a substitution
  const { token } = strWithSubstitutions[0]

  if (token) {
    initialSpacing = token.match(initialSpacingRe)
  } else {
    initialSpacing = false
  }

  while (i < l) {
    let segment = strWithSubstitutions[i]

    if (segment.token) {
      segment = dedentBlockString(segment, initialSpacing, false)
      if (i === 0) {
        // Trim leading newline
        segment.token = segment.token.replace(/^(\r?\n|\n)/, "")
      }
      if (i === l - 1) {
        // Trim trailing newline
        segment.token = segment.token.replace(/(\r?\n|\n)[ \t]*$/, "")
      }
      results.push(segment)
    } else {
      results.push(segment)
    }

    i++
  }

  results.push(e)
  return {
    type: "TemplateLiteral",
    children: results,
  }
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

function expressionizeIfClause(clause, b, e) {
  const children = clause.children.slice(1) // Remove 'if'
  children./**/push("?", b) // Add ternary
  if (e) {
    // Remove 'else'
    children./**/push(e[0], ":", ...e.slice(2))
  }
  else {
    children.push(":void 0")
  }

  return {
    type: "IfExpression",
    children,
  }
}

function expressionizeIteration(exp) {
  const i = exp.children.indexOf(exp.block)

  if (exp.subtype === "DoStatement") {
    // Just wrap with IIFE
    insertReturn(exp.block)
    exp.children.splice(i, 1, ...wrapIIFE(exp.children, exp.async))
    return
  }

  const resultsRef = {
    type: "Ref",
    base: "results",
    id: "results",
  }

  // insert `results.push` to gather results array
  insertPush(exp.block, resultsRef)

  // Wrap with IIFE
  exp.children.splice(i, 1,
    wrapIIFE([
      "const ", resultsRef, "=[];", ...exp.children, "; return ", resultsRef
    ], exp.async)
  )
}

function processBinaryOpExpression($0) {
  const expandedOps = expandChainedComparisons($0)

  // Expanded ops is [a, __, op1, __, b, __, op2, __, c, __, op3, __, d], etc.
  // NOTE: all operators of higher precedence than relational have been merged into the operand expressions
  let i = 2
  while (i < expandedOps.length) {
    const op = expandedOps[i]
    // a in b -> indexOf.call(b, a) >= 0
    // a is in b -> indexOf.call(b, a) >= 0
    // a not in b -> indexOf.call(b, a) < 0
    // a is not in b -> indexOf.call(b, a) < 0
    // a not instanceof b -> !(a instanceof b)
    if (op.special) {
      let [a, wsOp, op, wsB, b] = expandedOps.slice(i - 2, i + 3)

      // typeof shorthand: x instanceof "String" -> typeof x === "string"
      if (op.token === "instanceof" && b.type === "Literal" &&
        b.children?.[0]?.type === "StringLiteral") {
        a = ["typeof ", makeLeftHandSideExpression(a)]
        if (op.negated) {
          op = { ...op, token: "!==", negated: false }
        } else {
          op = { ...op, token: "===" }
        }
      }

      if (op.asConst) {
        a = makeAsConst(a)
        b = makeAsConst(b)
      }

      let children
      if (op.call) {
        wsOp = insertTrimmingSpace(wsOp, "")

        if (op.reversed) {
          wsB = insertTrimmingSpace(wsB, "")
          children = [wsOp, op.call, "(", wsB, b, ", ", a, ")", op.suffix]
        } else {
          children = [wsOp, op.call, "(", a, ",", wsB, b, ")", op.suffix]
        }
      } else if (op.method) {
        wsOp = insertTrimmingSpace(wsOp, "")
        wsB = insertTrimmingSpace(wsB, "")
        if (op.reversed) {
          children = [wsB, b, wsOp, ".", op.method, "(", a, ")"]
        } else {
          children = [a, wsOp, ".", op.method, "(", wsB, b, ")"]
        }
      } else if (op.token) {
        children = [a, wsOp, op, wsB, b]
        if (op.negated) children = ["(", ...children, ")"]
      } else {
        throw new Error("Unknown operator: " + JSON.stringify(op))
      }
      if (op.negated) children.unshift("!")

      expandedOps.splice(i - 2, 5, {
        children
      })
    } else {
      i += 4
    }
  }

  return expandedOps
}

/**
 * Process globs and bind shorthand in Call/MemberExpression
 */
function processCallMemberExpression(node) {
  const { children } = node
  for (let i = 0; i < children.length; i++) {
    const glob = children[i]
    if (glob?.type === "PropertyGlob") {
      // TODO: add ref to ensure object base evaluated only once
      const prefix = children.slice(0, i)
        .concat(glob.dot)
      const parts = []
      for (const part of glob.object.properties) {
        if (part.type === "MethodDefinition") {
          throw new Error("Glob pattern cannot have method definition")
        }
        if (part.value && !["CallExpression", "MemberExpression", "Identifier"].includes(part.value.type)) {
          throw new Error("Glob pattern must have call or member expression value")
        }
        let value = part.value ?? part.name
        const wValue = getTrimmingSpace(part.value)
        value = prefix.concat(insertTrimmingSpace(value, ""))
        if (wValue) value.unshift(wValue)
        if (part.type === "SpreadProperty") {
          parts.push({
            type: part.type,
            value,
            dots: part.dots,
            delim: part.delim,
            names: part.names,
            children: part.children.slice(0, 2) // whitespace, ...
              .concat(value, part.delim)
          })
        } else {
          parts.push({
            type: part.type === "Identifier" ? "Property" : part.type,
            name: part.name,
            value,
            delim: part.delim,
            names: part.names,
            children: [
              isWhitespaceOrEmpty(part.children[0]) && part.children[0],
              part.name,
              isWhitespaceOrEmpty(part.children[2]) && part.children[2],
              part.children[3]?.token === ":" ? part.children[3] : ":",
              value,
              part.delim, // comma delimiter
            ]
          })
        }
      }
      const object = {
        type: "ObjectExpression",
        children: [
          glob.object.children[0], // {
          ...parts,
          glob.object.children.at(-1), // whitespace and }
        ],
        properties: parts,
      }
      if (i === children.length - 1) return object
      return processCallMemberExpression({  // in case there are more
        ...node,
        children: [object, ...children.slice(i + 1)]
      })
    } else if (glob?.type === "PropertyBind") {
      // TODO: add ref to ensure object base evaluated only once
      const prefix = children.slice(0, i)
      return processCallMemberExpression({  // in case there are more
        ...node,
        children: [
          prefix,
          {
            ...glob,
            type: "PropertyAccess",
            children: [...glob.children, ".bind(", prefix, ")"]
          },
          ...children.slice(i + 1)
        ]
      })
    }
  }
  return node
}

function wrapIterationReturningResults(statement, outerRef) {
  if (statement.type === "DoStatement") {
    if (outerRef) {
      insertPush(statement.block, outerRef)
    } else {
      insertReturn(statement.block)
    }
    return
  }

  const resultsRef = {
    type: "Ref",
    base: "results",
    id: "results",
  }

  const declaration = {
    type: "Declaration",
    children: ["const ", resultsRef, "=[];"],
  }

  insertPush(statement.block, resultsRef)

  statement.children.unshift(declaration)
  if (outerRef) {
    statement.children.push(";", outerRef, ".push(", resultsRef, ");")
  } else {
    statement.children.push(";return ", resultsRef, ";")
  }
}

// NOTE: this is almost the same as insertReturn but doesn't remove `breaks` in `when` and
// does construct an else clause pushing undefined in if statements that lack them
// and adds to the beginning and the end of the expression's children.
// Maybe these insertion modifications can be refactored to be more DRY eventually.
function insertPush(node, ref) {
  if (!node) return
  // TODO: unify this with the `exp` switch
  switch (node.type) {
    case "BlockStatement":
      if (node.expressions.length) {
        const last = node.expressions[node.expressions.length - 1]
        insertPush(last, ref)
      } else {
        node.expressions.push([ref, ".push(void 0);"])
      }
      return
    case "CaseBlock":
      node.clauses.forEach((clause) => {
        insertPush(clause, ref)
      })
      return
    // NOTE: "CaseClause"s don't push
    case "WhenClause":
      insertPush(node.block, ref)
      return
    case "DefaultClause":
      insertPush(node.block, ref)
      return
  }
  if (!Array.isArray(node)) return

  const [, exp] = node
  if (!exp) return
  const indent = getIndent(node)

  switch (exp.type) {
    case "BreakStatement":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "EmptyStatement":
    case "ReturnStatement":
    case "ThrowStatement":
    case "Declaration":
      return
    case "ForStatement":
    case "IterationStatement":
    case "DoStatement":
      wrapIterationReturningResults(exp, ref)
      return
    case "BlockStatement":
      insertPush(exp.expressions[exp.expressions.length - 1], ref)
      return
    case "IfStatement":
      // if block
      insertPush(exp.then, ref)
      // else block
      if (exp.else) insertPush(exp.else[2], ref)
      // Add else block pushing undefined if no else block
      else exp.children.push([" else {\n", indent, ref, ".push(undefined)\n", indent, "}"])
      return
    case "PatternMatchingStatement":
      insertPush(exp.children[0][0], ref)
      return
    case "SwitchStatement":
      // insert a results.push in each case block
      insertPush(exp.children[2], ref)
      return
    case "TryStatement":
      // NOTE: CoffeeScript doesn't add a push to an empty catch block but does add if there is any statement in the catch block
      // we always add a push to the catch block
      // NOTE: does not insert a push in the finally block
      exp.blocks.forEach(block => insertPush(block, ref))
      return
  }

  // Don't push if there's a trailing semicolon
  if (node[node.length - 1]?.type === "SemicolonDelimiter") return

  // Insert push wrapping expression
  node.splice(1, 0, ref, ".push(")
  node.push(")")
}

function wrapWithReturn(expression) {
  const children = expression ? ["return ", expression] : ["return"]

  return {
    type: "ReturnStatement",
    children,
  }
}

/**
* binops is an array of [__, op, __, exp] tuples
* first is an expression
*/
function expandChainedComparisons([first, binops]) {
  // TODO: add refs to ensure middle expressions are evaluated only once

  // all relational operators could be chained in theory, including in and instanceof
  const relationalOps = ["==", "===", "!=", "!==", "<", "<=", ">", ">=", "in"]

  // short circuit/bitwise ops have lower precedence than comparison ops
  // so we only need to look for chains in the sections between them
  const lowerPrecedenceOps = ["??", "&&", "||", "&", "|", "^"]

  // shift/arithmetic ops have higher precedence, they will bind to expressions inside the chains
  // const higherPrecedenceOps = ["<<", ">>", ">>>", "+", "-", "*", "**", "/", "%"]

  let results = []

  let i = 0
  let l = binops.length

  let start = 0
  // indexes of chainable ops
  let chains = []
  while (i < l) {
    const [, op] = binops[i]

    // NOTE: Treat Coffee `in` and `not in` ops as relational.
    if (relationalOps.includes(op.token) || op.relational) {
      chains.push(i)
    } else if (lowerPrecedenceOps.includes(op.token)) {
      // end of the chain
      processChains()
      first = []
    }

    i++
  }

  processChains()

  return results

  function processChains() {
    if (chains.length > 1) {
      chains.forEach((index, k) => {
        if (k > 0) {
          // NOTE: Inserting ws tokens to keep even operator spacing in the resulting array
          results.push(" ", "&&", " ")
        }
        const [pre, op, post, exp] = binops[index]

        let endIndex
        if (k < chains.length - 1) {
          endIndex = chains[k + 1]
        } else {
          endIndex = i + 1
        }

        results = results.concat(first, ...binops.slice(start, endIndex))
        first = [exp].concat(binops.slice(index + 1, endIndex))
        start = endIndex
      })
    } else {
      // Advance start if there was no chain
      results = results.concat(first, ...binops.slice(start, i + 1))
      start = i + 1
    }

    chains.length = 0
  }
}

function processParams(f) {
  const { type, parameters, block } = f
  // Check for singleton TypeParameters <Foo> before arrow function,
  // which TypeScript (in tsx mode) treats like JSX; replace with <Foo,>
  if (type === "ArrowFunction" && parameters && parameters.tp && parameters.tp.parameters.length === 1) {
    parameters.tp.parameters.push(",")
  }

  if (!block) return
  const { expressions } = block
  if (!expressions) return
  const { blockPrefix } = parameters

  let indent
  if (!expressions.length) {
    indent = ""
  } else {
    indent = expressions[0][0]
  }

  const [splices, thisAssignments] = gatherBindingCode(parameters, {
    injectParamProps: f.name === 'constructor'
  })

  const delimiter = {
    type: "SemicolonDelimiter",
    children: [";"],
  }

  const prefix = splices
    .map(s => ["let ", s])
    .concat(thisAssignments)
    .map((s) => s.type
      ? {
        ...s,
        children: [indent, ...s.children, delimiter]
      }
      : [indent, s, delimiter]
    )

  expressions.unshift(...prefix)
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

// Find nearest strict ancestor that satisfies predicate,
// aborting (and returning undefined) if stopPredicate returns true
function findAncestor(node, predicate, stopPredicate) {
  node = node.parent
  while (node && !stopPredicate?.(node)) {
    if (predicate(node)) return node
    node = node.parent
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

/**
 * Gets the indentation node from a statement. Includes newline,
 * excludes comments, strips location info.
 */
function getIndent(statement) {
  let indent = statement?.[0]
  if (Array.isArray(indent)) {
    indent = indent.flat(Infinity)

    return indent.filter((n) => n && !(n.type === "Comment")).map((n) => {
      if (typeof n === "string") return n
      if (n.token != null) return n.token
      return ""
    })
  }
  return indent
}

/**
 * Does this expression have an `await` in it and thus needs to be `async`?
 */
function hasAwait(exp) {
  return gatherRecursiveWithinFunction(exp, ({ type }) => type === "Await").length > 0
}

function hasYield(exp) {
  return gatherRecursiveWithinFunction(exp, ({ type }) => type === "Yield").length > 0
}

function hoistRefDecs(statements) {
  gatherRecursiveAll(statements, (s) => s.hoistDec)
    .forEach(node => {
      const { hoistDec } = node

      // TODO: expand set to include other parents that can have hoistable decs attached
      let outer = closest(node, ["IfStatement", "IterationStatement"])
      if (!outer) {
        node.children.push({
          type: "Error",
          message: "Can't hoist declarations inside expressions yet."
        })
        return
      }

      let block = outer.parent
      // TODO: Hack until the compiler replaces PatternMatchingStatement with IfStatement
      if (block.type === "PatternMatchingStatement") {
        outer = block
        block = block.parent
      }

      // NOTE: This is more accurately 'statements'
      const { expressions } = block
      const index = expressions.findIndex(([, s]) => outer === s)
      if (index < 0) throw new Error("Couldn't find expression in block for hoistable declaration.")
      const indent = expressions[index][0]
      hoistDec[0][0] = indent
      expressions.splice(index, 0, hoistDec)

      node.hoistDec = null
    })
}

// [indent, statement, semicolon]
function insertReturn(node) {
  if (!node) return
  // TODO: unify this with the `exp` switch
  switch (node.type) {
    case "BlockStatement":
      if (node.expressions.length) {
        const last = node.expressions[node.expressions.length - 1]
        insertReturn(last)
      } else {
        // NOTE: Kind of hacky but I'm too much of a coward to make `->` add an implicit return
        if (node.parent.type === "CatchClause") {
          node.expressions.push(["return"])
        }
      }
      return
    // NOTE: "CaseClause"s don't get a return statements inserted
    case "WhenClause":
      // Remove inserted `break;`
      node.children.splice(node.children.indexOf(node.break), 1)
      if (node.block.expressions.length) {
        insertReturn(node.block)
      } else {
        node.block.expressions.push(wrapWithReturn())
      }
      return
    case "DefaultClause":
      insertReturn(node.block)
      return
  }
  if (!Array.isArray(node)) return

  const [, exp, semi] = node
  if (semi?.type === "SemicolonDelimiter") return
  let indent = getIndent(node)
  if (!exp) return

  switch (exp.type) {
    case "BreakStatement":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "EmptyStatement":
    case "ReturnStatement":
    case "ThrowStatement":
    case "Declaration":
      return
    case "ForStatement":
    case "IterationStatement":
    case "DoStatement":
      wrapIterationReturningResults(exp)
      return
    case "BlockStatement":
      insertReturn(exp.expressions[exp.expressions.length - 1])
      return
    case "IfStatement":
      // if block
      insertReturn(exp.then)
      // else block
      if (exp.else) insertReturn(exp.else[2])
      // Add explicit return after if block if no else block
      else exp.children.push(["", {
        type: "ReturnStatement",
        // NOTE: add a prefixed semi-colon because the if block may not be braced
        children: [";return"],
      }])
      return
    case "PatternMatchingStatement":
      insertReturn(exp.children[0][0])
      return
    case "SwitchStatement":
      insertSwitchReturns(exp)
      return
    case "TryStatement":
      exp.blocks.forEach(block => insertReturn(block))
      // NOTE: do not insert a return in the finally block
      return
  }

  // Don't add return if there's a trailing semicolon
  if (node[node.length - 1]?.type === "SemicolonDelimiter") return

  // Insert return after indentation and before expression
  const returnStatement = wrapWithReturn(node[1])
  node.splice(1, 1, returnStatement)
}

// insert a return in each when/else/default block
// case blocks don't get implicit returns
// maybe default blocks shouldn't either?
function insertSwitchReturns(exp) {
  switch (exp.type) {
    case "SwitchStatement":
      exp.caseBlock.clauses.forEach((clause) => {
        insertReturn(clause)
      })
      return
    case "SwitchExpression":
      // TODO: insert IIFE returns
      // by altering "ReturnStatement" nodes
      exp.caseBlock.clauses.forEach(insertReturn)
      return
  }
}


function isEmptyBareBlock(node) {
  if (node?.type !== "BlockStatement") return false
  const { bare, expressions } = node
  return bare &&
    (expressions.length === 0 ||
      (expressions.length === 1 &&
        expressions[0][1]?.type === "EmptyStatement"))
}

function isFunction(node) {
  const { type } = node
  return type === "FunctionExpression" || type === "ArrowFunction" ||
    type === "MethodDefinition" || node.async
  // do blocks can be marked async to prevent automatic await
}

/**
 * Returns true if the StringLiteral node is a template literal.
 */
function isTemplateLiteral(node) {
  let s = node
  while (s && s[0] && !s.token) s = s[0]
  return s.token?.startsWith?.('`')
}

function isVoidType(t) {
  return t?.type === "LiteralType" && t.t.type === "VoidType"
}

function isWhitespaceOrEmpty(node) {
  if (!node) return true
  if (node.type === "Ref") return false
  if (node.token) return node.token.match(/^\s*$/)
  if (node.children) node = node.children
  if (!node.length) return true
  if (typeof node === "string") return node.match(/^\s*$/)
  if (Array.isArray(node)) return node.every(isWhitespaceOrEmpty)
}

function gatherRecursiveWithinFunction(node, predicate) {
  return gatherRecursive(node, predicate, isFunction)
}

// Trims the first single space from the spacing array or node's children if present
// maintains $loc for source maps
function insertTrimmingSpace(target, c) {
  if (!target) return target

  if (Array.isArray(target)) return target.map((e, i) => {
    if (i === 0) return insertTrimmingSpace(e, c)
    return e
  })
  if (target.children) return Object.assign({}, target, {
    children: target.children.map((e, i) => {
      if (i === 0) return insertTrimmingSpace(e, c)
      return e
    })
  })

  if (target.token) return Object.assign({}, target, {
    token: target.token.replace(/^ ?/, c)
  })

  return target
}

// Returns leading space as a string, or undefined if none
function getTrimmingSpace(target) {
  if (!target) return
  if (Array.isArray(target)) return getTrimmingSpace(target[0])
  if (target.children) return getTrimmingSpace(target.children[0])
  if (target.token) return target.token.match(/^ ?/)[0]
}

// Construct for loop from RangeLiteral
function forRange(open, forDeclaration, range, stepExp, close) {
  const { start, end, inclusive } = range

  const counterRef = {
    type: "Ref",
    base: "i",
    id: "i",
  }

  let stepRef
  if (stepExp) {
    stepExp = insertTrimmingSpace(stepExp, "")
    stepRef = maybeRef(stepExp, "step")
  }

  const startRef = maybeRef(start, "start")
  const endRef = maybeRef(end, "end")

  const startRefDec = (startRef !== start) ? [startRef, " = ", start, ", "] : []
  const endRefDec = (endRef !== end) ? [endRef, " = ", end, ", "] : []

  let ascDec = [], ascRef, asc
  if (stepRef) {
    if (stepRef !== stepExp) {
      ascDec = [", ", stepRef, " = ", stepExp]
    }
  } else if (start.type === "Literal" && end.type === "Literal") {
    asc = literalValue(start) <= literalValue(end)
  } else {
    ascRef = {
      type: "Ref",
      base: "asc",
      id: "asc",
    }
    ascDec = [", ", ascRef, " = ", startRef, " <= ", endRef]
  }

  let varAssign = [], varLetAssign = varAssign, varLet = varAssign, blockPrefix
  if (forDeclaration?.declare) { // var/let/const declaration of variable
    if (forDeclaration.declare.token === "let") {
      const varName = forDeclaration.children.splice(1)  // strip let
      varAssign = [...insertTrimmingSpace(varName, ""), " = "]
      varLet = [",", ...varName, " = ", counterRef]
    } else { // const or var: put inside loop
      // TODO: missing indentation
      blockPrefix = [
        ["", forDeclaration, " = ", counterRef, ";"]
      ]
    }
  } else if (forDeclaration) { // Coffee-style for loop
    varAssign = varLetAssign = [forDeclaration, " = "]
  }

  const declaration = {
    type: "Declaration",
    children: ["let ", ...startRefDec, ...endRefDec, counterRef, " = ", ...varLetAssign, startRef, ...varLet, ...ascDec],
    names: forDeclaration?.names,
  }

  const counterPart = inclusive
    ? [counterRef, " <= ", endRef, " : ", counterRef, " >= ", endRef]
    : [counterRef, " < ", endRef, " : ", counterRef, " > ", endRef]

  const condition = stepRef
    ? [stepRef, " !== 0 && (", stepRef, " > 0 ? ", ...counterPart, ")"]
    : ascRef
      ? [ascRef, " ? ", ...counterPart]
      : asc ? counterPart.slice(0, 3) : counterPart.slice(4)

  const increment = stepRef
    ? [...varAssign, counterRef, " += ", stepRef]
    : ascRef
      ? [...varAssign, ascRef, " ? ++", counterRef, " : --", counterRef]
      : [...varAssign, asc ? "++" : "--", counterRef]

  return {
    declaration,
    children: [open, declaration, "; ", ...condition, "; ", ...increment, close],
    blockPrefix,
  }
}

function gatherBindingCode(statements, opts) {
  const thisAssignments = []
  const splices = []

  function insertRestSplices(s, p, thisAssignments) {
    gatherRecursiveAll(s, n => n.blockPrefix || (opts?.injectParamProps && n.accessModifier) || n.type === "AtBinding")
      .forEach((n) => {
        // Insert `this` assignments
        if (n.type === "AtBinding") {
          const { ref } = n, { id } = ref
          thisAssignments.push([`this.${id} = `, ref])
          return
        }

        if (opts?.injectParamProps && n.type === "Parameter" && n.accessModifier) {
          n.names.forEach(id => {
            thisAssignments.push({
              type: "AssignmentExpression",
              children: [`this.${id} = `, id],
              js: true
            })
          })
          return
        }

        const { blockPrefix } = n
        p.push(blockPrefix)

        // Search for any further nested splices, and at bindings
        insertRestSplices(blockPrefix, p, thisAssignments)
      })
  }

  insertRestSplices(statements, splices, thisAssignments)

  return [splices, thisAssignments]
}

// Convert (non-Template) Literal to actual JavaScript value
function literalValue(literal) {
  let { raw } = literal
  switch (raw) {
    case "null": return null
    case "true": return true
    case "false": return false
  }
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    return raw.slice(1, -1)
  }
  const numeric = literal.children.find(
    (child) => child.type === "NumericLiteral"
  )
  if (numeric) {
    raw = raw.replace(/_/g, "")
    const { token } = numeric
    if (token.endsWith("n")) {
      return BigInt(raw.slice(0, -1))
    } else if (token.match(/[\.eE]/)) {
      return parseFloat(raw)
    } else if (token.startsWith("0")) {
      switch (token.charAt(1).toLowerCase()) {
        case "x": return parseInt(raw.replace(/0[xX]/, ""), 16)
        case "b": return parseInt(raw.replace(/0[bB]/, ""), 2)
        case "o": return parseInt(raw.replace(/0[oO]/, ""), 8)
      }
    }
    return parseInt(raw, 10)
  }
  throw new Error("Unrecognized literal " + JSON.stringify(literal))
}

const asConst = {
  ts: true,
  children: [" as const"]
}

function makeAsConst(node) {
  // TS allows "as const" assertions for string, number, boolean, array,
  // and object literals (and enum members), but not for null/undefined.
  if ((node.type === "Literal" && node.raw !== "null") ||
    node.type === "ArrayExpression" ||
    node.type === "ObjectExpression") {
    return { ...node, children: [...node.children, asConst] }
  }
  return node
}

/**
 * Convert general ExtendedExpression into LeftHandSideExpression
 * TODO: Avoid parentheses in more cases by adding more types.
 * by optionally wrapping in parentheses.
 */
function makeLeftHandSideExpression(expression) {
  switch (expression.type) {
    case "Ref":
    case "Identifier":
    case "Literal":
    case "CallExpression":
    case "MemberExpression":
    case "ParenthesizedExpression":
      return expression
    default:
      return {
        type: "ParenthesizedExpression",
        children: ["(", expression, ")"],
        expression,
      }
  }
}

// Transform into a ref if needed
function maybeRef(exp, base = "ref") {
  if (!needsRef(exp)) return exp
  return {
    type: "Ref",
    base: base,
    id: base,
  }
}

// Adjust a parsed string by escaping newlines
function modifyString(str) {
  // Replace non-escaped newlines with escaped newlines
  // taking into account the possibility of a preceding escaped backslash
  return str.replace(/(^.?|[^\\]{2})(\\\\)*\n/g, '$1$2\\n')
}

// Add quotes around a string to make it a valid JavaScript string,
// escaping any \s
function quoteString(str) {
  str = str.replace(/\\/g, '\\\\')
  if (str.includes('"') && !str.includes("'")) {
    return "'" + str.replace(/'/g, "\\'") + "'"
  } else {
    return '"' + str.replace(/"/g, '\\"') + '"'
  }
}

// Look for last property access like `.foo` or `[computed]` or root Identifier,
// before any calls like `(args)`, non-null assertions `!`, and optionals `?`.
// The return value should have a `name` property (for "Identifier" and
// "Index"), or have `type` of "Index" (for `[computed]`), or be undefined.
function lastAccessInCallExpression(exp) {
  let children, i
  do {
    ({ children } = exp)
    i = children.length - 1
    while (i >= 0 && (
      children[i].type === "Call" ||
      children[i].type === "NonNullAssertion" ||
      children[i].type === "Optional"
    )) i--
    if (i < 0) return
    // Recurse into nested MemberExpression, e.g. from `x.y()`
  } while (children[i].type === "MemberExpression" && (exp = children[i]))
  return children[i]
}

// Given a MethodDefinition, convert into a FunctionExpression.
// Returns undefined if the method is a getter or setter.
function convertMethodToFunction(method) {
  const { signature, block } = method
  let { modifier } = signature
  if (modifier) {
    if (modifier.get || modifier.set) {
      return
    } else if (modifier.async) {
      // put function after async
      modifier = [modifier.children[0][0], " function ", ...modifier.children.slice(1)]
    } else {
      modifier = ["function ", ...modifier.children]
    }
  } else {
    modifier = "function ";
  }
  return {
    ...signature,
    id: signature.name,
    type: "FunctionExpression",
    children: [
      [modifier, ...signature.children.slice(1)],
      block,
    ],
    block,
  }
}

// Convert an ObjectExpression (with `properties`)
// into a set of JSX attributes.
// {foo} is equivalent to foo={foo}, and
// {foo, bar: baz} is equivalent to foo={foo} and bar={baz}.
// {...foo} is a special case.
function convertObjectToJSXAttributes(obj) {
  const { properties } = obj
  const parts = [] // JSX attributes
  const rest = []  // parts that need to be in {...rest} form
  for (let i = 0; i < properties.length; i++) {
    if (i > 0) parts.push(' ')
    const part = properties[i]
    switch (part.type) {
      case 'Identifier':
        parts.push([part.name, '={', part.name, '}'])
        break
      case 'Property':
        if (part.name.type === 'ComputedPropertyName') {
          rest.push(part)
        } else {
          parts.push([part.name, '={', insertTrimmingSpace(part.value, ''), '}'])
        }
        break
      case 'SpreadProperty':
        parts.push(['{', part.dots, part.value, '}'])
        break
      case 'MethodDefinition':
        const func = convertMethodToFunction(part)
        if (func) {
          parts.push([part.name, '={', convertMethodToFunction(part), '}'])
        } else {
          rest.push(part)
        }
        break
      default:
        throw new Error(`invalid object literal type in JSX attribute: ${part.type}`)
    }
  }
  if (rest.length) {
    parts.push(['{...{', ...rest, '}}'])
  }
  return parts
}

/**
 * Returns a new ref if the expression needs a ref (not a simple value).
 * Otherwise returns undefined.
 */
function needsRef(expression, base = "ref") {
  switch (expression.type) {
    case "Ref":
    case "Identifier":
    case "Literal":
      return
    default:
      return {
        type: "Ref",
        base,
        id: base,
      }
  }
}

// Return an array of Rule names that correspond to the current call stack
function parsePosition() {
  let s = Error().stack.split(/\n    at /)
  s./**/shift()
  s = s.filter((e) => !e.match(/^eval/)).map((e) => e.split(' ')[0])
  s = s.slice(1, s.indexOf('Program') + 1)

  return s
}

function processCoffeeInterpolation(s, parts, e, $loc) {
  // Check for no interpolations
  if (parts.length === 0 || (parts.length === 1 && parts[0].token != null)) {
    return {
      type: "StringLiteral",
      token: parts.length ? `"${modifyString(parts[0].token)}"` : '""',
      $loc,
    }
  }

  parts.forEach((part) => {
    // Is a string
    if (part.token) {
      // Escape '${' and '`'
      const str = part.token.replace(/(`|\$\{)/g, "\\$1")
      // Escape non-continuation newlines
      part.token = modifyString(str)
    }
  })

  // Convert to backtick enclosed string
  s.token = e.token = "`"

  return {
    type: "TemplateLiteral",
    children: [s, parts, e],
  }
}

function processConstAssignmentDeclaration(c, id, suffix, ws, ca, e) {
  // Adjust position to space before assignment to make TypeScript remapping happier
  c = {
    ...c,
    $loc: {
      pos: ca.$loc.pos - 1,
      length: ca.$loc.length + 1,
    }
  }

  let exp
  if (e.type === "FunctionExpression") {
    exp = e
  } else {
    exp = e[1]
  }

  // TODO: Better AST nodes so we don't have to adjust for whitespace nodes here
  if (exp?.children?.[0]?.token?.match(/^\s+$/)) exp.children.shift()

  if (id.type === "Identifier" && exp?.type === "FunctionExpression" && !exp.id) {
    const i = exp.children.findIndex(c => c?.token === "function") + 1
    exp = {
      ...exp,
      // Insert id, type suffix, spacing
      children: [...exp.children.slice(0, i), " ", id, suffix, ws, ...exp.children.slice(i)]
    }
    return {
      type: "Declaration",
      children: [exp],
      names: id.names,
    }
  }

  let [splices, thisAssignments] = gatherBindingCode(id)

  splices = splices.map(s => [", ", s])
  thisAssignments = thisAssignments.map(a => ["", a, ";"])

  const binding = [c, id, suffix, ...ws]
  const initializer = [ca, e]

  const children = [binding, initializer]

  return {
    type: "Declaration",
    names: id.names,
    children,
    binding,
    initializer,
    splices,
    thisAssignments,
  }
}

function processLetAssignmentDeclaration(l, id, suffix, ws, la, e) {
  // Adjust position to space before assignment to make TypeScript remapping happier
  l = {
    ...l,
    $loc: {
      pos: la.$loc.pos - 1,
      length: la.$loc.length + 1,
    }
  }

  let [splices, thisAssignments] = gatherBindingCode(id)

  splices = splices.map(s => [", ", s])
  thisAssignments = thisAssignments.map(a => ["", a, ";"])

  const binding = [l, id, suffix, ...ws]
  const initializer = [la, e]

  const children = [binding, initializer]

  return {
    type: "Declaration",
    names: id.names,
    children,
    binding,
    initializer,
    splices,
    thisAssignments,
  }
}

/**
 * Support for `return.value` and `return =`
 * for changing automatic return value of function.
 * Returns whether any present (so shouldn't do implicit return).
 */
function processReturnValue(func) {
  const { block } = func
  const values = gatherRecursiveWithinFunction(block,
    ({ type }) => type === "ReturnValue")
  if (!values.length) return false

  const ref = {
    type: "Ref",
    base: "ret",
    id: "ret",
  }

  let declared
  values.forEach(value => {
    value.children = [ref]

    // Check whether return.value already declared within this function
    const ancestor = findAncestor(value,
      ({ type }) => type === "Declaration",
      isFunction)
    if (ancestor) declared = true
  })

  // Add declaration of return.value after {
  if (!declared) {
    let returnType = func.returnType ?? func.signature?.returnType
    if (returnType) {
      const { t } = returnType
      if (t.type === "TypePredicate") {
        returnType = ": boolean"
      } else if (t.type === "AssertsType") {
        returnType = undefined
      }
    }
    block.expressions.unshift([
      getIndent(block.expressions[0]),
      {
        type: "Declaration",
        children: ["let ", ref, returnType],
        names: [],
      },
      ";"
    ])
  }

  // Transform existing `return` -> `return ret`
  gatherRecursiveWithinFunction(block,
    r => r.type === "ReturnStatement" && !r.expression)
    .forEach((r) => {
      r.expression = ref
      r.children.splice(-1, 1, " ", ref)
    })

  // Implicit return before }
  if (block.children.at(-2)?.type !== "ReturnStatement") {
    block.expressions.push([
      [getIndent(block.expressions.at(-1))],
      {
        type: "ReturnStatement",
        expression: ref,
        children: ["return ", ref]
      }
    ])
  }

  return true
}

function processUnaryExpression(pre, exp, post) {
  if (!(pre.length || post)) return exp
  // Handle "?" postfix
  if (post?.token === "?") {
    post = {
      $loc: post.$loc,
      token: " != null",
    }

    switch (exp.type) {
      case "Identifier":
      case "Literal":
        return {
          ...exp,
          children: [...pre, ...exp.children, post]
        }
      default:
        const expression = {
          ...exp,
          children: [...pre, "(", exp.children, ")", post]
        }

        return {
          type: "ParenthesizedExpression",
          children: ["(", expression, ")"],
          expression,
        }
    }
  }

  // Combine unary - to create negative numeric literals
  if (exp.type === "Literal") {
    if (pre.length === 1 && pre[0].token === "-") {
      const children = [pre[0], ...exp.children]
      if (post) exp.children./**/push(post)

      return {
        type: "Literal",
        children,
        raw: `-${exp.raw}`
      }
    }
  }

  // Await ops
  const l = pre.length
  if (l) {
    const last = pre[l - 1]
    if (last.type === "Await" && last.op) {
      if (exp.type !== "ParenthesizedExpression") {
        exp = ["(", exp, ")"]
      }
      exp = {
        type: "CallExpression",
        children: [" Promise", last.op, exp]
      }
    }
  }

  return {
    type: "UnaryExpression",
    children: [...pre, exp, post]
  }
}

function prune(node) {
  if (node === null || node === undefined) return
  if (node.length === 0) return

  if (Array.isArray(node)) {
    const a = node
      .map((n) => prune(n))
      .filter((n) => !!n)

    if (a.length > 1) return a
    if (a.length === 1) return a[0]
    return
  }

  if (node.children != null) {
    node.children = prune(node.children)
    return node
  }

  return node
}

function reorderBindingRestProperty(props) {
  const names = props.flatMap(p => p.names)

  let restIndex = -1
  let restCount = 0
  props.forEach(({ type }, i) => {
    if (type === "BindingRestProperty") {
      if (restIndex < 0) restIndex = i
      restCount++
    }
  })

  if (restCount === 0) {
    return {
      children: props,
      names,
    }
  } else if (restCount === 1) {
    let after = props.slice(restIndex + 1)
    let rest = props[restIndex]

    props = props.slice(0, restIndex);

    // Swap delimiters of last property and rest so that an omitted trailing comma doesn't end up in the middle
    if (after.length) {
      const
        [restDelim] = rest.children.slice(-1),
        lastAfterProp = after[after.length - 1],
        lastAfterChildren = lastAfterProp.children,
        [lastDelim] = lastAfterChildren.slice(-1)

      rest = { ...rest, children: [...rest.children.slice(0, -1), lastDelim] }
      after = [...after.slice(0, -1), { ...lastAfterProp, children: [...lastAfterChildren.slice(0, -1), restDelim] }]
    }

    const children = [...props, ...after, rest]

    return {
      children,
      names,
    }
  }

  return {
    children: [{
      type: "Error",
      message: "Multiple rest properties in object pattern",
    }, props]
  }
}

/**
 * Replace all nodes that match predicate with replacer(node)
 */
function replaceNodes(root, predicate, replacer) {
  if (root == null) return root
  const array = Array.isArray(root) ? root : root.children
  if (!array) return root
  array.forEach((node, i) => {
    if (node == null) return
    if (predicate(node)) {
      array[i] = replacer(node, root)
    } else {
      replaceNodes(node, predicate, replacer)
    }
  })
  return root
}

/**
 * Used to ignore the result of __ if it is only whitespace
 * Useful to preserve spacing around comments
 */
function skipIfOnlyWS(target) {
  if (!target) return target
  if (Array.isArray(target)) {
    if (target.length === 1) {
      return skipIfOnlyWS(target[0])
    } else if (target.every(e => (skipIfOnlyWS(e) === undefined))) {
      return undefined
    }
    return target
  }
  if (target.token != null && target.token.trim() === '') {
    return undefined
  }
  return target
}

/**
 * Wrap an expression in an IIFE, adding async/await if expression
 * uses await, or just adding async if specified.
 * Returns an Array suitable for `children`.
 */
function wrapIIFE(exp, async) {
  let prefix, suffix
  if (async) {
    prefix = "(async ()=>"
    suffix = ")()"
  } else if (hasAwait(exp)) {
    prefix = "(await (async ()=>"
    suffix = ")())"
  } else {
    prefix = "(()=>"
    suffix = ")()"
  }

  // TODO: This rest prevents an infinite recursion bug, ideally it wouldn't be necessary
  const expressions = Array.isArray(exp) ? [[...exp]] : [exp]
  const block = {
    type: "BlockStatement",
    expressions,
    children: ["{", expressions, "}"],
    bare: false,
  }

  // TODO: This should return a call expression ideally
  return [
    prefix,
    block,
    suffix,
  ]
}

module.exports = {
  addParentPointers,
  addPostfixStatement,
  adjustAtBindings,
  adjustBindingElements,
  aliasBinding,
  arrayElementHasTrailingComma,
  blockWithPrefix,
  clone,
  constructInvocation,
  constructPipeStep,
  convertMethodToFunction,
  convertObjectToJSXAttributes,
  dedentBlockString,
  dedentBlockSubstitutions,
  deepCopy,
  expressionizeIfClause,
  expressionizeIteration,
  findAncestor,
  forRange,
  gatherBindingCode,
  gatherNodes,
  gatherRecursive,
  gatherRecursiveAll,
  gatherRecursiveWithinFunction,
  getIndent,
  getTrimmingSpace,
  hasAwait,
  hasYield,
  hoistRefDecs,
  insertReturn,
  insertSwitchReturns,
  insertTrimmingSpace,
  isEmptyBareBlock,
  isFunction,
  isVoidType,
  isWhitespaceOrEmpty,
  lastAccessInCallExpression,
  literalValue,
  makeAsConst,
  makeLeftHandSideExpression,
  modifyString,
  needsRef,
  processBinaryOpExpression,
  processCallMemberExpression,
  processCoffeeInterpolation,
  processConstAssignmentDeclaration,
  processLetAssignmentDeclaration,
  processParams,
  processReturnValue,
  processUnaryExpression,
  prune,
  quoteString,
  removeParentPointers,
  reorderBindingRestProperty,
  replaceNodes,
  skipIfOnlyWS,
  wrapIIFE,
}
