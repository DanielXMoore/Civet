import { defineConfig } from "@solidjs/start/config";
import civetVitePlugin from "@danielx/civet/vite";

export default defineConfig({
  // Include .civet files in the filesystem router's route scan
  extensions: ["civet"],
  vite: {
    plugins: [
      civetVitePlugin({
        // Compile to plain JS + JSX; vite-plugin-solid compiles the JSX.
        // (`ts: "preserve"` doesn't work here: nothing downstream strips
        // TypeScript syntax from .civet modules in vinxi-based frameworks.)
        ts: "civet",
      }),
    ],
  },
});
