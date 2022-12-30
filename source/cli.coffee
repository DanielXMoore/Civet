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

        civet [options]                              # REPL
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
      --js             Strip out all type annotations; default to .jsx extension
      --ast            Print the AST instead of the compiled code
      --inline-map     Generate a sourcemap

    You can use - to read from stdin or (prefixed by -o) write to stdout.


  """
  process.exit(0)

{parse, compile, generate} = require "./main"
{prune} = generate

encoding = "utf8"

fs = require "fs/promises"
path = require "path"

parseArgs = (args = process.argv[2..]) ->
  options = {}
  filenames = []
  i = 0
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
      when '--ast'
        options.ast = true
      when '--no-cache'
        options.noCache = true
      when '--inline-map'
        options.inlineMap = true
      when '--js'
        options.js = true
      when '--'
        filenames.push ...args[++i..]
        i = args.length
      else
        filenames.push arg
    i++

  {filenames, options}

readFiles = (filenames, options) ->
  for filename in filenames
    stdin = filename == '-'
    try
      if stdin
        process.stdin.setEncoding encoding
        filename = "<stdin>"
        try
          filename = await fs.realpath '/dev/stdin'
        lines = []
        rl = require('readline').createInterface process.stdin, process.stdout
        rl.on 'line', (buffer) -> lines.push buffer + '\n'
        content = await new Promise (resolve, reject) ->
          rl.on 'SIGINT', ->
            reject '^C'
          rl.on 'close', ->
            resolve lines.join ''
      else
        content = await fs.readFile filename, {encoding}
      yield {filename, content, stdin}
    catch error
      yield {filename, error, stdin}

repl = (options) ->
  console.log "Civet #{version()} REPL.  Enter a blank line to execute code."
  global.quit = global.exit = -> process.exit 0
  nodeRepl = require 'repl'
  vm = require 'vm'
  r = nodeRepl.start
    prompt: '🐱> '
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
          return callback error
        try
          result = vm.runInContext output, context, {filename}
        catch error
          return callback error
        callback null, result
      else  # still reading
        callback new nodeRepl.Recoverable "Enter a blank line to execute code."

cli = ->
  {filenames, options} = parseArgs()
  unless filenames.length
    options.compile = true
    if process.stdin.isTTY
      options.repl = true
    else
      # When piped, default to old behavior of transpiling stdin to stdout
      filenames = ['-']

  options.run = not (options.ast or options.compile)
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
          if stat?.isDirectory()
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
        outputFilename = path.format outputPath
        try
          await fs.writeFile outputFilename, output
        catch error
          console.error "#{outputFilename} failed to write:"
          console.error error
    else # run
      try
        require.main._compile output, filename
      catch error
        console.error "#{filename} crashed while running:"
        console.error error

cli() if require.main == module
