esbuild = require "esbuild"
heraPlugin = require "@danielx/hera/esbuild-plugin"
civetPlugin = require "@danielx/civet/esbuild-plugin"

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

resolveExtensions = extensionResolverPlugin(["civet", "hera"])

# To get proper extension resolution for non-bundled files, we need to use
# a plugin hack: https://github.com/evanw/esbuild/issues/622#issuecomment-769462611
# set bundle: true, then rewrite .coffee -> .js and mark as external
rewriteCivetImports = {
  name: 'rewrite-civet',
  setup: (build) ->
    build.onResolve { filter: /\.civet$/ }, (args) ->
      if (args.importer)
        path: args.path.replace(/\.civet$/, ".js")
        external: true
}

esbuild.build({
  entryPoints: ['source/cli.civet']
  bundle: false
  sourcemap
  minify
  watch
  platform: 'node'
  format: 'cjs'
  outfile: 'dist/cli.js'
  plugins: [
    resolveExtensions
    civetPlugin()
    heraPlugin
  ]
}).catch -> process.exit 1

esbuild.build({
  entryPoints: ['source/config.civet']
  bundle: true
  sourcemap
  minify
  watch
  platform: 'node'
  format: 'cjs'
  outfile: 'dist/config.js'
  plugins: [
    rewriteCivetImports
    civetPlugin()
  ]
}).catch -> process.exit 1

for esm in [false, true]
  esbuild.build({
    entryPoints: ['source/main.civet']
    bundle: true
    watch
    platform: 'node'
    format: if esm then 'esm' else 'cjs'
    outfile: "dist/main.#{if esm then 'mjs' else 'js'}"
    plugins: [
      resolveExtensions
      civetPlugin()
      heraPlugin
    ]
  }).catch -> process.exit 1

esbuild.build({
  entryPoints: ['source/main.civet']
  globalName: "Civet"
  bundle: true
  sourcemap
  watch
  platform: 'browser'
  outfile: 'dist/browser.js'
  plugins: [
    resolveExtensions
    civetPlugin()
    heraPlugin
  ]
}).catch -> process.exit 1

esbuild.build({
  entryPoints: ['source/bun-civet.civet']
  bundle: false
  sourcemap
  minify
  watch
  platform: 'node'
  format: 'esm'
  target: "esNext"
  outfile: 'dist/bun-civet.mjs'
  plugins: [
    civetPlugin()
  ]
}).catch -> process.exit 1
