# Civet Sublime Text Package

Sublime Text 4 package providing Civet syntax highlighting and LSP wiring.

## Features

- Syntax highlighting via a generated TextMate plist grammar, built from the VS Code grammar at `../vscode/syntaxes/civet.json`
- Optional LSP integration via the [Sublime LSP package](https://lsp.sublimetext.io/) and `civet-lsp` (diagnostics, completions, hover, go-to-definition)

## Requirements

- Sublime Text 4
- For LSP: the [LSP package](https://packagecontrol.io/packages/LSP) from Package Control
- For LSP: `civet-lsp` on your `PATH`

## Installing as a dev package

Build a local package directory first. This converts the shared VS Code JSON grammar into Sublime's TextMate plist format:

```bash
pnpm -C lsp/sublime build
```

Sublime Text loads any folder placed under its `Packages/` directory as a package. Symlink the generated `dist` directory in:

**macOS**
```bash
ln -s "$(pwd)/lsp/sublime/dist" "$HOME/Library/Application Support/Sublime Text/Packages/Civet"
```

**Linux**
```bash
ln -s "$(pwd)/lsp/sublime/dist" "$HOME/.config/sublime-text/Packages/Civet"
```

**Windows**

```cmd
mklink /J "%APPDATA%\Sublime Text\Packages\Civet" "%CD%\lsp\sublime\dist"
```

**All**
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

On Windows, if you use the in-repo binary instead of a global npm install, point Sublime at Node explicitly because `lsp\server\bin\civet-lsp.js` is not a Windows command shim:

```js
"command": ["node", "C:\\path\\to\\Civet\\lsp\\server\\bin\\civet-lsp.js", "--stdio"]
```

## Wiring up LSP

1. Install the [LSP package](https://packagecontrol.io/packages/LSP) from Package Control.
2. Open **Preferences → Package Settings → LSP → Server Configurations**.
3. Merge the snippet from [`LanguageServers.sublime-settings.example`](./LanguageServers.sublime-settings.example) into the server configurations on the right.
4. Open a `.civet` file. The LSP status should appear in the bottom bar.

## Known limitations

This package is intended for dev / local install. It is not yet on [Package Control](https://packagecontrol.io/). PC requires the package to live at the root of its own repository, so submission means publishing a separate `sublime-civet` repo populated from `lsp/sublime/`. Tracked separately from issue #422.

## Updating the grammar

The Sublime grammar is generated from `../vscode/syntaxes/civet.json`. Rebuild after grammar changes:

```bash
pnpm -C lsp/sublime build
```

## Debugging in Sublime Text

Open the Sublime console with <kbd>Ctrl</kbd>+<kbd>`</kbd> and check for package load errors. With a `.civet` file focused, these console checks are useful:

```py
view.settings().get("syntax")
view.scope_name(0)
sublime.find_resources("Civet.tmLanguage")
sublime.load_resource("Packages/Civet/Civet.tmLanguage")[:200]
```

Expected results:

- `view.settings().get("syntax")` points at `Packages/Civet/Civet.tmLanguage`
- `view.scope_name(0)` includes `source.civet`
- `find_resources` includes `Packages/Civet/Civet.tmLanguage`

For LSP issues after syntax highlighting works, run **LSP: Toggle Log Panel** and **LSP: Restart Servers** from the command palette. The LSP client only starts when the focused view's selector matches `source.civet`, so syntax highlighting must work first.
