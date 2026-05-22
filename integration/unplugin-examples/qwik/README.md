# Civet + Qwik

A minimal [Qwik City](https://qwik.dev) starter using Civet for components.

## Civet integration

Two pieces — see [`vite.config.ts`](./vite.config.ts) and [`package.json`](./package.json):

1. **Vite plugin** — `civetVitePlugin({ ts: "preserve" })` runs before `qwikCity()` / `qwikVite()` so Qwik's optimizer sees `.tsx` output.
2. **`.d.ts` neighbors for tsc** — `qwik build` runs `tsc --noEmit` separately from Vite, so it cannot resolve `.civet` imports on its own. [`scripts/emit-civet-declarations.mjs`](./scripts/emit-civet-declarations.mjs) walks `src/` and runs `civet --emit-declaration` on each `.civet` file, dropping `<name>.civet.d.ts` next to the source before `build.types` runs tsc. Those `.d.ts` files are gitignored.

The Civet component lives at [`src/components/counter/counter.civet`](./src/components/counter/counter.civet) and is imported from [`src/routes/index.tsx`](./src/routes/index.tsx).

## Scripts

- `npm run dev` — Vite dev server with SSR
- `npm run build` — full `qwik build` (Vite client + SSR + tsc + lint)
- `npm run build.client` — Vite client build only (skip tsc)
