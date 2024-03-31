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
} catch (e) {}

// CJS registration
if (require.extensions) {
  const fs = require("fs");
  const { compile } = require("./");

  require.extensions[".civet"] = function (module, filename) {
    const js = compile(fs.readFileSync(filename, 'utf8'), {
      filename,
      js: true,
      inlineMap: true,
    });
    module._compile(js, filename);
  };

  try {
    require('@cspotcode/source-map-support').install({
      environment: 'node',
      hookRequire: true  // support inline source maps
    })
  } catch (e) {
    // ignore missing dependency
  }
}
