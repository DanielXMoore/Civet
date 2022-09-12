// Quick and dirty esm loader for .coffee until I transition to .civet

import { readFile } from 'fs/promises';
import { pathToFileURL, fileURLToPath } from 'url';

import CoffeeScript, { compile } from "coffeescript";
// Handle cjs .coffee files
CoffeeScript.register()

const baseURL = pathToFileURL(process.cwd() + '/').href;
const extensionsRegex = /\.coffee$/;

export async function resolve(specifier, context, next) {
  const { parentURL = baseURL } = context;

  if (extensionsRegex.test(specifier)) {
    return {
      shortCircuit: true,
      format: "coffee",
      url: new URL(specifier, parentURL).href,
    };
  }

  // Let Node.js handle all other specifiers.
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (context.format === "coffee") {
    const path = fileURLToPath(url)
    const source = await readFile(path, "utf8")
    const jsSource = compile(source)

    return next(url.replace(extensionsRegex, ".cjs"), {
      format: "commonjs",
      source: jsSource
    });
  }

  // Let Node.js handle all other URLs.
  return next(url, context);
}
