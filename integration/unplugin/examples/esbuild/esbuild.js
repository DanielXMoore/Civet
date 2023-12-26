import * as esbuild from 'esbuild'
import civetEsbuildPlugin from '@danielx/civet/esbuild'

const options = {
  entryPoints: ['src/main.civet'],
  bundle: true,
  outdir: 'dist',
  plugins: [civetEsbuildPlugin({
    ts: 'esbuild',
    emitDeclaration: true,
  })],
}

if (process.argv.includes('--watch')) {
  console.log('watching for changes...')
  const ctx = await esbuild.context(options)
  await ctx.watch()
} else {
  await esbuild.build(options)
}
