Notes
===

SourceMaps
---

Array of lines with
[ outColDelta ]
[ outColDelta, srcFileIdx, srcLineDelta, srcColDelta ]
[ outColDelta, srcFileIdx, srcLineDelta, srcColDelta, nameIdx]

outColDelta is reset each line
srcLineDelta is absolute on first occurence, relative for each other occurence (does not reset at the end of the generated line)
srcColDelta is absolute on first occurence, relative for each other occurence (does not reset at the end of the generated line)

SourceMap Viz: https://evanw.github.io/source-map-visualization/

Inserting location data for symbols that don't appear in the source can cause trouble for forward mapping:

```civet
x := 3
```

```
const x = 3
```

In this case if a mapping of const to the left of x is inserted then hovering 'x' in the source may think it is hovering 'const' in the generated.

Better is to omit mappings using the [outColDelta] form.

However... open and close braces may be significant for tracking code coverage

c8 sourcemapping details on how V8 traces get mapped to istanbul coverage https://github.com/istanbuljs/v8-to-istanbul/blob/aac059d8a234b69af8da762f4eb8ef44f8edc34a/lib/source.js#L131

Final thoughts:

Ideally we'd ship very small and compact source maps that imply a lot of info (like joining runs of tokens together)

... but once we need to remap from ts-node and pass through to c8 for coverage this causes things to get lost.

So in practice the most robust way is to have a mapping for each token, including implied tokens, *especially braces*, and have each mapping be
small and precise. That way when mapping back we will be unlikely to hit "in between" mappings and need to assume or infer things.

Windows Dev Env
---

WSL sucks when running VSCode in /mnt/e/... the file operations are slow as heck. In Node.js it is a nightmare because
the thousands of node modules files compund the problem severly.

The correct fix is to move or copy the project to your home directory in WSL and use the VSCode Remote WSL extension.

Use VSCode and Powershell on windows drives. Use VSCode WSL in /home inside WSL only.

Textmate Grammars
---

https://macromates.com/manual/en/regular_expressions

TypeScript
---

Rest parameters in any position:
https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/#variadic-tuple-types
https://stackoverflow.com/a/64366348/68210

Implementing TS features in VS Code extensions: https://github.com/microsoft/vscode/blob/main/extensions/typescript-language-features/src/languageFeatures/

JSX Spec
---

https://facebook.github.io/jsx/

ECMAScript Specification
---

https://262.ecma-international.org/

TypeScript Compiler API Docs
---

https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API

https://github.com/microsoft/TypeScript/wiki/Using-the-Language-Service-API

Unofficial Typescript EBNF
---

https://github.com/Matts966/TypeScriptC/blob/master/typescript.ebnf

How does Mocha --loader work?
---

Where does it read the option in the mocha source?

https://github.com/mochajs/mocha/blob/master/lib/cli/node-flags.js#L9

Mocha uses `process.allowedNodeEnvironmentFlags` to decide about node flags like `--loader`.

Debugging Mocha
---

Mocha uses `debug` for debugging. By looking at mocha source code you can find calls to debug.
By passing a comma separated list of values to the DEBUG env variable you can toggle them to
output to stderr.

```bash
DEBUG=mocha:cli:mocha yarn test
```

Node.js --loader
---

https://dev.to/jakobjingleheimer/custom-esm-loaders-who-what-when-where-why-how-4i1o

Why is TypeScript humongous?
---

https://github.com/microsoft/TypeScript/pull/35561#issuecomment-696382520

Also it cannot be tree shaken when included in esbuild.

How to require CoffeeScript with ts-node?
---

```bash
# a.ts requires b.coffee
node --require coffeescript/register --loader ts-node/esm a.ts
```

Explore creating an alternative ts-node loader to experiment and learn.

Maybe make everything .mts?

The answer is to use `--transpile-only` option.

How does TypeScript.LanguageServiceHost signal "commonjs" vs "module" when resolving modules?
---

It probably has to do with the TypeScript configuration options, maybe the resolved filename as well?

(perhaps ../path/a.ts will resolve based on config whereas ../path/a.mts is always module)

How does it work with non-`.[cm]?(ts|js)` extensions? Is there a way to configure it in code?

if sourceFile.symbol isn't found then it failed to resolve
there is an internal `mode` that picks between `commonjs` and `module`

`getImpliedNodeFormatForFileWorker` in ts internals checks the `type` field of the project's `package.json`

For ts config option `moduleResolution` `node16` and `nodenext` it checks a hardcoded set of specific extensions:

[.d.mts, .mts, .mjs] -> esnext (module?)
[.d.cts, .cts, .cjs] -> commonjs
[.d.ts, .ts, .tsx, .js, .jsx] -> lookup from package.json
others are undefined

I tried modifying the resolver to add .ts/js to the end of paths that match transpilers but that doesn't work for when root files are included directly. It also adds/changes the bookkeeping for matching source maps and introduces "virtual" documents that correspond to the transpiled content... this may be a fine way but is a bit
tricky so far.

An alternative would be to wrap `ts.CompilerHost.getSourceFile` to set/override `impliedNodeFormat` in the `languageVersionOrOptions` parameter. Seems promising. Can't patch directly since `DocumentRegistry` calls `ts.createLanguageServiceSourceFile` directly. Could maybe patch DocumentRegistry though?

New strategy: Don't give any non ts/js files to language service, it gets confused.

- Use `resolveModuleNames` to resolve transpiled files to their correctly appended target suffix.
- When VSCode extension requests information for a `.civet` file the service will translate that to `.civet.ts` and pass it along to TS.
- Sourcemap to return the values to their original filename and location.
- Forward map in a similar way.
- Maybe create a structure to hold source/transpiledCode/sourcemap

How do you configure TypeScript to resolve/process non .ts extensions?
---

- Customize the resolver in `ts.LanguageServiceHost.resolveModuleNames`.
- Customize `ts.LanguageServiceHost.getScriptSnapshot` to transpile sources as needed
- Specify `extraFileExtensions` to pass to `parseJsonConfigFileContent` and call `createCompilerHost(parsedConfig)` instead of `createCompilerHost(parsedConfig.options)` (this doesn't seem necessary depending on the customized resolver but does add the files to the list of `fileNames`)

How does `getProjectVersion` work?
---

Is it for when any script file changes or only for when node_modules or configuration files change?
How does it relate to `getScriptVersion`?

How does TypeScript resolve module libraries (ex: `import * as fs from "node:fs/promises"`)
---

TypeScript/bin/tsc - requires ../lib/tsc.js
TypeScript/lib/tsc.js 100k lines of code
- Arranged as namespaces `(function(ts) {...})(ts || (ts = {}))`
  - 000_000 ts utils / helpers (__assign, __spreadArray, __generator, reduceLeft, arrayFrom, etc.)
  - 002_062 Logging
  - 002_740 Version parsing
  - 003_022 Node Performance API checks, TS internal performance measurement util
  - 003_192 use etw logger / null logger
  - 003_229 tracing
  - 003_468 Enums
    - FileIncludeKind
    - ExitStatus
    - TypeReferenceSerializationKind
    - DiagnosticCategory
    - ModuleKind
    - ModuleResolutionKind
    - commentPragmas
    - etc
  - 003_616 filesystem watching
  - 004_428 ts.sys How ts wraps node calls to interface with the local system
  - 004_893 path utils
  - 005_369 diagnostics definitions
  - 007_231 Parser (tokens, lexer, scanner)
  - 009_296 text spans, parse tree AST nodes, get modifiers/JSDoc tags/Decorators/Type declarations
    - Essentially how AST nodes are constructed from the parsed text and what data they expose
    - Lots of switches based on `node.kind` to answer questions like `isAssertionExpression(node)`
    - 9305 getDefaultLibFileName
  - 010_892 compiler / code generation?
    - node ancestor iteration
    - 010_894 ts.externalHelpersModuleNameText = "tslib";
    - 011_042 getResolvedModule from a SourceFile
    - 011_046 `function setResolvedModule(sourceFile, moduleNameText, resolvedModule, mode)`
    - 011_352 `function getScriptTargetFeatures()` table of what features are supported by various ES20xx versions
    - getting text of AST nodes
    - creating diagnostics for AST nodes
    - 012_005 `fullTripleSlashReferencePathRegEx` triple slash reference path parsing regex
    - 012_817 `isStringDoubleQuoted` and other node queries that affect output
  - 017_189 `createBaseNodeFactory` creates various kinds of base nodes (SourceFile, Token, Identifier)
  - 017_222 `createParenthesizerRules`
  - 017_583 `createNodeConverters`
  - 017_686 `createNodeFactory` constructor for all kinds of AST nodes
    - 022_183 `createUnparsedSourceFile`
    - 022_397 `createSourceMapSource`
  - 022_450 `getOrCreateEmitNode`
  - 022_672 Emit helpers
  - 023_111 Node token helpers `isNumericLiteral`, `isCommaToken`, etc.
  - 023_993 writing, create exports, jsx factory
  - 024_801 `canHaveModifiers(node)`, `canHaveDecorators(node)`
  - 024_849 parse node traversal `parseNodeFactory`
    - 025_522 `createSourceFile`
    - 025_578 construct actual parser
    - 026_156 `viableKeywordSuggestions`
    - 030_481 JSDoc parser
    - 031_375 Incremental Parser
    - 031_740 `processPragmasIntoFields`
  - 031_929 compiler option mapping
    - 033_610 `readConfigFile`
    - 034_073 `generateTSConfig`
    - 034_667 `getFileNamesFromConfigSpecs`
  - 034_932 `src/compiler/moduleNameResolver.ts`
    - 035_120 `var nodeModulesAtTypes = ts.combinePaths("node_modules", "@types")`
    - 035_747 `resolveJSModule`
    - 035_789 `nodeModuleNameResolver`
    - 035_927 `parseNodeModuleFromPath`
    - `getEntrypointsFromPackageJsonInfo`, `classicNameResolver`, `loadModuleFromGlobalCache`
  - 036_844 `src/compiler/binder.ts` ?? Control flow, symbol scopes, binding symbols to AST nodes ??
    - `getModuleInstanceState`
  - 039_649 `createGetSymbolWalker`
  - 039_812 `src/compiler/checker.ts` Type checking
  - 076_149 `src/compiler/visitorPublic.ts`
  - 076_785 `src/compiler/sourcemap.ts` internal, sourcemaps
  - 077_388 `src/compiler/transformers/utilities.ts`
  - 077_772 `src/compiler/transformers/destructuring.ts`
  - 078_124 `src/compiler/transformers/taggedTemplate.ts`
  - 078_181 `src/compiler/transformers/ts.ts`
  - 079_420 `src/compiler/transformers/classFields.ts`
  - 080_802 `src/compiler/transformers/typeSerializer.ts`
  - 081_130 `src/compiler/transformers/legacyDecorators.ts`
  - 081_455 `src/compiler/transformers/es2017.ts`
  - 081_916 `src/compiler/transformers/es2018.ts`
  - 082_643 `src/compiler/transformers/es2019.ts`
  - 082_674 `src/compiler/transformers/es2020.ts`
  - 082_846 `src/compiler/transformers/es2021.ts`
  - 082_899 `src/compiler/transformers/esnext.ts`
  - 082_922 `src/compiler/transformers/jsx.ts`
  - 083_555 `src/compiler/transformers/es2016.ts`
  - 083_617 `src/compiler/transformers/es2015.ts`
  - 085_645 `src/compiler/transformers/es5.ts`
  - 085_719 `src/compiler/transformers/generators.ts`
  - 087_334 `src/compiler/transformers/module/module.ts`
  - 088_318 `src/compiler/transformers/module/system.ts`
  - 089_231 `src/compiler/transformers/module/esnextAnd2015.ts`
  - 089_379 `src/compiler/transformers/module/node.ts`
  - 089_446 `src/compiler/transformers/declarations/diagnostics.ts`
  - 089_854 `src/compiler/transformers/declarations.ts`
  - 091_116 `src/compiler/transformer.ts`
  - 091_549 `src/compiler/emitter.ts`
  - 096_359 `src/compiler/watchUtilities.ts`
  - 096_812 ** `src/compiler/program.ts`
    - 097_615 setting default lib
  - 100_196 `src/compiler/builderState.ts`
  - 100_586 ** `src/compiler/builder.ts`
  - 101_594 `src/compiler/builderPublic.ts`
  - 101_611 ** `src/compiler/resolutionCache.ts`
  - 102_425 ** `src/compiler/moduleSpecifiers.ts`
  - 103_110 `src/compiler/watch.ts`
  - 103_689 `src/compiler/watchPublic.ts`
  - 104_351 `src/compiler/tsbuild.ts`
  - 104_379 `src/compiler/tsbuildPublic.ts` - creates the builder
  - 106_031 ** `src/executeCommandLine.ts`
    - 106_418 `function executeCommandLineWorker`
    - 106_525 `performCompilation` called
    - 106_537 `function executeCommandLine`
    - 106_608 `function performCompilation`


synchronizeHostData calls createProgram if needed
how to make sure createProgram gets proper resolutions for imports?

Process root files
process type references
processRootFile(default library)

`fs` will not be found when checking file imports but will be found later when semantic checking by using the type references.


Debugging Hera
---

Wrap an individual test with `describe.only "", ->`, throw a `debugger` statement into a parser rule, then `yarn test --inspect-brk`. Open up
Chrome dev tools and step through.

Adds a bright green cursor to the current position.

```javascript
console.log(`${state.input.slice(0, state.pos)}%c^%c${state.input.slice(state.pos)}`, 'color: lime', 'color: inherit')
```

Getting current location in parse stack:

```javascript
s = Error().stack.split(/\n    at /)
s.shift()
s = s.filter((e) => !e.match(/^eval/)).map((e) => e.split(' ')[0])
s = s.slice(0, s.indexOf('Program'))
```

TC39 Radar
---

https://github.com/tc39/proposal-pattern-matching

ECMAScript AST
---

Probably a good idea to align with existing AST conventions where possible

- https://esprima.org/demo/parse.html
- https://github.com/estree/estree

Block Regular Expressions
---
Heregexp, Block Regexp, `re.X`, `///`

CoffeeScript's block regexp is a neat idea but is specified poorly and has bugs. Rebuilding it to match Python's `re.X` could be a valid approach.

- https://docs.python.org/3/library/re.html#re.X

IfExpressions
---

CoffeeScript allows for inline IfExpressions, we should too for compatibility and ease of porting.

Inline expressions have a psuedo-block of comma separated expressions. Pure statements like `break`, `continue`, `return` are disallowed. We'd also disallow
declarations.

Currently this is colliding with the PostfixStatement. There's probably a clean way to get these into the grammar just need to figure it out.

Expression/AssignmentExpression don't include the ExpressionizedStatements ExtendExpression does.

This lets the specific places in the parser choose when and where to enable them.

Timesheet
---

2022-08-22 | 2.25  | esm loader; strip types in js; hera bugfix; ts lsp
2022-08-23 | 5.00  | lsp vs code extension setup; WSL dev env perf fix; nested arguments list; const assignment shorthand; syntax highlighting starting from CoffeeScript
2022-08-24 | 6.00  | Type binary ops, optional types; conditional types; parentheses in types; JSX; async generator function return types; mapped types; more typescript; array multi-elements per line; in keyword word boundary; feedback
2022-08-25 | 3.00  | concise body; parens around fat arrow args; lsp
2022-08-26 | 2.50  | lsp experiment; hover; prototype shorthand; until
2022-08-27 | 1.00  | bugfix return followed by non-nested expression; esbuild plugin;
2022-08-28 | 2.00  | Source maps
2022-09-03 | 0.25  | LSP
2022-09-04 | 4.50  | LSP
2022-09-05 | 5.00  | running mocha with .civet and .ts files; remove 'as' suffix from js transpilation; document symbols; sourcemapping
2022-09-06 | 2.50  | more source mapping in parser; noop ->; sourcemap cleanup; sourcemapping document symbols
2022-09-07 | 5.75  | block strings; forward source mapping; onHover; starting onCompletion
2022-09-08 | 6.50  | onCompletion; ts-node config
2022-09-09 | 2.00  | TS diagnostics; consolidating host
2022-09-10 | 4.00  | use vscode docs to update ts service; tsservice config; fix ts-server root dir handling
2022-09-11 | 5.00  | await expression; ts-node configuration wild goose chase
2022-09-12 | 5.75  | resolving `.civet` files with `ts.LanguageServiceHost`; require/import ts-node + coffee + hera; Convert tests to .civet; developing civet in civet; fix esm.civet
2022-09-13 | 5.25  | Import shorthand; fix fat arrow single expression; declare; namespace; interface methods; type parameters; Use project's local Civet in extension if available
2022-09-14 | 3.50  | feedback; := class fields (readonly); static class fields; `!` non-null assertion; fix `#` comment after first line of `"use coffee-compat"` directive prologue; shebang + prologue directive bug; LSP resolve .coffee files
2022-09-15 | 6.50  | ts module resolution figuring out module vs commonjs in LanguageServiceHost; resolve .hera files; transpilation overhaul
2022-09-16 | 3.25  | foundation for transpiled module resolution; updated extension server to use new transpilation
2022-09-17 | 0.50  | semi-colon after unquoted import module specifier; plugins
2022-09-18 | 4.50  | Plugin loading; updating source docs (needed projectVersion++); sourcemap .coffee
2022-09-19 | 2.00  | template string syntax highlighting; hover in .js/.ts; update completions, documentSymbol, diagnostics, definition, for non-transpiled filse
2022-09-20 | 4.50  | stepping through tsc.js
2022-09-21 | 6.00  | bundling lib; learned how ts resolves types better; go to definition for transpiled files; started building extension with Civet
2022-09-22 | 3.50  | extra array comma bug; republish extension; smaller npm bundle; community feedback; bug fixes from hera compiler.coffee conversion; simplified const assignment and readonly
2022-09-23 | 1.75  | coffee2civet; TypeScript binary ops continue line
2022-09-24 | 0.25  | --inline-map compiler option
2022-09-25 | 4.75  | source map parsing for composition; source map composition testing
2022-09-26 | 9.00  | compose source maps in esm loader; source maps remapping; source mapping working with c8
2022-09-27 | 3.00  | sourcemapping implied imports; const/readonly assignment; multiline-comment; postfix conditionals; source map errors in esm loader; readme;
2022-09-28 | 5.50  | don't add trailing object commas; nested lexical bindings; static `@` shorthand; hacky nested function application for indented objects
2022-09-29 | 5.50  | better handling of trailing .fnCall after newline after and within arguments; test cleanup; consolidate and fixed a bug with indent tracking; class @ constructor shorthand; CoffeeScript block string interpolation
2022-09-30 | 3.50  | vscode dev env setup; `\`\`\`` block template strings; test cleanup;

2022-10-01 | 2.50  | parser cleanup; added multiple switch/when cases; coffee-compat `"#{}"` interpolation
2022-10-09 | 2.25  | starting implicit returns
2022-10-10 | 3.75  | AST nodes; more implicit returns
2022-10-11 | 3.25  | implicit returns (method definition; fat arrow; longhand; void; set); starting auto-var
2022-10-12 | 3.00  | civet prologues; number improvements
2022-10-13 | 2.50  | coffeeBooleans; compat docs; implicit return hera compiler example test; big int hex/octal/binary
2022-10-14 | 1.75  | chained comparisons
2022-10-15 | 2.00  | TS interface type parameters; TS comma delimiters in interface; TS `?` suffix; TS callable interface; TS function overloads; TS declare function signature; TS multiple as; rest parameters; argument splats
2022-10-17 | 0.50  | Don't insert semi-colons at every statement end
2022-10-18 | 0.50  | type annotation for var decs
2022-10-20 | 2.00  | Paren-less `for`; implicit const `for` dec
2022-10-21 | 1.00  | unary op + eol source maps;
2022-10-22 | 0.50  | making implicit returns match CS better
2022-10-23 | 1.50  | .civet svg icon
2022-10-24 | 3.50  | postfix iteration statements; keep leading newlines in block strings; feedback; index slicing
2022-10-25 | 1.50  | basic splice assignment
2022-10-26 | 1.00  | IfExpressions
2022-10-27 | 5.75  | IfExpressions; if then; more expressionized statements; enabling extended expressions in more places; switch expression; const assignment -> function declaration transformation
2022-10-28 | 3.50  | coffeeNot; whitespace and assignment expressions; auto-var
2022-10-29 | 1.00  | function/identifier ast
2022-10-30 | 1.00  | declaration/binding identfier ast
2022-10-31 | 2.75  | AutoVar; BindingPattern AST; import decs

2022-11-01 | 3.50  | AutoVar; ArrayLiteral AST; Object Literal AST; parens around destructuring object assignment
2022-11-02 | 2.25  | AutoVar: nested blocks; function params; for loops; var decs; hoisting var decs
2022-11-03 | 1.50  | Coffee for loops; chained assignment destructuring; chained assignment vars
2022-11-04 | 3.00  | Coffee comprehensions; refs
2022-11-05 | 1.00  | for when clause; coffee-compat of/in
2022-11-06 | 1.50  | chained comparison `in` op
2022-11-07 | 5.00  | coffee compat `for own ... of`; & blocks; civet cli read from stdin; coffeecompat bug fixes
2022-11-08 | 6.25  | range literals; coffee do; condition/parenthesized expression refactor

TODO: character ranges

- CoffeeCompat
  - [ ] Ranges
    - [x] Range literals
    - [x] `for x in range`
    - [ ] Character ranges `["a".."Z"]`
  - [x] `do`
  - [ ] Chained Comparisons
    - [x] working without refs
    - [ ] Add refs
  - [x] auto var
  - [ ] Coffee `for` loops
    - [x] `for own ... of`
    - [ ] Comprehensions
    - Handle both of these:
    ```
      a for x in y by 2 when z
      a for x in y when z by 2
    ```
  - [ ] Soak assignments (needs refs)
  - [ ] Braceless inline objects (conflicts with labels... but labels could be loop statement only)
- LSP
  - [ ] auto-import suggest in .coffee
  - [ ] update imported file exports, see errors in importing file
  - [ ] vscode commands
