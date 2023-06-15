import {parse, compile, generate} from "./main"
import {findConfig, loadConfig} from "./config"
{prune} = generate

version = -> require("../package.json").version
if process.argv.includes "--version"
  console.log version()
  process.exit(0)

if process.argv.includes "--help"
  process.stderr.write """
           ▄▄· ▪   ▌ ▐·▄▄▄ .▄▄▄▄▄
          ▐█ ▌▪██ ▪█·█▌▀▄.▀·•██       _._     _,-'""`-._
          ██ ▄▄▐█·▐█▐█•▐▀▀▪▄ ▐█.▪    (,-.`._,'(       |\\`-/|
          ▐███▌▐█▌ ███ ▐█▄▄▌ ▐█▌·        `-.-' \\ )-`( , o o)
          ·▀▀▀ ▀▀▀. ▀   ▀▀▀  ▀▀▀               `-    \\`_`"'-


    Usage:

        civet                                        # REPL for executing code
        civet -c                                     # REPL for transpiling code
        civet --ast                                  # REPL for parsing code
        civet [options] input.civet                  # run input.civet
        civet [options] -c input.civet               # -> input.civet.tsx
        civet [options] -c input.civet -o .ts        # -> input.ts
        civet [options] -c input.civet -o dir        # -> dir/input.civet.tsx
        civet [options] -c input.civet -o dir/.ts    # -> dir/input.ts
        civet [options] -c input.civet -o output.ts  # -> output.ts
        civet [options] < input.civet > output.ts    # pipe form

    Options:
      --help           Show this help message
      --version        Show the version number
      -o / --output XX Specify output directory and/or extension, or filename
      -c / --compile   Compile input files to TypeScript (or JavaScript)
      --config XX      Specify a config file (default scans for a config.civet, civet.json, civetconfig.civet or civetconfig.json file, optionally in a .config directory, or starting with a .)
      --no-config      Don't scan for a config file
      --js             Strip out all type annotations; default to .jsx extension
      --ast            Print the AST instead of the compiled code
      --inline-map     Generate a sourcemap
      --no-cache       Disable compiler caching (slow, for debugging)

    You can use - to read from stdin or (prefixed by -o) write to stdout.


  """
  process.exit(0)

encoding = "utf8"

fs = require "fs/promises"
path = require "path"

parseArgs = (args) ->
  options = {}
  Object.defineProperty options, 'run',
    get: -> not (@ast or @compile)
  filenames = []
  scriptArgs = null
  i = 0
  endOfArgs = (j) ->
    i = args.length  # trigger end of loop
    return if j >= args.length  # no more args
    if options.run
      filenames.push args[j]
      scriptArgs = args[j+1..]
    else
      filenames.push ...args[j..]
  while i < args.length
    arg = args[i]
    # Split -ab into -a -b
    if /^-\w{2,}$/.test arg
      args[i..i] =
        for char in arg[1..]
          "-#{char}"
      continue
    # Main argument handling
    switch arg
      when '-c', '--compile'
        options.compile = true
      when '-o', '--output'
        options.output = args[++i]
      when '--config'
        options.config = args[++i]
      when '--no-config'
        options.config = false
      when '--ast'
        options.ast = true
      when '--no-cache'
        options.noCache = true
      when '--inline-map'
        options.inlineMap = true
      when '--js'
        options.js = true
      when '--'
        endOfArgs ++i  # remaining arguments are filename and/or arguments
      else
        if arg.startsWith('-') and arg != '-'
          throw new Error "Invalid command-line argument #{arg}"
        if options.run
          endOfArgs i  # remaining arguments are arguments to the script
        else
          filenames.push arg
    i++

  {filenames, scriptArgs, options}

readFiles = (filenames, options) ->
  for filename in filenames
    stdin = filename == '-'
    try
      if stdin
        process.stdin.setEncoding encoding

        # Try to guess filename for stdin, such as /dev/fd/filename
        filename = "<stdin>"
        try
          filename = await fs.realpath '/dev/stdin'

        if process.stdin.isTTY
          # In interactive stdin, `readline` lets user end the file via ^D.
          lines = []
          rl = require('readline').createInterface process.stdin, process.stdout
          rl.on 'line', (buffer) -> lines.push buffer + '\n'
          content = await new Promise (resolve, reject) ->
            rl.on 'SIGINT', ->
              reject '^C'
            rl.on 'close', ->
              resolve lines.join ''
        else
          # For piped stdin, read stdin directly to avoid potential echo.
          content = (chunk for await chunk from process.stdin).join ''
      else
        content = await fs.readFile filename, {encoding}
      yield {filename, content, stdin}
    catch error
      yield {filename, error, stdin}

repl = (options) ->
  console.log "Civet #{version()} REPL.  Enter a blank line to #{
    switch
      when options.ast then 'parse'
      when options.compile then 'transpile'
      else 'execute'
  } code."
  global.quit = global.exit = -> process.exit 0
  nodeRepl = require 'repl'
  vm = require 'vm'
  r = nodeRepl.start
    prompt:
      switch
        when options.ast then '🌲> '
        when options.compile then '🐈> '
        else '🐱> '
    writer:
      if options.ast
        (obj) ->
          try
            JSON.stringify obj, null, 2
          catch e
            console.log "Failed to stringify: #{e}"
            obj
      else if options.compile
        (obj) ->
          if typeof obj == 'string'
            obj?.replace /\n*$/, ''
          else
            obj
    eval: (input, context, filename, callback) ->
      if input == '\n'  # blank input
        callback null
      else if input in ['quit\n', 'exit\n', 'quit()\n', 'exit()\n']
        process.exit 0
      else if input.endsWith '\n\n'  # finished input with blank line
        try
          output = compile input, {...options, filename}
        catch error
          #console.error "Failed to transpile Civet:"
          console.error error
          return callback ''
        if options.compile or options.ast
          callback null, output
        else
          try
            result = vm.runInContext output, context, {filename}
          catch error
            return callback error
          callback null, result
      else  # still reading
        callback new nodeRepl.Recoverable "Enter a blank line to execute code."

cli = ->
  argv = process.argv  # process.argv gets overridden when running scripts
  {filenames, scriptArgs, options} = parseArgs argv[2..]

  if options.config isnt false # --no-config
    options.config ?= await findConfig(process.cwd())
  
  if options.config
    options = {
      ...(await loadConfig options.config),
      ...options
    }

  unless filenames.length
    if process.stdin.isTTY
      options.repl = true
    else
      # When piped, default to old behavior of transpiling stdin to stdout
      options.compile = true
      filenames = ['-']

  # In run mode, compile to JS with source maps
  if options.run
    options.js = true
    options.inlineMap = true

  return repl options if options.repl

  for await {filename, error, content, stdin} from readFiles filenames, options
    if error
      console.error "#{filename} failed to load:"
      console.error error
      continue

    # Transpile
    try
      output = compile content, {...options, filename}
    catch error
      #console.error "#{filename} failed to transpile:"
      console.error error
      continue

    if options.ast
      process.stdout.write JSON.stringify(output, null, 2)
    else if options.compile
      if (stdin and not options.output) or options.output == '-'
        process.stdout.write output
      else
        outputPath = path.parse filename
        delete outputPath.base  # use name and ext
        if options.js
          outputPath.ext += ".jsx"
        else
          outputPath.ext += ".tsx"
        if options.output
          optionsPath = path.parse options.output
          try
            stat = await fs.stat options.output
          catch
            stat = null
          if stat?.isDirectory() or options.output.endsWith(path.sep) or
                                    options.output.endsWith('/')
            # -o dir writes outputs into that directory with default name
            outputPath.dir = options.output
          else if /^(\.[^.]+)+$/.test optionsPath.base
            # -o .js or .ts or .civet.js or .civet.ts etc. to control extension
            outputPath.ext = optionsPath.base
            # Can also be prefixed by a directory name
            outputPath.dir = optionsPath.dir if optionsPath.dir
          else
            # -o filename fully specifies the output filename
            # (don't use this with multiple input files)
            outputPath = optionsPath
        # Make output directory in case it doesn't already exist
        fs.mkdir outputPath.dir, recursive: true if outputPath.dir
        outputFilename = path.format outputPath
        try
          await fs.writeFile outputFilename, output
        catch error
          console.error "#{outputFilename} failed to write:"
          console.error error
    else # run
      esm = /^\s*(import|export)\b/m.test output
      if esm
        # Run ESM code via `node --loader @danielx/civet/esm` subprocess
        if stdin
          # If code was read on stdin via command-line argument "-", try to
          # save it in a temporary file in same directory so paths are correct.
          filename = ".stdin-#{process.pid}.civet"
          try
            await fs.writeFile filename, content, {encoding}
          catch e
            console.error "Could not write #{filename} for Civet ESM mode:"
            console.error e
            process.exit 1
        child = require('child_process').spawnSync argv[0], [
          '--loader'
          '@danielx/civet/esm'
          filename
          ...scriptArgs
        ], stdio: 'inherit'
        if stdin
          # Delete temporary file
          await fs.unlink filename
        process.exit child.status
      else
        require '../register.js'
        try
          module.filename = await fs.realpath filename
        catch
          module.filename = filename
        process.argv = ["civet", module.filename, ...scriptArgs]
        module.paths =
          require('module')._nodeModulePaths path.dirname module.filename
        try
          module._compile output, module.filename
        catch error
          console.error "#{filename} crashed while running in CJS mode:"
          console.error error
          process.exit 1

cli() if require.main == module
