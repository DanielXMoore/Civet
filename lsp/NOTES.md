Publishing VSCode Extension
---

May require setting up credentials: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

```bash
yarn vsce-publish
```

Publishing Open VSX Extension
---

https://github.com/eclipse/openvsx/wiki/Publishing-Extensions

```bash
ovsx publish -p $(<open-vsx-token)
```

Debugging Extension
---

### Setup

In [Chrome Dev tools](chrome://inspect) click "Open dedicated DevTools for Node"

In the "Connection" tab add localhost:6009

###

In VSCode "Run and Debug" --> "Launch Extension"

Then in the `chrome://inspect` page you should see: `Remote Target #LOCALHOST` with `/home/daniel/apps/civet/lsp/dist/server.js` and a link to "inspect"

When the DevTools page is open `debugger` statements will work.

Extension Bundle Size
---

Use [esbuild Bundle Size Analyzer](https://esbuild.github.io/analyze/)

Drop in either:

- `server.metafile`
- `extension.metafile`

To se what was bundled and why.
