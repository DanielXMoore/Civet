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
