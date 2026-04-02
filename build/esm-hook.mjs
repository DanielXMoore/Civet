import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const _require = createRequire(import.meta.url);
const { getCachePath, readCache, writeCache, civetCompile, heraCompile } = _require('./cache-utils.js');
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

  const p = getCachePath({ type: format, source, filename });

  const cached = readCache(p);
  if (cached) return { format: 'module', source: cached, shortCircuit: true };

  let js;
  if (format === 'hera') {
    const civetOutput = heraCompile(source, { filename, module: true });
    js = await civetCompile(civetOutput, { filename, js: true, inlineMap: true });
  } else {
    js = await civetCompile(source, { filename, js: true, inlineMap: true });
  }

  writeCache(p, js);
  return { format: 'module', source: js, shortCircuit: true };
}
