const civetWebpackPlugin = require('@danielx/civet/webpack').default;

module.exports = {
  entry: './main.civet',
  output: {
    path: __dirname + '/dist',
  },
  mode: 'production',
  plugins: [civetWebpackPlugin({})],
};
