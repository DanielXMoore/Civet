import * as esbuild from 'esbuild'
import civetEsbuildPlugin from '@danielx/civet/esbuild'

const options = {
  entryPoints: ['src/main.civet'],
  bundle: true,
  outfile: 'dist/main.js',
  plugins: [civetEsbuildPlugin()],
}

if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context(options)
  await ctx.watch()
} else {
  await esbuild.build(options)
}
