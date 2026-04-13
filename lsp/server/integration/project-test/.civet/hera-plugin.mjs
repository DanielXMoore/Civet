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
