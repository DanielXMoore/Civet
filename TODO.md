TODO
---

- [x] Compiler option to strip TypeScript and emit only JS (use in `./register`)
- [x] JavaScript Compat (default stance is JS code should "just work")
- [ ] CoffeeScript Compat (cli flag or directive prolog "Coffee Compatability" for when Coffee is incompatible with JS)
  - [ ] Implicit Returns
  - [ ] """ Interpolations
  - [ ] ###
- [x] Import shorthand
- [x] `:=` `readonly` field shorthand
- [x] Keep comments and whitespace
- [ ] TypeScript
  - [x] TS Compiling Experiment
  - [x] `interface` declaration
  - [x] `type` declaration
  - [x] Conditional types
    - [x] `extends`
    - [x] `infer`
  - [x] Optional Type
  - [x] TypeBinaryOperations `| &`
  - [x] UnaryOperator `typeof`
  - [x] Parentheses
  - [x] Type assertions `const x = "" as T`
  - [x] `keyof`
  - [x] Indexed Access Types `T['name']`
  - [x] Mapped Types
    - [x] Mapping modifiers
  - [x] Assertion Signatures
  - [x] Return Type Predicate
  - [x] Index signature
  - [x] `!` non-null assertion
  - [x] `declare`
  - [x] `namespace`
  - [x] `interface` methods
  - [ ] `abstract` class and fields
- [x] Keep shebang line
- [ ] JSX 😿
  - [x] Basic Support
  - [ ] Indentation based JSX
- [ ] Infrastructure
  - [x] TS-node compatibility (may need to create a custom loader wrapping ts.LanguageServiceHost). The purpose of this feature is so we can run tests written in .civet.
    - [x] Extensible transpiled TS/JS esm loader (.hera, .coffee, .civet)
    - [x] Basic ESM Loader
  - [x] esbuild plugin so we can package up projects that contain `.civet` files
  - [ ] CoffeeSense inspired LSP
    - [ ] Syntax Highlighting
      - [x] Basic highlighting
      - [ ] Interpolated template strings
      - [ ] Shebang line
      - [ ] Short imports
      - [ ] TS Keywords
    - [ ] Proper caching/versioning for scriptSnapshots
    - [ ] Resolve .coffee files
    - [ ] Resolve .hera files
    - [ ] Load specifically included files (consistent with VSCode TS Extension)
    - [ ] Some libraries are not loading?
      ```
        resolveModuleNames [ 'tslib', './main.js' ] /home/daniel/apps/civet/source/esm.civet
        failed to resolve tslib /home/daniel/apps/civet/source/esm.civet
      ```
    - [ ] Handle .civet docs outside of project root
    - [ ] Handle multi-root projects
    - [ ] Use @danielx/civet installed in node_modules if present
    - [ ] Handle file updates
      - [x] Add TextDocuments to service
      - [x] Update docs on changes
      - [x] Update sourcemap/meta on changes
    - [ ] Language Icon https://stackoverflow.com/a/70930298/68210
    - [x] Sourcemapping
      - [x] Finish adding source mappings to parser/transpiler
      - [ ] Unpessimize source mapping output (later)
      - [x] Translate from generated line/column to source line/column (reverse map)
      - [x] Translate from source line/column to generated line/column
    - [x] Document Symbols
    - [x] Hover docs (forward map)
    - [x] Completions (forward map)
    - [ ] References
    - [x] Load installed @types/*
    - [ ] Diagnostics (reverse map)
      - [x] Display Diagnostics
      - [ ] Find out why diagnostic hint jumps around wierdly (source map error or is it using an older map when the file updates?)
- [ ] Syntax Experiments
  - [ ] Explore `gen.next(args, ...)` shorthand

TODONT
---

- [ ] CoffeeScript features
  - [ ] Heregex
