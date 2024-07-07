import civetRollupPlugin from '@danielx/civet/rollup';

export default {
  input: 'main.civet',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    civetRollupPlugin({
      emitDeclaration: true,
    }),
  ],
};
