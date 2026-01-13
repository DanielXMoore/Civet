---
title: Integrations
---
<!-- markdownlint-disable line-length -->
# {{ $frontmatter.title }}

## VSCode

- [Civet VSCode extension](https://marketplace.visualstudio.com/items?itemName=DanielX.civet)

## Build tools

- [unplugin](https://github.com/DanielXMoore/Civet/blob/main/source/unplugin) integrates Civet into Vite, esbuild, Astro, Farm, Rolldown, Rollup, and Webpack, including `.d.ts` generation (see [basic instructions](https://civet.dev/getting-started#building-a-project))
  - [Simpler esbuild plugin](https://github.com/DanielXMoore/Civet/blob/main/source/esbuild-plugin.civet)
  - [Older Vite plugin](https://github.com/edemaine/vite-plugin-civet) (no longer recommended)
- [ESM/CJS loader](https://github.com/DanielXMoore/Civet/blob/main/register.js) for `import`/`require` to support `.civet` files
- [Babel plugin](https://github.com/DanielXMoore/Civet/blob/main/source/babel-plugin.civet)
  - Including [React Native / Metro](https://github.com/DanielXMoore/Civet/tree/main/integration/metro)
- [Jest plugin](https://github.com/DanielXMoore/Civet/tree/main/integration/jest)
- [Gulp plugin](https://github.com/DanielXMoore/Civet/tree/main/integration/gulp)
- [Bun plugin](https://github.com/DanielXMoore/Civet/blob/main/source/bun-civet.civet)
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

## the Nix package manager

Civet's [GitHub repo](https://github.com/DanielXMoore/Civet) is a [nix flake](https://wiki.nixos.org/wiki/flakes) that provides:

- a devshell that can be enabled with

  ```sh
  nix \
    --extra-experimental-features 'nix-command flakes' \
    develop github:danielxmoore/civet
  ```

- `cli` (default): the Civet CLI, accessible with

  ```sh
  nix \
    --extra-experimental-features 'nix-command flakes' \
    run github:danielxmoore/civet
  ```

- `ls`: a standalone entrypoint for the Civet Language Server, accessible with

  ```sh
  nix \
    --extra-experimental-features 'nix-command flakes' \
    run github:danielxmoore/civet#ls -- --stdio
  ```

- `vscode-extension`: an unpacked VSCode extension for the lsp and syntax highlighting that can be used with [`vscode-with-extensions`](https://wiki.nixos.org/wiki/Visual_Studio_Code#Installation)
- `vscode-vsix`: the VSCode extension packaged as a `.vsix`, which can be installed with

  ```sh
  nix  \
    --extra-experimental-features 'nix-command flakes' \
    build github:danielxmoore/civet#vscode-vsix
  cp result result.vsix # vscode requires the `.vsix` extension
  code --install-extension result.vsix
  ```
- [Civet Discord Bot](https://github.com/DanielXMoore/civet-discord) transpiles ` ```civet ... ``` ` code in your Discord server

## Tooling

- [YavaScript](https://github.com/suchipi/yavascript) is a standalone script runner supporting Civet (no Node required)
