# Civet Language Server

This Language Server works for `.civet` files.

Features
---

- [x] Syntax Highlighting
- [x] Go to definition
- [ ] Find all references
- [x] Completions
- [ ] Comment/Uncomment
- [x] Symbols outline
- [x] Diagnostics
- [x] Custom Transpiler Plugins

Plugins
---

Custom transpilers can be added in your host project root folder under `${projectRoot}/.civet/name-plugin.mjs`.

Ex. Hera Plugin

```javascript
import Hera from "@danielx/hera"
const { compile: heraCompile } = Hera

export default {
  transpilers: [{
    extension: ".hera",
    target: ".cjs",
    compile: function (path, source) {
      const code = heraCompile(source, {
        filename: path,
      })

      return {
        code
      }
    }
  }],
}
```

See also: [example CoffeeScript Plugin](integration/project-test/.civet/coffee-plugin.mjs)
