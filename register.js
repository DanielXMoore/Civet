/**
@file Civet CJS and ESM registration

`import`ing this file in Node 20.6.0+ will register the `.civet` extension
for both ESM `import`s and CJS `require`s.

@example
```bash
node --import @danielx/civet/register source.civet
```

On older Node, `require`ing this file will register the `.civet` extension
for CJS `require`s.

@example
```bash
node -r @danielx/civet/register source.civet
```
*/

try {
  const { register } = require('node:module');
  const { pathToFileURL } = require('node:url');

  register('./dist/esm.mjs', pathToFileURL(__filename));
} catch (e) {
  // older Node lacking module register
}

const fs = require("fs");
const { compile } = require("./");

// Old-style CJS registration
if (require.extensions) {
  require.extensions[".civet"] = function (module, filename) {
    const js = compile(fs.readFileSync(filename, 'utf8'), {
      filename,
      js: true,
      inlineMap: true,
      sync: true,
    });
    module._compile(js, filename);
  };
}

const outputCache = new Map

function retrieveFile(path) {
  if (!path.endsWith('.civet')) return

  // If it's a file URL, convert to local path
  // I could not find a way to handle non-URLs except to swallow an error
  if (path.startsWith('file:')) {
    try {
      path = require('url').fileURLToPath(path)
    } catch (e) {}
  }

  if (!outputCache.has(path)) {
    outputCache.set(path, compile(fs.readFileSync(path, 'utf8'), {
      filename: path,
      js: true,
      inlineMap: true,
      sync: true,
    }));
  }
  return outputCache.get(path)
}

try {
  require('@cspotcode/source-map-support').install({
    environment: 'node',
    hookRequire: true,
    retrieveFile,
  })
} catch (e) {
  // ignore missing dependency
}
