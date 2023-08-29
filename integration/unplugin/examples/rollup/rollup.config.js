const { civetPlugin } = require('../../dist/index.js');

module.exports = {
  input: 'main.civet',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    civetPlugin.rollup({
      dts: true,
    }),
  ],
};
