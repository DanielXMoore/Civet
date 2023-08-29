esbuild = require "esbuild"
coffeeScriptPlugin = require "esbuild-coffeescript"
heraPlugin = require "@danielx/hera/esbuild-plugin"

watch = process.argv.includes '--watch'
minify = false
sourcemap = false

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
    # For relative requires that don't contain a '.'
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
  bundle: false
  sourcemap
  minify
  watch
  platform: 'node'
  format: 'cjs'
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
  entryPoints: ['source/config.mts']
  bundle: true
  sourcemap
  minify
  watch
  platform: 'node'
  format: 'cjs'
  outfile: 'dist/config.js'
  # To get proper extension resolution for non-bundled files, we need to use
  # a plugin hack: https://github.com/evanw/esbuild/issues/622#issuecomment-769462611
  # set bundle: true, then rewrite .coffee -> .js and mark as external
  plugins: [{
    name: 'rewrite-coffee',
    setup: (build) ->
      build.onResolve { filter: /\.coffee$/ }, (args) ->
        if (args.importer)
          path: args.path.replace(/\.coffee$/, ".js")
          external: true
  }]
}).catch -> process.exit 1

for esm in [false, true]
  esbuild.build({
    entryPoints: ['source/main.coffee']
    bundle: true
    watch
    platform: 'node'
    format: if esm then 'esm' else 'cjs'
    outfile: "dist/main.#{if esm then 'mjs' else 'js'}"
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

esbuild.build({
  entryPoints: ['source/bun-civet.coffee']
  bundle: false
  sourcemap
  minify
  watch
  platform: 'node'
  format: 'esm'
  target: "esNext"
  outfile: 'dist/bun-civet.mjs'
  plugins: [
    coffeeScriptPlugin
      bare: true
      inlineMap: sourcemap
  ]
}).catch -> process.exit 1
