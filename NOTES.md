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

Timesheet
---

2022-08-22 | 2.25  | esm loader; strip types in js; hera bugfix; ts lsp
2022-08-23 | 5.00  | lsp vs code extension setup; WSL dev env perf fix; nested arguments list; const assignment shorthand; syntax highlighting starting from CoffeeScript
2022-08-24 | 6.00  | Type binary ops, optional types; conditional types; parentheses in types; JSX; async generator function return types; mapped types; more typescript; array multi-elements per line; in keyword word boundary; feedback
2022-08-25 | 3.00  | concise body; parens around fat arrow args; lsp
2022-08-26 | 2.50  | lsp experiment; hover; prototype shorthand; until
2022-08-27 | 1.00  | bugfix return followed by non-nested expression; esbuild plugin;
2022-08-28 | 2.00  | Source maps
