import { pathToFileURL } from 'url';
import "@danielx/hera/register.js";

const baseURL = pathToFileURL(process.cwd() + '/').href;
const extensionsRegex = /\.hera$/;

export async function resolve(specifier, context, defaultResolve) {
  const { parentURL = baseURL } = context;

  if (extensionsRegex.test(specifier)) {
    return {
      shortCircuit: true,
      url: new URL(specifier, parentURL).href
    };
  }

  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, next) {
  if (extensionsRegex.test(url)) {
    return next(url, {
      format: "commonjs"
    });
  }

  // Let Node.js handle all other URLs.
  return next(url, context);
}
