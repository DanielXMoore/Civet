Publishing VSCode Extension
---

May require setting up credentials: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

```bash
yarn vsce-publish
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
