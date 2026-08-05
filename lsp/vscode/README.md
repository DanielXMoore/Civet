# Civet Language Server

[Civet](https://civet.dev/) is a programming language that compiles to
TypeScript or JavaScript, so you can use existing tooling
while enabling concise and powerful syntax.

This plugin enables VSCode type checking, hints, completion, etc.
for `.civet` files, via a language server.

Features
---

- Type checking via TypeScript
- Syntax highlighting
- Go to definition
- Find all references
- Completions (but not yet immediately after `.`)
- Comment/uncomment
- Symbols outline
- Diagnostics
- Custom transpiler plugins
- Hera grammar (`.hera`) syntax highlighting and grammar-level navigation (definition, references, outline, completion, hover for rules)

Type Checking
---

By default, all Civet files are type checked using TypeScript.
To skip checking a particular file, add the comment
[`// @ts-nocheck`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#-ts-nocheck-in-typescript-files)
to the top of the file.

Plugins
---

Custom transpilers can be added in your host project root folder under `${projectRoot}/.civet/name-plugin.mjs`.

Example: Hera plugin

```javascript
import Hera from "@danielx/hera"
const { compile: heraCompile } = Hera

export default {
  transpilers: [{
    extension: ".hera",
    target: ".cjs",
    compile: function (path, source) {
      const code = heraCompile(source, {
        filename: path,
      })

      return {
        code
      }
    }
  }],
}
```

See also: [example CoffeeScript Plugin](integration/project-test/.civet/coffee-plugin.mjs)


Debugging
---

Clicking `create a launch.json file` inside the Debug menu and using NodeJS as the debugger creates a simple debug configuration for your Civet project that has some sane defaults.
To make this work a `tasks.json` is expected and may need to be created. You can use the following template for it:

```json: tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "civet: build",
      "type": "shell",
      "command": "npm run build:dev",
      "group": "build",
      "problemMatcher": []
    }
  ]
}
```