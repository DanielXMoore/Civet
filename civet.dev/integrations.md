---
title: Integrations
---

# {{ $frontmatter.title }}

## VSCode

- [Civet VSCode extension](https://marketplace.visualstudio.com/items?itemName=DanielX.civet)

## Zed

Install the Civet extension from the Zed extension marketplace, or install it as a dev extension from the `lsp/zed/` directory of the Civet repo.

The extension requires `civet-lsp` to be on your PATH:

```bash
npm install -g @danielx/civet-language-server
```

To enable semantic token highlighting (context-aware colors for variables, functions, types, etc.), add to your Zed settings:

```json
{
  "languages": {
    "Civet": {
      "semantic_tokens": "combined"
    }
  }
}
```

`"combined"` overlays LSP semantic tokens on top of tree-sitter highlighting.

## Neovim

Neovim 0.10+ supports LSP natively. Add this to your `init.lua`:

```lua
vim.filetype.add({ extension = { civet = "civet" } })

vim.api.nvim_create_autocmd("FileType", {
  pattern = "civet",
  callback = function(args)
    vim.lsp.start({
      name = "civet_lsp",
      cmd = { "node", "/path/to/civet/lsp/server/dist/server.js", "--stdio" },
      root_dir = vim.fs.root(args.file, { "tsconfig.json", "package.json", ".git" }) or vim.fn.getcwd(),
    })
  end,
})
```

Replace `/path/to/civet` with your local Civet repo path, or the path to a globally installed `@danielx/civet-language-server` package.

Build the server first if using the repo directly:

```bash
cd lsp/server && pnpm build
```

### Tree-sitter (syntax highlighting)

The Civet tree-sitter grammar is included in the Civet repo at `lsp/tree-sitter/`.
After cloning Civet, register it in your `init.lua`:

```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.civet = {
  install_info = {
    url = "https://github.com/DanielXMoore/Civet",
    files = { "src/parser.c" },
    location = "lsp/tree-sitter",
    generate_requires_npm = false,
    requires_generate_from_grammar = false,
  },
  filetype = "civet",
}
```

Then run `:TSInstall civet`.

## Build tools

- [unplugin](https://github.com/DanielXMoore/Civet/blob/main/source/unplugin) integrates Civet into Vite, esbuild, Astro, Farm, Rolldown, Rollup, and Webpack, including `.d.ts` generation (see [basic instructions](https://civet.dev/getting-started#building-a-project))
- [ESM/CJS loader](https://github.com/DanielXMoore/Civet/blob/main/register.js) for `import`/`require` to support `.civet` files
- [Babel plugin](https://github.com/DanielXMoore/Civet/blob/main/source/babel-plugin.civet)
  - Including [React Native / Metro](https://github.com/DanielXMoore/Civet/tree/main/integration/metro)
- [Jest plugin](https://github.com/DanielXMoore/Civet/tree/main/integration/jest)
- [Gulp plugin](https://github.com/DanielXMoore/Civet/tree/main/integration/gulp)
- [Bun plugin](https://github.com/DanielXMoore/Civet/blob/main/source/bun-civet.civet)
- [Meteor plugin](https://github.com/edemaine/meteor-civet)
- [`<script>` tag](https://github.com/DanielXMoore/Civet/tree/main/integration/script)
- [Civetman](https://github.com/zihan-ch/civetman) automatically compiles `.civet` files, making it easy to integrate with arbitrary build chains (see also [vite-plugin-civetman](https://github.com/krist7599555/vite-plugin-civetman))

## Starter Templates

- [Astro, esbuild, NextJS, Farm, Rolldown, Rollup, Vite, and Webpack](https://github.com/DanielXMoore/Civet/blob/main/integration/unplugin-examples)
- [Solid](https://github.com/edemaine/civet-solid-vite-template) ([older](https://github.com/orenelbaum/solid-civet-template))
- [SolidStart](https://github.com/orenelbaum/solid-start-civet-template)
- [p5.js](https://codesandbox.io/p/sandbox/drawing-points-civet-2tk4jq)

## Linters

- [eslint plugin](https://github.com/DanielXMoore/Civet/blob/main/integration/eslint)

## Testing

- [c8 + Mocha](https://github.com/DanielXMoore/Civet#c8--mocha)
- [Civet CLI](https://civet.dev/getting-started#executing-code)
- [Civet Discord Bot](https://github.com/DanielXMoore/civet-discord) transpiles ` ```civet ... ``` ` code in your Discord server

## Tooling

- [YavaScript](https://github.com/suchipi/yavascript) is a standalone script runner supporting Civet (no Node required)
