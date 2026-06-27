// Regenerate source/nomemo-rules.civet: the set of parser rules excluded from
// packrat memoization because caching never pays for them.
//
// Method: instrument a copy of dist/main.js to count per-rule cache lookups
// and hits, compile a corpus of real Civet files, and emit every rule whose
// hit rate never reaches 1% in any file (rules shadowed by memoized ancestors,
// for which every cache cycle is pure overhead), plus a curated list of
// single-token / single-regex rules whose bodies are cheaper to re-run than
// one cache cycle.  Background and measurements: notes/parser-memo-allowlist.md
//
// Usage: node scripts/generate-nomemo-rules.mjs   (writes source/nomemo-rules.civet)
//
// Run after `pnpm build` so dist/main.js reflects the current grammar.

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

// Single-token / single-regex rules whose bodies cost less than a cache cycle
// regardless of hit rate.  Deliberately excludes high-traffic composite rules
// whose memoization measurably earns its cost (`_`, `__`, `EOS`, `Indent`,
// `Parameters`, ...): un-memoizing those pays the win back re-running their
// children.
const CHEAP_LEAVES = [
  'NonNewlineWhitespace', 'EOL', 'Whitespace', 'RestOfLine',
  'OpenParen', 'OpenBrace', 'OpenBracket', 'OpenAngleBracket',
  'Hash', 'At', 'QuestionMark', 'DotDotDot', 'Colon',
  'IdentifierName', 'Indent', 'InsertOpenBracket', 'NewlineBinaryOpAllowed',
  'Async', 'Import', 'AtThis', 'InlineComment',
]

const MAX_HIT_RATE = 0.01
const MIN_LOOKUPS_PER_FILE = 100

// --- Build an instrumented bundle ------------------------------------------

let bundle = readFileSync('dist/main.js', 'utf8')

// Neutralize the current nomemo list so every rule is memoized during
// measurement; otherwise rules already in the list can never be re-evaluated.
bundle = bundle.replace(
  /new Set\(\[\s*\.\.\.uncacheable,\s*\.\.\.[A-Za-z_$][\w$]*\s*\]\)/,
  'new Set([...uncacheable])'
)

const patches = [
  [
    `  has(key) {
    return !!this.cache.get(key[0])?.get(key[1])?.get(key[2])?.has(key[3]);
  }`,
    `  has(key) {
    const r = !!this.cache.get(key[0])?.get(key[1])?.get(key[2])?.has(key[3]);
    const S = globalThis.__NOMEMO_STATS;
    let e = S.get(key[3]); if (!e) S.set(key[3], e = {lookups: 0, hits: 0});
    e.lookups++; if (r) e.hits++;
    return r;
  }`,
  ],
]
for (const [from, to] of patches) {
  if (!bundle.includes(from)) {
    console.error('Instrumentation anchor not found in dist/main.js -- StateCache changed shape; update this script.')
    process.exit(1)
  }
  bundle = bundle.replace(from, to)
}

const dir = mkdtempSync(join(tmpdir(), 'civet-nomemo-'))
const instrumented = join(dir, 'main.cjs')
writeFileSync(instrumented, bundle)
const Civet = require(instrumented)

// --- Compile the corpus, tracking each rule's max per-file hit rate --------

const files = execSync(
  "git ls-files 'source/*.civet' 'source/**/*.civet' 'lsp/**/*.civet'",
  { encoding: 'utf8' }
).trim().split('\n')

const agg = new Map() // rule -> { lookups, maxRate }
let compiled = 0
for (const file of files) {
  const stats = (globalThis.__NOMEMO_STATS = new Map())
  try {
    Civet.compile(readFileSync(file, 'utf8'), { sync: true, filename: file })
  } catch {
    continue // corpus may include intentionally-broken fixtures
  }
  compiled++
  for (const [rule, e] of stats) {
    let a = agg.get(rule)
    if (!a) agg.set(rule, (a = { lookups: 0, maxRate: 0 }))
    a.lookups += e.lookups
    if (e.lookups > MIN_LOOKUPS_PER_FILE) {
      a.maxRate = Math.max(a.maxRate, e.hits / e.lookups)
    }
  }
}
console.log(`corpus: ${compiled}/${files.length} files compiled`)

const zeroHit = [...agg.entries()]
  .filter(([, a]) => a.maxRate < MAX_HIT_RATE)
  .map(([rule]) => rule)
const rules = [...new Set([...CHEAP_LEAVES, ...zeroHit])].sort()
console.log(`${zeroHit.length} rules below ${MAX_HIT_RATE * 100}% max hit rate; ${rules.length} total with curated leaves`)

// --- Emit -------------------------------------------------------------------

const header = `// Rules excluded from packrat memoization because caching never pays for them.
//
// Measured 2026-06: only ~30% of cache lookups hit, and 529 of 764 rules never
// reach a 1% hit rate on any file in a 57-file corpus -- they are interior
// rules shadowed by memoized ancestors, so their cache cycles (getStateKey,
// key allocation, multi-layer Map has/get/set, result clone) are pure
// overhead.  The rest of this list is single-token / single-regex rules whose
// bodies are cheaper to re-run than one cache cycle.  High-traffic rules whose
// memoization measurably earns its cost (\`_\`, \`__\`, \`EOS\`, \`Indent\`,
// \`Parameters\`, ...) are deliberately absent.
//
// Skipping memoization cannot change parse results (memoization is transparent
// for pure rules, and impure rules are handled by \`uncacheable\` in
// main.civet), so a stale entry here can only cost performance.
//
// Regenerate with: node scripts/generate-nomemo-rules.mjs
// Background and measurements: notes/parser-memo-allowlist.md
export default [
`

const out = resolve('source/nomemo-rules.civet')
writeFileSync(out, header + rules.map((r) => `  ${JSON.stringify(r)}`).join('\n') + '\n]\n')
console.log(`wrote ${out} (${rules.length} rules)`)
