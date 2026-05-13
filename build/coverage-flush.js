'use strict';

// Mocha root hook plugin: force v8 coverage flush before mocha tears
// the worker down via IPC disconnect. Without this, the parallel-worker
// exit can race the profile writer and drop sub-function arm data,
// producing flaky coverage-gate failures with different files missing
// each run.
exports.mochaHooks = {
  afterAll() {
    if (process.env.NODE_V8_COVERAGE) {
      require('v8').takeCoverage();
    }
  },
};
