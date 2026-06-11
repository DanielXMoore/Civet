# SolidStart + Civet

A minimal [SolidStart](https://start.solidjs.com/) app with Civet routes in
the filesystem router (`src/routes/index.civet` page and
`src/routes/api/answer.civet` API route).

The two pieces of configuration that make this work (see `app.config.ts`):

- `extensions: ["civet"]` — includes `.civet` files in the route scan
  (SolidStart also forwards this to `vite-plugin-solid` so it compiles the
  JSX in compiled Civet output).
- the Civet vite plugin with `ts: "civet"` (or `"esbuild"` / `"tsc"`).
  `ts: "preserve"` does not work here: nothing downstream strips TypeScript
  syntax from `.civet` modules in vinxi-based frameworks.

```bash
pnpm dev    # development server
pnpm build  # production build
pnpm start  # serve the production build
```
