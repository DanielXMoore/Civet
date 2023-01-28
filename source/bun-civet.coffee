###
Bun plugin for Civet files.  Import this plugin from a .js or .ts file,
and afterward you'll be able to import .civet files.  For example:

import "@danielx/civet/bun-civet"
import "./foo.civet"
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
