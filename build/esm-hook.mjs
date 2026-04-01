import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const _require = createRequire(import.meta.url);
const baseURL = pathToFileURL(process.cwd() + '/').href;

let cacheDir;
let civetCompile;
let civetVersion;
let heraCompile;
let heraVersion;

export function initialize({ civetSource, civetVersion: cv, cacheDir: cd }) {
  cacheDir = cd;
  civetVersion = cv;
  civetCompile = _require(civetSource).compile;
  heraCompile = _require('@danielx/hera/dist/main.js').compile;
  heraVersion = _require('@danielx/hera/package.json').version;
}

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

function getCachePath(key) {
  return `${cacheDir}/${key}.mjs`;
}

function readCache(p) {
  try { return readFileSync(p, 'utf8'); } catch {}
}

function writeCache(p, content) {
  try { mkdirSync(cacheDir, { recursive: true }); } catch {}
  try {
    const tmp = p + '.tmp.' + process.pid;
    writeFileSync(tmp, content);
    renameSync(tmp, p);
  } catch {}
}

export async function load(url, context, next) {
  const { format } = context;
  if (format !== 'hera' && format !== 'civet') return next(url, context);

  const filename = fileURLToPath(url);
  const source = readFileSync(filename, 'utf8');

  const key = format === 'hera'
    ? createHash('sha1')
        .update(heraVersion).update('\0')
        .update(civetVersion).update('\0')
        .update(source).update('\0')
        .update(filename).update('\0hera')
        .digest('hex')
    : createHash('sha1')
        .update(civetVersion).update('\0')
        .update(source).update('\0')
        .update(filename).update('\0civet')
        .digest('hex');

  const p = getCachePath(key);
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
