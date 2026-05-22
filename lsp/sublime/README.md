# Civet Sublime Text Package

Sublime Text 4 package providing Civet syntax highlighting and LSP wiring.

## Features

- Syntax highlighting via the TextMate grammar at [`Civet.tmLanguage.json`](./Civet.tmLanguage.json) (a symlink to `../vscode/syntaxes/civet.json` — single source of truth shared with the VS Code extension)
- Optional LSP integration via the [Sublime LSP package](https://lsp.sublimetext.io/) and `civet-lsp` (diagnostics, completions, hover, go-to-definition)

## Requirements

- Sublime Text 4 (build 4075 or later — needed for `.tmLanguage.json` support)
- For LSP: the [LSP package](https://packagecontrol.io/packages/LSP) from Package Control
- For LSP: `civet-lsp` on your `PATH`

## Installing as a dev package

Sublime Text loads any folder placed under its `Packages/` directory as a package. Symlink this directory in:

**macOS**
```bash
ln -s "$(pwd)/lsp/sublime" "$HOME/Library/Application Support/Sublime Text/Packages/Civet"
```

**Linux**
```bash
ln -s "$(pwd)/lsp/sublime" "$HOME/.config/sublime-text/Packages/Civet"
```

**Windows**
```cmd
mklink /D "%APPDATA%\Sublime Text\Packages\Civet" "%CD%\lsp\sublime"
```

Restart Sublime Text. `.civet` files should now syntax-highlight.

## Installing `civet-lsp`

Either install globally via npm:

```bash
npm install -g @danielx/civet-language-server
```

Or add the in-repo binary to `PATH`:

```bash
# ~/.bashrc / ~/.zshrc
export PATH="/path/to/Civet/lsp/server/bin:$PATH"
```

(The in-repo binary requires `pnpm -C lsp/server build` first.)

## Wiring up LSP

1. Install the [LSP package](https://packagecontrol.io/packages/LSP) from Package Control.
2. Open **Preferences → Package Settings → LSP → Settings**.
3. Merge the snippet from [`LSP.sublime-settings.example`](./LSP.sublime-settings.example) into the user settings on the right. If a `clients` block already exists, add the `civet-lsp` entry inside it.
4. Open a `.civet` file. The LSP status should appear in the bottom bar.

## Known limitations

This package is intended for dev / local install. It is not yet on [Package Control](https://packagecontrol.io/). PC requires the package to live at the root of its own repository, so submission means publishing a separate `sublime-civet` repo populated from `lsp/sublime/`. Tracked separately from issue #422.

## Updating the grammar

The grammar is a symlink to `../vscode/syntaxes/civet.json`. Edits to the VS Code grammar take effect in Sublime automatically — no copy step. Restart Sublime Text (or run *View → Syntax → Reload Syntax*) to pick up changes.
