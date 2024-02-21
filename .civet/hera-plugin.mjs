import Hera from "@danielx/hera"
const { compile: heraCompile } = Hera

export default {
  transpilers: [{
    extension: ".hera",
    target: ".ts",
    compile: function (path, source) {
      return heraCompile(source, {
        filename: path,
        sourceMap: true,
        types: true,
        module: true,
      })
    }
  }],
}
