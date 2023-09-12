import Bun, { plugin } from "bun";
await plugin({
  name: "Civet loader",
  setup: async function(builder) {
    const { compile } = await import("../../dist/main.mjs");
    return builder.onLoad({ filter: /\.civet$/ }, async function({ path }) {
      const source = await Bun.file(path).text();
      const contents = compile(source);
      return {
        contents,
        loader: "tsx"
      };
    });
  }
});
