/**
@file Civet CJS registration

`require`ing this file will register the `.civet` extension with
Node.js's `require`.

@example
```bash
node -r @danielx/civet/register source.civet
```
*/

if (require.extensions) {
  const fs = require("fs");
  const { compile } = require("./");

  require.extensions[".civet"] = function (module, filename) {
    const js = compile(fs.readFileSync(filename, 'utf8'), {
      js: true,
      inlineMap: true,
    });
    module._compile(js, filename);
    return;
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
