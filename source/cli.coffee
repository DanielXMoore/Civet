if process.argv.includes "--version"
  process.stdout.write require("../package.json").version + "\n"
  process.exit(0)

if process.argv.includes "--help"
  process.stderr.write """
           ▄▄· ▪   ▌ ▐·▄▄▄ .▄▄▄▄▄
          ▐█ ▌▪██ ▪█·█▌▀▄.▀·•██       _._     _,-'""`-._
          ██ ▄▄▐█·▐█▐█•▐▀▀▪▄ ▐█.▪    (,-.`._,'(       |\\`-/|
          ▐███▌▐█▌ ███ ▐█▄▄▌ ▐█▌·        `-.-' \\ )-`( , o o)
          ·▀▀▀ ▀▀▀. ▀   ▀▀▀  ▀▀▀               `-    \\`_`"'-


    Usage:

        civet [options] < input.civet > output.ts

    Options:
      --help          Show this help message
      --version       Show the version number
      --ast           Output the AST instead of the compiled code
      --inline-map    Generate a sourcemap
      --js            Strip out all type annotations


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

  options.run = not (options.ast or options.compile)
  # In run mode, compile to JS
  options.js = true if options.run

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

cli = ->
  {filenames, options} = parseArgs()
  unless filenames.length
    # When piped, default to old behavior of transpiling stdin to stdout
    filenames = ['-']
    options.compile = true

  for await {filename, error, content, stdin} from readFiles filenames, options
    if error
      console.error "#{filename} failed to load:"
      console.error error
      continue

    # Transpile
    try
      output = compile content, options
    catch error
      console.error "#{filename} failed to transpile:"
      console.error error
      continue

    if options.ast
      process.stdout.write JSON.stringify(output, null, 2)
    else if options.compile
      if stdin
        process.stdout.write output
      else
        outputFilename = filename
        if options.js
          outputFilename += ".jsx"
        else
          outputFilename += ".tsx"
        try
          await fs.writeFile outputFilename, output
        catch error
          console.error "#{outputFilename} failed to write:"
          console.error error
    else # run
      try
        vm = require 'vm'
        require.main._compile output, filename
      catch error
        console.error "#{filename} crashed while running:"
        console.error error

cli() if require.main == module
