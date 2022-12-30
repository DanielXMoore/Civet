###
This script tries running Civet on the specified files, and repeatedly
removes lines where Civet complains about a syntax error, to see how many
lines successfully compile.  This gives a rough idea of backward
compatibility with CoffeeScript (but doesn't test for correct compilation).
It adds "civet coffeeCompat" to .coffee files if there isn't already a
leading civet directive.
###

fs = require 'fs'
civet = require '..'

countLines = (lines) ->
  lines.length - (if lines.at(-1) == '' then 1 else 0)

if process.argv.length <= 2
  console.log "> Provide one of more filenames to try running through Civet"
  process.exit 1

for filename in process.argv[2..]
  console.log '*', filename
  input = fs.readFileSync filename, encoding: 'utf8'

  lines = input.split '\n'
  origCount = countLines lines

  loop
    try
      civet.compile input, {filename}
      break
    catch e
      match = e.message.match ///
        ^\s*
        #{filename.replace /[\.*+?|\[\](){}\\]/g, "\\$&"}
        :(\d+)
      ///
      unless match?
        console.error "Unrecognized error message #{JSON.stringify e.message}; counts will be inaccurate"
        break
      line = match[1] - 1  # convert 1-base to 0-base
      #console.log 'Removing line', line
      lines[line..line] = []
      input = lines.join '\n'

  newCount = countLines lines
  removedCount = origCount - newCount
  console.log "#{(newCount / origCount * 100).toFixed 1}% success (removed #{removedCount} out of #{origCount} lines)"
