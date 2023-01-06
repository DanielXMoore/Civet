"civet coffeeCompat"

# Utility function to create a line/column lookup table for an input string
export locationTable = (input) ->
  linesRe = /([^\r\n]*)(\r\n|\r|\n|$)/y
  lines = []
  line = 0
  pos = 0

  while result = linesRe.exec(input)
    pos += result[0].length
    lines[line++] = pos

    break if pos is input.length

  return lines

export lookupLineColumn = (table, pos) ->
  l = 0
  prevEnd = 0

  while table[l] <= pos
    prevEnd = table[l++]

  # [line, column]; zero based
  return [l, pos - prevEnd]

export SourceMap = (sourceString) ->
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
    source: ->
      sourceString
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

    json: (srcFileName, outFileName) ->
      version: 3
      file: outFileName
      sources: [srcFileName]
      mappings: @renderMappings()
      names: []
      sourcesContent: [sourceString]

    updateSourceMap: (outputStr, inputPos) ->
      outLines = outputStr.split(EOL)

      if inputPos?
        [srcLine, srcCol] = lookupLineColumn(srcTable, inputPos)

      outLines.forEach (line, i) ->
        if i > 0
          sm.lineNum++
          sm.colOffset = 0
          sm.lines[sm.lineNum] = []
          srcCol = 0

        l = sm.colOffset
        sm.colOffset = line.length

        if inputPos?
          # srcLine and srcCol are absolute here
          sm.lines[sm.lineNum].push [l, 0, srcLine+i, srcCol]
        else if l != 0
          sm.lines[sm.lineNum].push [l]

      return

SourceMap.parseWithLines = (base64encodedJSONstr) ->
  json = JSON.parse Buffer.from(base64encodedJSONstr, "base64").toString("utf8")
  sourceLine = 0
  sourceColumn = 0

  lines = json.mappings.split(";").map (line) ->
    if line.length is 0
      return []

    line.split(",").map (entry) ->
      result = decodeVLQ entry

      switch result.length
        when 1
          [result[0]]
        when 4
          [result[0], result[1], sourceLine += result[2], sourceColumn += result[3]]
        when 5
          [result[0], result[1], sourceLine += result[2], sourceColumn += result[3], result[4]]
        else
          throw new Error("Unknown source map entry", result)

  json.lines = lines

  return json

smRegexp = /\n\/\/# sourceMappingURL=data:application\/json;charset=utf-8;base64,([+a-zA-Z0-9\/]*=?=?)$/

#
###*
Remap a string with compiled code and a source map to use a new source map
referencing upstream source files.
###
SourceMap.remap = (codeWithSourceMap, upstreamMap, sourcePath, targetPath) ->
  sourceMapText = codeWithSourceMap.match(smRegexp)

  if sourceMapText
    parsed = SourceMap.parseWithLines sourceMapText[1]
  else
    console.warn "No source map found in code"
    return codeWithSourceMap

  composedLines = SourceMap.composeLines upstreamMap.data.lines, parsed.lines
  upstreamMap.data.lines = composedLines

  remappedSourceMapJSON = upstreamMap.json(sourcePath, targetPath)

  codeWithoutSourceMap = codeWithSourceMap.replace(smRegexp, "")
  # NOTE: be sure to keep comment split up so as not to trigger tools from confusing it with the actual sourceMappingURL
  newSourceMap = "#{"sourceMapping"}URL=data:application/json;charset=utf-8;base64,#{base64Encode JSON.stringify(remappedSourceMapJSON)}"

  remappedCodeWithSourceMap = "#{codeWithoutSourceMap}\n//# #{newSourceMap}"
  return remappedCodeWithSourceMap

SourceMap.composeLines = (upstreamMapping, lines) ->
  lines.map (line, l) ->

    line.map (entry) ->
      if entry.length is 1
        return entry

      [colDelta, sourceFileIndex, srcLine, srcCol] = entry
      srcPos = remapPosition [srcLine, srcCol], upstreamMapping

      if !srcPos
        return [entry[0]]

      [ upstreamLine, upstreamCol]  = srcPos

      if entry.length is 4
        return [colDelta, sourceFileIndex, upstreamLine, upstreamCol]

      # length is 5
      return [colDelta, sourceFileIndex, upstreamLine, upstreamCol, entry[4]]

# write a formatted error message to the console displaying the source code with line numbers
# and the error underlined
prettySourceExcerpt = (source, location, length) ->
  lines = source.split(/\r?\n|\r/)
  lineNum = location.line
  colNum = location.column

  # print the source code above and below the error location with line numbers and underline from location to length
  for i in [lineNum - 2 .. lineNum + 2]
    if i < 0 or i >= lines.length
      continue

    line = lines[i]
    lineNumStr = (i + 1).toString()
    lineNumStr = " " + lineNumStr while lineNumStr.length < 4

    if i is lineNum
      console.log "#{lineNumStr}: #{line}"
      console.log " ".repeat(lineNumStr.length + 2 + colNum) + "^".repeat(length)
    else
      console.log "#{lineNumStr}: #{line}"

  return

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

# Note: currently only works in node
export base64Encode = (src) ->
  return Buffer.from(src).toString('base64')

# Accelerate VLQ decoding with a lookup table
vlqTable = new Uint8Array(128)
vlqChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
do ->
  i = 0
  l = vlqTable.length
  while i < l
    vlqTable[i] = 0xFF
    i++
  i = 0
  l = vlqChars.length
  while i < l
    vlqTable[vlqChars.charCodeAt(i)] = i
    i++

decodeError = (message) ->
  throw new Error(message)

# reference: https://github.com/evanw/source-map-visualization/blob/gh-pages/code.js#L199
decodeVLQ = (mapping) ->
  i = 0
  l = mapping.length
  result = []

  # Scan over the input
  while (i < l)
    shift = 0
    vlq = 0

    while true
      if i >= l
        decodeError 'Unexpected early end of mapping data'
      # Read a byte
      c = mapping.charCodeAt(i)
      if (c & 0x7F) != c
        decodeError "Invalid mapping character: #{JSON.stringify(String.fromCharCode(c))}"
      index = vlqTable[c & 0x7F]
      if (index is 0xFF)
        decodeError "Invalid mapping character: #{JSON.stringify(String.fromCharCode(c))}"
      i++

      # Decode the byte
      vlq |= (index & 31) << shift
      shift += 5

      # Stop if there's no continuation bit
      break if (index & 32) is 0

    # Recover the signed value
    if vlq & 1
      v = -(vlq >> 1)
    else
      v = vlq >> 1

    result.push v

  return result


###*
* Take a position in generated code and map it into a position in source code.
* Reverse mapping.
*
* Returns undefined if there is not an exact match
###
remapPosition = (position, sourcemapLines) ->
  [ line, character ] = position

  textLine = sourcemapLines[line]
  # Return undefined if no mapping at this line
  if (!textLine?.length)
    return undefined

  i = 0
  p = 0
  l = textLine.length
  lastMapping = undefined
  lastMappingPosition = 0

  while (i < l)
    mapping = textLine[i]
    p += mapping[0]

    if (mapping.length is 4)
      lastMapping = mapping
      lastMappingPosition = p

    if (p >= character)
      break

    i++

  if character - lastMappingPosition != 0
    return undefined

  if (lastMapping)
    [lastMapping[2], lastMapping[3]]

  else
    # console.error("no mapping for ", position)
    return undefined
