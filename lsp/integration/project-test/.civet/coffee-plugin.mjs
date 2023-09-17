// Rudimentary CoffeeScript plugin
import { compile as coffeeCompile } from "coffeescript"

function compile(path, source) {
  const { js, sourceMap } = coffeeCompile(source, {
    bare: true,
    filename: path,
    header: false,
    sourceMap: true
  })

  const convertedSourceMap = convertCoffeeScriptSourceMap(sourceMap)

  console.log("COFFEE SOURCE MAP", sourceMap, convertedSourceMap)

  return {
    code: js,
    sourceMap: {
      data: {
        lines: convertedSourceMap
      }
    }
  }
}

function convertCoffeeScriptSourceMap(sourceMap) {
  const lines = []
  let columnDelta = 0

  for (const entry of sourceMap.lines) {
    if (!entry) {
      lines.push([])
    } else {
      let lastColumn = columnDelta = 0
      let lastSourceColumn = -1
      lines.push(entry.columns.filter(x => x).map(function ({ column, sourceLine, sourceColumn }) {
        // Gross Hack to prevent coffeescript mapping punctuation to the start of the line
        if (sourceColumn <= lastSourceColumn) {
          return [0]
        }
        lastSourceColumn = sourceColumn

        columnDelta = column - lastColumn
        lastColumn = column

        return [columnDelta, 0, sourceLine, sourceColumn]
      }))
    }
  }

  return lines
}

export default {
  transpilers: [{
    extension: ".coffee",
    target: ".js",
    compile,
  }],
}
