import Hera from "@danielx/hera"
const { compile: heraCompile } = Hera

export default {
  transpilers: [{
    extension: ".hera",
    target: ".mjs",
    compile: function (path, source) {
      return heraCompile(source, {
        filename: path,
        module: true,
        sourceMap: true,
      })
    }
  }],
}
