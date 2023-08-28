import path from "path"
import fs from "fs/promises"
import { compile } from "./main"
import { pathToFileURL } from "url"

findInDir = (dirPath) ->
    dir = await fs.opendir dirPath
    for await entry from dir
        if entry.isDirectory() and entry.name is '.config' # scan for ./civet.json as well as ./.config/civet.json
            return findInDir path.join dirPath, entry.name
        if entry.isFile()
            name = entry.name.replace(/^\./, '') # allow both .civetconfig.civet and civetconfig.civet
            if name in ['🐈.json', 'civet.json', 'civetconfig.json']
                return path.join dirPath, entry.name
    null

export findConfig = (startDir) ->
    curr = startDir
    parent = path.dirname curr
    while curr isnt parent # root directory (/, C:, etc.)
        if configPath = await findInDir curr
            return configPath
        curr = parent
        parent = path.dirname curr
    null

export loadConfig = (path) ->
    JSON.parse await fs.readFile path, 'utf8'
