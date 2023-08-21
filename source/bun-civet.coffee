###
Bun plugin for Civet files. Simply follow the steps below:

1. Create bunconfig.toml if it doesn't exist
2. Add the following line:
preload = ["@danielx/civet/bun-civet"]

After that, you can use .civet files with the Bun cli, like:
$ bun file.civet
###

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
        loader: 'tsx'
