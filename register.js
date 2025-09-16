/**
@file Civet CJS and ESM registration

`import`ing this file in Node 20.6.0+ will register the `.civet` extension
for both ESM `import`s and CJS `require`s.

@example
```bash
node --import @danielx/civet/register source.civet
```

If you don't want the loader to search for/use accompanying civetconfig files,
you can use the `-noconfig` version (where `NOCONFIG` comments are removed):

@example
```bash
node --import @danielx/civet/register-noconfig source.civet
```

On older Node, `require`ing this file will register the `.civet` extension
for CJS `require`s.

@example
```bash
node -r @danielx/civet/register source.civet
```

If you want to configure the loader, you can make your own
`register.mjs` along these lines:

@example
```javascript
import { register } from 'node:module';
register('@danielx/civet/esm', import.meta.url, {data: {
  //config: 'path/config.json',
  parseOptions: {
    // Add your parse options here
  },
}});
```

*/

try {
  const { register } = require('node:module');
  const { pathToFileURL } = require('node:url');

  register('./dist/esm.mjs', pathToFileURL(__filename)
    //NOCONFIG//, {data: {config: null}}
  );
} catch (e) {
  // older Node lacking module register
}

const fs = require("fs");
const { compile } = require("./");

// Old-style CJS registration
if (require.extensions) {
  require.extensions[".civet"] = function (module, filename) {
    const js = compile(fs.readFileSync(filename), {
      filename,
      js: true,
      inlineMap: true,
      sync: true,
      //NOCONFIG//config: null,
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
    outputCache.set(path, compile(fs.readFileSync(path), {
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
