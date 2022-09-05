import { createRequire } from 'module';
import { pathToFileURL } from 'url';

import { compile } from "./dist/main.js";

const baseURL = pathToFileURL(process.cwd() + '/').href;

const extensionsRegex = /\.civet$/;

export async function resolve(specifier, context, next) {
  const { parentURL = baseURL } = context;

  if (extensionsRegex.test(specifier)) {
    return {
      shortCircuit: true,
      format: "module",
      url: new URL(specifier, parentURL).href,
    };
  }

  // Let Node.js handle all other specifiers.
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (extensionsRegex.test(url)) {
    const { source: rawSource } = await next(url, { format: "module" });

    return {
      format: "module",
      source: compile(rawSource.toString(), { js: true }),
    };
  }

  // Let Node.js handle all other URLs.
  return next(url, context);
}

// Also transform CommonJS files.
const require = createRequire(import.meta.url);
require("./register.js")
