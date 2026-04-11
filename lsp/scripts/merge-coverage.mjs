/**
 * Merges raw V8 coverage from unit tests (c8) and e2e tests (NODE_V8_COVERAGE)
 * into a single combined report.
 *
 * c8 writes unit test raw files to coverage/unit-raw/
 * @vscode/test-electron writes e2e raw files to coverage/e2e-raw/
 * Both use the same V8 JSON format, so they can be merged by combining into one dir.
 */
import { execSync } from 'child_process'
import { cpSync, mkdirSync, existsSync, rmSync } from 'fs'
import { resolve } from 'path'

const root = process.cwd()
const mergedDir = resolve(root, 'coverage/merged-raw')

if (existsSync(mergedDir)) {
  rmSync(mergedDir, { recursive: true })
}
mkdirSync(mergedDir, { recursive: true })

const sources = [
  { name: 'unit', dir: resolve(root, 'coverage/unit-raw') },
  { name: 'e2e', dir: resolve(root, 'coverage/e2e-raw') },
]

for (const { name, dir } of sources) {
  if (existsSync(dir)) {
    cpSync(dir, mergedDir, { recursive: true })
    console.log(`Merged ${name} coverage from ${dir}`)
  } else {
    console.warn(`Warning: no ${name} coverage found at ${dir}`)
  }
}

console.log('Generating merged coverage report...')
execSync('node_modules/.bin/c8 report --temp-dir coverage/merged-raw', {
  cwd: root,
  stdio: 'inherit',
})
