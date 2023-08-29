module.exports = {
  entry: './main.civet',
  output: {
    path: __dirname + '/dist',
  },
  mode: 'production',
  plugins: [require('../../dist/index.js').civetPlugin.webpack({})],
};
