Notes
===

Windows Dev Env
---

WSL sucks when running VSCode in /mnt/e/... the file operations are slow as heck. In Node.js it is a nightmare because
the thousands of node modules files compund the problem severly.

The correct fix is to move or copy the project to your home directory in WSL and use the VSCode Remote WSL extension.

Use VSCode and Powershell on windows drives. Use VSCode WSL in /home inside WSL only.

TypeScript
---

Rest parameters in any position:
https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/#variadic-tuple-types
https://stackoverflow.com/a/64366348/68210

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
2022-08-23 | 3.00  | lsp VSCode extension setup;
