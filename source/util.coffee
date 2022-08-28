# Utility function to create a line/column lookup table for an input string
locationTable = (input, pos) ->
  linesRe = /([^\r\n]*)(\r\n|\r|\n|$)/y
  lines = []
  line = 0
  pos = 0

  while result = linesRe.exec(input)
    pos += result[0].length
    lines[line++] = pos

    break if pos is input.length

  return lines

lookupLineColumn = (table, pos) ->
  l = 0
  prevEnd = 0

  while table[l] <= pos
    prevEnd = table[l++]

  # [line, column]; zero based
  return [l, pos - prevEnd]

module.exports = {
  locationTable
  lookupLineColumn
}
