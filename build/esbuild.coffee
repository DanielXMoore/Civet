esbuild = require "esbuild"
coffeeScriptPlugin = require "esbuild-coffeescript"
heraPlugin = require "@danielx/hera/esbuild-plugin"

watch = process.argv.includes '--watch'
minify = !watch || process.argv.includes '--minify'
sourcemap = true

path = require "path"
{access} = require "fs/promises"
exists = (p) ->
  access(p)
  .then ->
    true
  .catch ->
    false
extensionResolverPlugin = (extensions) ->
  name: "extension-resolve"
  setup: (build) ->
    # For relatiev requires that don't contain a '.'
    build.onResolve { filter: /\/[^.]*$/ }, (r) ->
      for extension in extensions
        {path: resolvePath, resolveDir} = r
        p = path.join(resolveDir, resolvePath + ".#{extension}")

        # see if a .coffee file exists
        found = await exists(p)
        if found
          return path: p

      return undefined

resolveExtensions = extensionResolverPlugin(["hera", "coffee"])

esbuild.build({
  entryPoints: ['source/cli.coffee']
  bundle: true
  sourcemap
  minify
  watch
  platform: 'node'
  outfile: 'dist/cli.js'
  plugins: [
    resolveExtensions
    coffeeScriptPlugin
      bare: true
      inlineMap: sourcemap
    heraPlugin
  ]
}).catch -> process.exit 1

esbuild.build({
  entryPoints: ['source/main.coffee']
  bundle: true
  watch
  platform: 'node'
  outfile: 'dist/main.js'
  plugins: [
    resolveExtensions
    coffeeScriptPlugin
      bare: true
      inlineMap: sourcemap
    heraPlugin
  ]
}).catch -> process.exit 1

esbuild.build({
  entryPoints: ['source/main.coffee']
  globalName: "Civet"
  bundle: true
  sourcemap
  watch
  platform: 'browser'
  outfile: 'dist/browser.js'
  plugins: [
    resolveExtensions
    coffeeScriptPlugin
      bare: true
      inlineMap: sourcemap
    heraPlugin
  ]
}).catch -> process.exit 1
