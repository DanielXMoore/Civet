import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Data passed from register() call
let cacheDir;
let heraCompile;
let heraVersion;

export function initialize(data) {
  cacheDir = data.cacheDir;
  const require = createRequire(data.heraMainPath);
  heraCompile = require('@danielx/hera/dist/main.js').compile;
  heraVersion = require('@danielx/hera/package.json').version;
}

function getCachePath(source, filename) {
  const key = createHash('sha1')
    .update(heraVersion)
    .update('\0')
    .update(source)
    .update('\0')
    .update(filename || '')
    .update('\0esm')
    .digest('hex');
  return join(cacheDir, key + '.mjs');
}

function ensureCacheDir() {
  try { mkdirSync(cacheDir, { recursive: true }); } catch {}
}

export async function load(url, context, nextLoad) {
  if (!url.endsWith('.hera')) {
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

  // Cache miss — compile with hera
  const compiled = heraCompile(source, { filename, inlineMap: true, module: true });

  // Write atomically
  ensureCacheDir();
  try {
    const tmpPath = cachePath + '.tmp.' + process.pid;
    writeFileSync(tmpPath, compiled);
    renameSync(tmpPath, cachePath);
  } catch {}

  return { format: 'module', source: compiled, shortCircuit: true };
}
