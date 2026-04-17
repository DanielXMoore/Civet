'use strict';

const { reporters: { Base }, Runner } = require('mocha');
const {
  EVENT_TEST_PASS,
  EVENT_TEST_FAIL,
  EVENT_TEST_PENDING,
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
} = Runner.constants;

const WIDTH = 120;

function DotBatch(runner, options) {
  Base.call(this, runner, options);
  const self = this;

  const rate = Math.max(1, parseInt(process.env.DOT_RATE, 10) || 10);
  let col = 0;
  let batchCount = 0;
  let batchSlow = false;

  function write(ch) {
    if (col >= WIDTH) {
      process.stdout.write('\n  ');
      col = 0;
    }
    process.stdout.write(ch);
    col++;
  }

  function flushBatch() {
    if (batchCount === 0) return;
    const color = batchSlow ? 'bright yellow' : 'fast';
    write(Base.color(color, Base.symbols.dot));
    batchCount = 0;
    batchSlow = false;
  }

  runner.on(EVENT_RUN_BEGIN, () => process.stdout.write('\n  '));

  runner.on(EVENT_TEST_PASS, (test) => {
    batchCount++;
    if (test.speed === 'slow') batchSlow = true;
    if (batchCount >= rate) flushBatch();
  });

  runner.on(EVENT_TEST_PENDING, () => {
    write(Base.color('pending', Base.symbols.comma));
  });

  runner.on(EVENT_TEST_FAIL, () => {
    write(Base.color('fail', Base.symbols.bang));
  });

  runner.once(EVENT_RUN_END, () => {
    flushBatch();
    process.stdout.write('\n');
    self.epilogue();
  });
}

require('mocha/lib/utils').inherits(DotBatch, Base);

DotBatch.description = 'dot matrix, one dot per DOT_RATE passing tests';

module.exports = DotBatch;
