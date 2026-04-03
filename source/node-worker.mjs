// Redirect to the compiled worker for use when importing worker-pool directly from source.
// Requires `pnpm build` to be run first to generate dist/node-worker.mjs.
import '../dist/node-worker.mjs';
