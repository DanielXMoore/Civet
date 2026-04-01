import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { compile: civetCompile } = require('@danielx/civet');
const civetVersion = require('@danielx/civet/package.json').version;

let cacheDir;

export function initialize(data) {
  cacheDir = data.cacheDir;
}

const baseURL = pathToFileURL(process.cwd() + '/').href;

function getCachePath(source, filename) {
  const key = createHash('sha1')
    .update(civetVersion)
    .update('\0')
    .update(source)
    .update('\0')
    .update(filename || '')
    .update('\0civet-esm')
    .digest('hex');
  return join(cacheDir, key + '.mjs');
}

function ensureCacheDir() {
  try { mkdirSync(cacheDir, { recursive: true }); } catch {}
}

export function resolve(specifier, context, nextResolve) {
  if (/\.civet$/.test(specifier)) {
    const parentURL = context.parentURL ?? baseURL;
    return {
      shortCircuit: true,
      format: 'civet',
      url: new URL(specifier, parentURL).href,
    };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (!url.endsWith('.civet')) {
    return nextLoad(url, context);
  }

  const filename = fileURLToPath(url);
  const source = readFileSync(filename, 'utf8');
  const cachePath = getCachePath(source, filename);

  // Cache hit
  try {
    const cached = readFileSync(cachePath, 'utf8');
    return { format: 'module', source: cached, shortCircuit: true };
  } catch {}

  // Cache miss — compile with civet
  const compiled = await civetCompile(source, { filename, inlineMap: true, js: true });

  // Write atomically
  ensureCacheDir();
  try {
    const tmpPath = cachePath + '.tmp.' + process.pid;
    writeFileSync(tmpPath, compiled);
    renameSync(tmpPath, cachePath);
  } catch {}

  return { format: 'module', source: compiled, shortCircuit: true };
}
