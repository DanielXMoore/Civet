import { createRequire } from 'module';
import { pathToFileURL } from 'url';

import { compile } from "./dist/main.js";

const baseURL = pathToFileURL(process.cwd() + '/').href;

const extensionsRegex = /\.civet$/;

export async function resolve(specifier, context, defaultResolve) {
  const { parentURL = baseURL } = context;

  if (extensionsRegex.test(specifier)) {
    return {
      format: "civet",
      url: new URL(specifier, parentURL).href,
    };
  }

  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (extensionsRegex.test(url)) {
    const { source: rawSource } = await defaultLoad(url, { format: "civet" });

    return {
      format: "module",
      source: compile(rawSource.toString(), { js: true }),
    };
  }

  // Let Node.js handle all other URLs.
  return defaultLoad(url, context, defaultLoad);
}

// Also transform CommonJS files.
const require = createRequire(import.meta.url);
require("./register.js")
