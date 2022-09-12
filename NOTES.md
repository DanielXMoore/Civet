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
2022-09-12 | 4.50  | resolving `.civet` files with `ts.LanguageServiceHost`; require/import ts-node + coffee + hera; Convert tests to .civet
