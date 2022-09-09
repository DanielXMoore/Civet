import { readFile } from 'fs/promises';
import { createRequire } from 'module';
import { pathToFileURL, fileURLToPath } from 'url';

import { compile } from "./dist/main.js";

const baseURL = pathToFileURL(process.cwd() + '/').href;
const extensionsRegex = /\.civet$/;

const cache = new Map

export async function resolve(specifier, context, next) {
  const { parentURL = baseURL } = context;

  if (extensionsRegex.test(specifier)) {
    return {
      shortCircuit: true,
      format: "civet",
      url: new URL(specifier, parentURL).href,
    };
  }

  // Let Node.js handle all other specifiers.
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (context.format === "civet") {
    const path = fileURLToPath(url)
    const source = await readFile(path, "utf8")
    const tsSource = compile(source)

    // NOTE: Assuming ts-node hook follows load hook
    // NOTE: This causes .civet files to show up as .ts in ts-node error reporting
    const result = await next(url.replace(extensionsRegex, ".ts"), {
      // ts-node won't transpile unless this is module
      // can't use commonjs since we don't rewrite imports
      format: "module",
      source: tsSource
    });

    // NOTE: If I don't set the format to 'commonjs' then I get
    // "ReferenceError: exports is not defined in ES module scope"
    // setting the format to commonjs causes the require.extensions
    // handler to be invoked. So we cache the ts-node transpilation
    // result, hook into require.extensions, and return the result there.
    // Hopefully node loaders simplify this in the future.
    result.format = "commonjs"
    cache.set(path, result.source)

    return result
  }

  // Let Node.js handle all other URLs.
  return next(url, context);
}

// Cache our double transpiled sources (.civet -> .ts -> .js)
const require = createRequire(import.meta.url);
require.extensions[".civet"] = function (m, filename) {
  const code = cache.get(filename)
  if (!code) throw new Error(`Code for ${filename} wasn't in transpiled cache.`)

  m._compile(code, filename)
  // Module should be cached after the first load so we can release the memory
  cache.delete(filename)
}
