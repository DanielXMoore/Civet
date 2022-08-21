if (require.extensions) {
  const fs = require("fs");
  const { compile } = require("./");

  require.extensions[".civet"] = function (module, filename) {
    const js = compile(fs.readFileSync(filename, 'utf8'));
    module._compile(js, filename);
    return;
  };
}
