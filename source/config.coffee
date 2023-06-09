import path from "path"
import fs from "fs/promises"
import { compile } from "./main"
import { pathToFileURL } from "url"

export findConfig = ->
    curr = process.cwd()
    parent = path.dirname curr
    while curr isnt parent # root directory (/, C:, etc.)
        dir = await fs.opendir curr
        for await entry from dir
            if entry.name in ['config.civet', '.civetconfig', 'civet.json'] 
                return path.join curr, entry.name
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
        if typeof exports.default isnt 'object'
            throw new Error "config.civet must export an object"
        exports.default
    