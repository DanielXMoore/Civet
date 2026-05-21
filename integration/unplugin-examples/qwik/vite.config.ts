import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import civetVitePlugin from "@danielx/civet/vite";

export default defineConfig({
  plugins: [
    civetVitePlugin({ ts: "preserve" }),
    qwikCity(),
    qwikVite(),
  ],
});
