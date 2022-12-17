pkgJSON = require '../package.json'

# increment point version by 1
parts = pkgJSON.version.split('.')
last = parts.length - 1
pkgJSON.version = parts.map (v, i) ->
  if i is last
    v = (parseInt(v) + 1).toString()
  return v
.join '.'

# write package.json
fs = require 'fs'
fs.writeFileSync 'package.json', JSON.stringify(pkgJSON, null, 2)
