import { defineConfig } from 'rolldown'
import civetRolldownPlugin from '@danielx/civet/rolldown'

export default defineConfig({
  input: 'src/main.civet',
  output: {
    dir: 'dist',
  },
  plugins: [
    civetRolldownPlugin({
      emitDeclaration: true,
      ts: "preserve",
    }),
  ],
})
