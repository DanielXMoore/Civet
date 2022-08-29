# Utility function to create a line/column lookup table for an input string
locationTable = (input) ->
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

Sourcemap = (sourceString) ->
  srcTable = locationTable sourceString

  sm = {
    lines: [[]]
    lineNum: 0
    colOffset: 0
    srcTable: srcTable
  }

  EOL = /\r?\n|\r/

  return
    data: sm
    renderMappings: ->
      lastSourceLine = 0
      lastSourceColumn = 0

      sm.lines.map (line) ->
        line.map (entry) ->
          if entry.length is 4
            [colDelta, sourceFileIndex, srcLine, srcCol] = entry
            lineDelta = srcLine - lastSourceLine
            colDelta = srcCol - lastSourceColumn
            lastSourceLine = srcLine
            lastSourceColumn = srcCol
            "#{encodeVlq(entry[0])}#{encodeVlq(sourceFileIndex)}#{encodeVlq(lineDelta)}#{encodeVlq(colDelta)}"
          else
            encodeVlq entry[0]
        .join(",")
      .join(";")

    srcMap: (srcFileName, outFileName) ->
      version: 3
      file: outFileName
      sources: [srcFileName]
      mappings: @renderMappings()
      names: []
      sourcesContent: [sourceString]

    updateSourceMap: (outputStr, inputPos) ->
      debugger
      outLines = outputStr.split(EOL)

      outLines.forEach (line, i) ->
        if i > 0
          sm.lineNum++
          sm.colOffset = 0
          sm.lines[sm.lineNum] = []

        l = sm.colOffset
        sm.colOffset = line.length

        if inputPos?
          [srcLine, srcCol] = lookupLineColumn(srcTable, inputPos)
          # srcLine and srcCol are absolute here
          sm.lines[sm.lineNum].push [l, 0, srcLine, srcCol]
        else if l != 0
          sm.lines[sm.lineNum].push [l]


VLQ_SHIFT            = 5
VLQ_CONTINUATION_BIT = 1 << VLQ_SHIFT             # 0010 0000
VLQ_VALUE_MASK       = VLQ_CONTINUATION_BIT - 1   # 0001 1111

encodeVlq = (value) ->
  answer = ''

  # Least significant bit represents the sign.
  signBit = if value < 0 then 1 else 0

  # The next bits are the actual value.
  valueToEncode = (Math.abs(value) << 1) + signBit

  # Make sure we encode at least one character, even if valueToEncode is 0.
  while valueToEncode or not answer
    nextChunk = valueToEncode & VLQ_VALUE_MASK
    valueToEncode = valueToEncode >> VLQ_SHIFT
    nextChunk |= VLQ_CONTINUATION_BIT if valueToEncode
    answer += encodeBase64 nextChunk

  return answer

BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

encodeBase64 = (value) ->
  BASE64_CHARS[value] or throw new Error "Cannot Base64 encode value: #{value}"

module.exports = {
  locationTable
  lookupLineColumn
  Sourcemap
}
