# parser.hera Civet Style Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the ~870 action blocks in `source/parser.hera` to idiomatic Civet style without changing semantics.

**Architecture:** Pure style conversion — no semantic changes. Each task covers a line range, applies style guide rules, runs the full test suite to verify no regression, then commits. The Hera grammar syntax (rules, alternatives, capture names) is never touched — only the JavaScript inside `->` action bodies.

**Tech Stack:** Civet, Hera PEG grammar, Node.js/Mocha test suite

**Style guide:** `docs/superpowers/specs/2026-04-02-parser-hera-civet-style-guide.md`

**Key rules (summary):**
- `const x = v` → `x := v`; `let x = v` → `x .= v`; uninitialised `let x` stays
- `===` → `is`; `!==` stays as `!==`
- `&&` → `and`; `||` → `or`; `!x` → `not x`
- `if (x)` → `if x`; `if (!x)` → `unless x`
- `if (x) return y` → `return y if x`; `if (!x) return y` → `return y unless x`
- Grammar action blocks: **always explicit** `return $X` / `return $skip`
- Top-level code block: implicit returns fine for obvious last expressions
- Intentional void return: keep bare `return`
- `x == null` → `not x?`; `x != null` → `x?`
- Map callbacks: `arr.map((x) => x.name)` → `arr.map .name`; `arr.map((x) => expr)` → `arr.map (x) => expr`
- `x.length` → `x#` only when it reads clearly
- `x.type === "Foo" && x.y === "bar"` → `x is like { type: "Foo", y: "bar" }` only when simpler

**Semantic traps to watch:**
- Multi-branch `if/else` chains: the last branch's value can become an implicit return in top-level code. Only drop `return` if the entire function's final expression is the intended return.
- Grammar actions: never rely on implicit return — always explicit.
- `if (x) { sideEffect(); return; }` — the bare `return` means intentional void; keep it.
- Assignments used as conditions: `if ((x = something()))` — leave `const`/parens intact where removing them changes semantics.

---

### Task 0: Baseline — verify tests pass

**Files:** none

- [ ] **Step 1: Run the test suite**

```bash
pnpm test
```

Expected: all tests pass. If any fail, do not proceed — investigate first.

- [ ] **Step 2: Note current test count**

Record the passing test count from the output as a sanity baseline for subsequent tasks.

---

### Task 1: Top-level code block (lines 7–235)

The code between the opening ` ``` ` and closing ` ``` ` at the top of the file. Contains globals, `Object.defineProperties`, `setOperatorBehavior`, `getStateKey`, `parseProgram`, `wellKnownSymbols`.

**Files:**
- Modify: `source/parser.hera:7-235`

- [ ] **Step 1: Apply style conversions**

Read lines 7–235. Apply the style guide. Representative changes:

```
# Before
let filename
let initialConfig
let config
let sync

# After (no change — uninitialized let stays)
let filename
let initialConfig
let config
let sync
```

```
# Before
export const getState = () => state
export const getConfig = () => config

# After (arrow returning expression — keep concise)
export const getState = () => state
export const getConfig = () => config
```

```
# Before (Object.defineProperties getter bodies)
      const {indentLevels: l} = state
      return l[l.length-1]

# After
      {indentLevels: l} := state
      l[l.length-1]   // implicit return — obvious last expression
```

```
# Before
function setOperatorBehavior(name, behavior) {
  const existing = state.operators.get(name)
  if existing and behavior // merge behaviors
    state.operators.set(name, {...existing, ...behavior})
  else // no merge, in particular double undefined -> undefined
    state.operators.set(name, behavior or existing)
  return
}

# After
function setOperatorBehavior(name, behavior)
  existing := state.operators.get(name)
  if existing and behavior // merge behaviors
    state.operators.set(name, {...existing, ...behavior})
  else // no merge
    state.operators.set(name, behavior or existing)
  return  // intentional void — keep
```

```
# Before
export function parseProgram(input, options) {
  filename = options?.filename
  initialConfig = options?.parseOptions
  sync = options?.sync
  const root = parse(input, options)
  if (sync) {
    filename = initialConfig = sync = null
    return root
  } else {
    return processProgramAsync(root)
    .then =>
      filename = initialConfig = sync = null
      return root
  }
}

# After
export function parseProgram(input, options)
  filename = options?.filename
  initialConfig = options?.parseOptions
  sync = options?.sync
  root := parse(input, options)
  if sync
    filename = initialConfig = sync = null
    return root
  else
    return processProgramAsync(root)
    .then =>
      filename = initialConfig = sync = null
      return root
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: same count as baseline, all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert top-level code block to Civet conventions"
```

---

### Task 2: Program / TopLevel / Expressions / Arguments (lines 237–644)

Grammar rules: `Program`, `TopLevelStatements`, `Expression`, `CommaExpression`, `AssignmentExpressionSpread`, `Arguments`, `ImplicitArguments`, `ExplicitArguments`, `ArgumentList`, `PostfixedArgumentList`, `NestedArgument`.

**Files:**
- Modify: `source/parser.hera:237-644`

- [ ] **Step 1: Apply style conversions**

Read lines 237–644. Apply style guide. Representative changes:

```
# Before
    const program = {
      type: "BlockStatement",
      ...
    }
    processProgram(program)
    return program

# After
    program := {
      type: "BlockStatement",
      ...
    }
    processProgram(program)
    return program
```

```
# Before
    if (!expression) return $skip
    if (!trailing) return expression

# After
    return $skip unless expression
    return expression unless trailing
```

```
# Before
    if (args) {
      if (args[1]) { // trailing comma
        args = [ ...args[0], args[1] ]
      } else {
        args = args[0]
      }
    } else {
      args = []
    }

# After
    if args
      if args[1] // trailing comma
        args = [ ...args[0], args[1] ]
      else
        args = args[0]
    else
      args = []
```

```
# Before
    let [ arg0, ...rest ] = args
    arg0 = prepend(indent, arg0)

# After
    [ arg0, ...rest ] .= args
    arg0 = prepend(indent, arg0)
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert Program/TopLevel/Expressions/Arguments to Civet"
```

---

### Task 3: Binary ops / Unary / Update (lines 645–830)

Grammar rules: `BinaryOpExpression`, `BinaryOpRHS`, `IsLike`, `WRHS`, `UnaryExpression`, `UpdateExpression`.

**Files:**
- Modify: `source/parser.hera:645-830`

- [ ] **Step 1: Apply style conversions**

Read lines 645–830. Apply style guide. Representative changes:

```
# Before
    const [ ws1, op ] = $2
    if (op[1].token === ">" && op[0].length === 0) return $skip

# After
    [ ws1, op ] := $2
    return $skip if op[1].token is ">" and op[0].length is 0
```

```
# Before
    if (!wrhs) return $skip

# After
    return $skip unless wrhs
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert BinaryOp/Unary/Update rules to Civet"
```

---

### Task 4: Assignment / Arrow / Conditional / Pipeline (lines 828–1090)

Grammar rules: `AssignmentExpression`, `ActualAssignment`, `YieldExpression`, `ArrowFunction`, `FatArrow`, `ConditionalExpression`, `PipelineExpression`, `PipelineExpressionBody`.

**Files:**
- Modify: `source/parser.hera:828-1090`

- [ ] **Step 1: Apply style conversions**

Read lines 828–1090. Apply style guide. Representative changes:

```
# Before
    if (head.type === "ArrowFunction" && head.ampersandBlock) {
      const expressions = [ { ... } ]
      const block = { ...head.block, expressions, children: [expressions] }
      return { ...head, block, body: expressions, children: [...] }
    }
    return { type: "PipelineExpression", children: [ws, head, body] }

# After
    if head.type is "ArrowFunction" and head.ampersandBlock
      expressions := [ { ... } ]
      block := { ...head.block, expressions, children: [expressions] }
      return { ...head, block, body: expressions, children: [...] }
    return { type: "PipelineExpression", children: [ws, head, body] }
```

```
# Before
    if (!rest.length) return $skip

# After
    return $skip unless rest.length
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert Assignment/Arrow/Pipeline rules to Civet"
```

---

### Task 5: Primary expressions / Class / This / Field (lines 1088–1700)

Grammar rules: `PrimaryExpression`, `ParenthesizedExpression`, `Placeholder`, `ClassDeclaration`, `ClassElement`, `FieldDefinition`, `ThisLiteral`, `HashThis`, `AtThis`, `LeftHandSideExpression`.

**Files:**
- Modify: `source/parser.hera:1088-1700`

- [ ] **Step 1: Apply style conversions**

Read lines 1088–1700. Apply style guide. Representative changes:

```
# Before
    const { expression } = $1

# After
    { expression } := $1
```

```
# Before
    const [expression, ws, close] = $3

# After
    [expression, ws, close] := $3
```

```
# Before
    if (beforeIn != null && at == null) return [ '"', id.name, '"' ]

# After
    return [ '"', id.name, '"' ] if beforeIn? and not at?
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert Primary/Class/This/Field rules to Civet"
```

---

### Task 6: Call / Member / Property / Parameters / Binding (lines 1694–2850)

Grammar rules: `CallExpression`, `MemberExpression`, `MemberExpressionRest`, `PropertyAccess`, `Parameters`, `ParameterElement`, `BindingPattern`, `ObjectBindingPattern`, `ArrayBindingPattern`.

**Files:**
- Modify: `source/parser.hera:1694-2850`

- [ ] **Step 1: Apply style conversions**

Read lines 1694–2850. Apply style guide. Apply the full rule set. This is the longest section — take care with multi-branch if/else chains in action blocks:

```
# Before
    if (something !== null) {
      let children
      ...
    }

# After
    if something?
      children .= undefined
      ...
```

```
# Before
    if (!$2.length && !$3) return $skip

# After
    return $skip unless $2.length or $3
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert Call/Member/Property/Parameters/Binding rules to Civet"
```

---

### Task 7: Block / Statement variants / Literals / Numbers / Strings (lines 2837–3500)

Grammar rules: `Block`, `BracedBlock`, `DeclarationOrStatement`, `SingleLineStatements`, `Literal`, `NullLiteral`, `BooleanLiteral`, `SymbolLiteral`, `NumericLiteral`, string rules.

**Files:**
- Modify: `source/parser.hera:2837-3500`

- [ ] **Step 1: Apply style conversions**

Read lines 2837–3500. Apply style guide.

```
# Before
    let children
    if (something) {
      children = [a, b]
    } else {
      children = [c]
    }
    return { type: "X", children }

# After
    children .= if something
      [a, b]
    else
      [c]
    return { type: "X", children }
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert Block/Statement/Literal rules to Civet"
```

---

### Task 8: Functions / Methods / Iteration / For loops (lines 3500–5275)

Grammar rules: `FunctionDeclaration`, `FunctionExpression`, `MethodDefinition`, `IterationStatement`, `ForStatement`, `ForInOfDeclaration`, type-related rules in this range.

**Files:**
- Modify: `source/parser.hera:3500-5275`

- [ ] **Step 1: Apply style conversions**

Read lines 3500–5275. Apply style guide.

Typical function-heavy patterns:

```
# Before
    const name = something
    if (name === null) return $skip
    return { type: "FunctionDeclaration", name, ... }

# After
    name := something
    return $skip unless name?
    return { type: "FunctionDeclaration", name, ... }
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert Function/Method/Iteration/For rules to Civet"
```

---

### Task 9: Switch / Try / Condition / Config state flags / Statements (lines 5272–5915)

Grammar rules: `SwitchStatement`, `CaseClause`, `TryStatement`, `CatchClause`, `Condition`, `CommaExpressionStatement`, `KeywordStatement`, `ThrowStatement`, state-flag rules (`ForbidBracedApplication`, etc.).

**Files:**
- Modify: `source/parser.hera:5272-5915`

- [ ] **Step 1: Apply style conversions**

Read lines 5272–5915. Apply style guide.

State-flag rules typically have simple one-liner action blocks — straightforward conversions:

```
# Before
    if (!something) return $skip
    return $0

# After
    return $skip unless something
    return $0
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert Switch/Try/Condition/Statements rules to Civet"
```

---

### Task 10: Import / Export / Declarations (lines 5913–7400)

Grammar rules: `ImportDeclaration`, `ImportClause`, `ImportSpecifier`, `ExportDeclaration`, `ExportSpecifier`, `Declaration`, module-related rules.

**Files:**
- Modify: `source/parser.hera:5913-7400`

- [ ] **Step 1: Apply style conversions**

Read lines 5913–7400. Apply style guide.

```
# Before
    if (something === null) return $skip
    const result = process(something)
    return result

# After
    return $skip unless something?
    result := process(something)
    return result
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert Import/Export/Declaration rules to Civet"
```

---

### Task 11: JSX + Interface / Namespace / TypeDecl (lines 7400–8365)

Grammar rules: all `JSX*` rules, plus `InterfaceDeclaration`, `NamespaceDeclaration`, `TypeLexicalDeclaration`, `InterfaceProperty`, `ModuleOrEmptyBlock`, `DeclareBlock`.

**Files:**
- Modify: `source/parser.hera:7400-8365`

- [ ] **Step 1: Apply style conversions**

Read lines 7400–8365. Apply style guide. JSX action blocks tend to be short and pattern-heavy; pay attention to type checks:

```
# Before
    if (name.type === "JSXMemberExpression" || name.type === "JSXNamespacedName") {

# After
    if name.type is "JSXMemberExpression" or name.type is "JSXNamespacedName"
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert JSX/Interface/TypeDecl rules to Civet"
```

---

### Task 12: TypeSuffix / TypePrimary / TypeIdentifier / TypeArguments (lines 8365–9040)

Grammar rules: `TypeSuffix`, `TypePrimary`, `TypeIdentifier`, `TypeLiteral`, `TypeArgument`, `TypeParameters`, `TypeParameter`, `TypeParameterDelimiter`.

**Files:**
- Modify: `source/parser.hera:8365-9040`

- [ ] **Step 1: Apply style conversions**

Read lines 8365–9040. Apply style guide. Type rules build AST nodes; typical pattern:

```
# Before
    if (something === null) return $skip
    const result = { type: "TypeIdentifier", ... }
    return result

# After
    return $skip unless something?
    result := { type: "TypeIdentifier", ... }
    return result
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert TypeSuffix/TypePrimary/TypeArguments rules to Civet"
```

---

### Task 13: CivetOptions / Reset / Init / Lexer / Indent (lines 9040–9551)

Grammar rules: `CivetOption`, `Reset`, `Init`, `Prologue`, `EOS`, `Indent`, `PushIndent`, `PopIndent`, `Nested`, `InsertX` rules, token rules.

**Files:**
- Modify: `source/parser.hera:9040-9551`

- [ ] **Step 1: Apply style conversions**

Read lines 9040–9551. Apply style guide. `Reset` (line ~9282) is particularly important — it initialises all parser state and has dense action code. Be careful with const/let initializers in state setup:

```
# Before
    const indent = {
      token: "",
      $loc,
      level: state.currentIndent.level + 1,
    }
    if (config.verbose) console.log("pushing bonus indent", indent)

# After
    indent := {
      token: "",
      $loc,
      level: state.currentIndent.level + 1,
    }
    console.log("pushing bonus indent", indent) if config.verbose
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

Expected: all pass.

- [ ] **Step 3: Commit**

```bash
git add source/parser.hera
git commit -m "style: convert CivetOptions/Reset/Init/Lexer rules to Civet"
```
