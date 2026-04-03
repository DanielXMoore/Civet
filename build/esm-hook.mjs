import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const _require = createRequire(import.meta.url);
const { compileWithCache } = _require('./cache-utils.js');
const baseURL = pathToFileURL(process.cwd() + '/').href;

export function resolve(specifier, context, next) {
  const parentURL = context.parentURL ?? baseURL;
  if (/\.hera(?:$|[?#])/.test(specifier)) {
    return { shortCircuit: true, format: 'hera', url: new URL(specifier, parentURL).href };
  }
  if (/\.civet(?:$|[?#])/.test(specifier)) {
    return { shortCircuit: true, format: 'civet', url: new URL(specifier, parentURL).href };
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  const { format } = context;
  if (format !== 'hera' && format !== 'civet') return next(url, context);

  const filename = fileURLToPath(url);
  const source = readFileSync(filename, 'utf8');

  const js = await compileWithCache(source, filename);
  return { format: 'module', source: js, shortCircuit: true };
}
