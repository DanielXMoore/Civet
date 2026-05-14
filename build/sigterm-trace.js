// Diagnostic shim: log PIDs of mocha parallel workers that get SIGTERM'd
// by the workerpool's force-kill fallback. See MOCHA-PARALLEL-COVERAGE-RACE.md
// for context — when the parent's `workerTerminateTimeout` (default 1 s) elapses
// before a worker exits, the parent kills it and any V8 coverage data the
// worker had accumulated is silently dropped, producing flaky 99.x% gates.
//
// We only install the handler in worker processes (identified by mocha's
// MOCHA_WORKER_ID env), so the parent's own SIGTERM behavior is unchanged.
// The path is overridable via CIVET_SIGTERM_TRACE for ad-hoc local runs;
// CI inspects this file after the suite and fails the job if it has PIDs.
//
// We deliberately SIGKILL ourselves after logging instead of running normal
// exit cleanup — we want to preserve the coverage-loss symptom so we can
// correlate "SIGTERM log has PIDs" with "coverage gate failed".

if (process.env.MOCHA_WORKER_ID !== undefined) {
  const fs = require("fs");
  const path = process.env.CIVET_SIGTERM_TRACE || "/tmp/civet-sigterm-trace.log";
  process.on("SIGTERM", () => {
    try {
      fs.appendFileSync(path, `${process.pid}\n`);
    } catch {}
    process.kill(process.pid, "SIGKILL");
  });
}
