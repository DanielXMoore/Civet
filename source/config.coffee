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
    config = await fs.readFile path, 'utf8'
    if path.endsWith '.json'
        JSON.parse config
    else
        js = compile config, js: true

        tmpPath = path + ".civet-tmp-#{Date.now()}.mjs"
        await fs.writeFile tmpPath, js
        try
            exports = await import(pathToFileURL(tmpPath))
        finally
            await fs.unlink tmpPath
        if typeof exports.default isnt 'object' or exports.default is null
            throw new Error "civet config file must export an object"
        exports.default
