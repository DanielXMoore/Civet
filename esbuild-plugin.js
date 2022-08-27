const { readFile } = require('fs/promises');
const path = require('path');
const { compile } = require("./");

module.exports = {
  name: 'civet',
  setup(build) {
    build.onLoad({
      filter: /\.civet/
    }, async function (args) {
      return readFile(args.path, 'utf8')
        .then(function (source) {
          const filename = path.relative(process.cwd(), args.path);
          return {
            contents: compile(source, { filename, js: true })
          };
        }).catch(function (e) {
          return {
            errors: [{
              text: e.message
            }]
          };
        });
    });
  }
};
