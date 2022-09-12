import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { createRequire } from 'module';
import { pathToFileURL, fileURLToPath } from 'url';

import { compile } from "./dist/main.js";

const baseURL = pathToFileURL(process.cwd() + '/').href;
const extensionsRegex = /\.civet$/;

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
    // NOTE: This causes .civet files to show up as .ts in ts-node error reporting (TODO: May be able to add a sourcemapping)
    const result = await next(url.replace(extensionsRegex, ".ts"), {
      // ts-node won't transpile unless this is module
      // can't use commonjs since we don't rewrite imports
      format: "module",
      // NOTE: Setting the source in the context makes it available when ts-node uses defaultLoad
      source: tsSource
    });

    return result
  }

  // Let Node.js handle all other URLs.
  return next(url, context);
}

const require = createRequire(import.meta.url);
require.extensions[".civet"] = function (m, filename) {
  // We end up here when being required from cjs
  const source = readFileSync(filename, "utf8")
  const code = compile(source, { filename, js: true })

  m._compile(code, filename)
}
