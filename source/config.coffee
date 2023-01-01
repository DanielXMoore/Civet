fs = require 'fs/promises'
path = require 'path'

searchConfig = (fromFile) ->
  # It should not be useful, but just an insurance not falling into loop
  maxSearchLevel = 30
  configNames = [
    'civet-config.json',
    'civetConfig.json',
    'civet_config.json'
  ]
  exists = (path) => 
    fs.access(path)
      .then => true
      .catch => false
  #console.log "Starting with #{fromFile}"
  checkingPath = path.dirname fromFile
  basename = path.basename fromFile
  for _ in [0...maxSearchLevel]
    packagePath = path.resolve checkingPath, "package.json"
    #console.log("Checking #{packagePath}")
    if await exists packagePath
      for configName from configNames
        configPath = path.resolve checkingPath, configName
        if await exists configPath
          return await loadConfig configPath 
    nextPath = path.resolve checkingPath, "../"
    break if checkingPath == nextPath
    checkingPath = nextPath
  {}

loadConfig = (file) ->
  try
    config = await fs.readFile file
    return JSON.parse config
  catch err
    console.error "Fail to parse civet config. Will fallback to default options. \n#{}"
    return {}

module.exports =
  searchConfig: searchConfig
  loadConfig: loadConfig
