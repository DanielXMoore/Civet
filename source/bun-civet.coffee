import { plugin } from 'bun'

await plugin
  name: 'Civet loader'
  setup: (builder) ->
    { compile } = await import('./main.mjs')
    { readFileSync } = await import('fs')

    builder.onLoad filter: /\.civet$/, ({path}) ->
      source = readFileSync path, 'utf8'
      contents = compile source

      return
        contents: contents
        loader: 'js'
