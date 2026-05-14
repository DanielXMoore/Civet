// Diagnostic shim: log mocha parallel worker exit paths to a trace file so
// we can tell whether the workerpool's force-kill fallback is firing in CI
// (see notes/mocha-parallel-coverage-diagnosis.md).
//
// Each log line is `<event> <pid>` so the post-run check can distinguish:
//   SIGTERM <pid>   — parent's workerTerminateTimeout elapsed; force-killed
//   SIGINT  <pid>   — Ctrl-C path
//   disconnect <pid> — IPC channel closed before clean exit (workerpool's
//                       internal handler calls process.exit(1) on this)
// Only installed in worker processes (MOCHA_WORKER_ID env set by mocha's
// BufferedWorkerPool); parent's own behavior is unchanged.  Overridable
// via CIVET_SIGTERM_TRACE.
//
// For SIGTERM we deliberately SIGKILL ourselves after logging — we want
// to preserve the coverage-loss symptom so we can correlate "trace log
// has SIGTERM entries" with "coverage gate failed".  The other events
// just log and let normal handling proceed.

if (process.env.MOCHA_WORKER_ID !== undefined) {
  const fs = require("fs");
  const path = process.env.CIVET_SIGTERM_TRACE || "/tmp/civet-sigterm-trace.log";
  const log = (event) => {
    try {
      fs.appendFileSync(path, `${event} ${process.pid}\n`);
    } catch {}
  };
  // Direct evidence that this worker process exists.  Counting `install`
  // entries in CI gives us actual worker count per coverage run.
  log(`install/worker${process.env.MOCHA_WORKER_ID}`);
  process.on("SIGTERM", () => {
    log("SIGTERM");
    process.kill(process.pid, "SIGKILL");
  });
  process.on("SIGINT", () => {
    log("SIGINT");
    process.kill(process.pid, "SIGKILL");
  });
  // workerpool registers its own 'disconnect' listener that calls
  // process.exit(1); use prependListener so ours logs first.
  process.prependListener("disconnect", () => log("disconnect"));
}
