#!/usr/bin/env node
/**
 * show-uncovered.mjs
 *
 * Reads coverage/coverage-final.json and prints uncovered code with context,
 * formatted for easy reading by humans or LLM agents.
 *
 * Usage:
 *   node scripts/show-uncovered.mjs [file-pattern] [--context N]
 *
 * Examples:
 *   node scripts/show-uncovered.mjs
 *   node scripts/show-uncovered.mjs typescript-service
 *   node scripts/show-uncovered.mjs --context 5
 */

import { readFileSync, existsSync } from "fs"
import { resolve, relative } from "path"

const args = process.argv.slice(2)
const patternArg = args.find((a) => !a.startsWith("--"))
const contextIdx = args.indexOf("--context")
const CONTEXT = contextIdx !== -1 ? parseInt(args[contextIdx + 1], 10) : 3

const coveragePath = resolve("coverage/coverage-final.json")
if (!existsSync(coveragePath)) {
  console.error("No coverage data found. Run pnpm test:coverage first.")
  process.exit(1)
}

const coverage = JSON.parse(readFileSync(coveragePath, "utf8"))

for (const [filePath, data] of Object.entries(coverage)) {
  const rel = relative(process.cwd(), filePath)
  if (patternArg && !rel.includes(patternArg)) continue

  // Collect uncovered statement line numbers (1-based)
  const uncoveredLines = new Set()
  for (const [id, count] of Object.entries(data.s)) {
    if (count === 0) {
      const loc = data.statementMap[id]
      for (let l = loc.start.line; l <= loc.end.line; l++) uncoveredLines.add(l)
    }
  }

  if (uncoveredLines.size === 0) continue

  // Read source
  if (!existsSync(filePath)) continue
  const lines = readFileSync(filePath, "utf8").split("\n")

  // Group consecutive uncovered lines into ranges
  const sorted = [...uncoveredLines].sort((a, b) => a - b)
  const ranges = []
  let start = sorted[0], end = sorted[0]
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] <= end + 1) {
      end = sorted[i]
    } else {
      ranges.push([start, end])
      start = end = sorted[i]
    }
  }
  ranges.push([start, end])

  console.log(`\n${"=".repeat(60)}`)
  console.log(`FILE: ${rel}  (${uncoveredLines.size} uncovered lines in ${ranges.length} region(s))`)
  console.log(`${"=".repeat(60)}`)

  // Merge nearby ranges so we don't print the same context twice
  const merged = [ranges[0]]
  for (let i = 1; i < ranges.length; i++) {
    const prev = merged[merged.length - 1]
    if (ranges[i][0] - prev[1] <= CONTEXT * 2 + 1) {
      prev[1] = ranges[i][1]
    } else {
      merged.push(ranges[i])
    }
  }

  for (const [rStart, rEnd] of merged) {
    const from = Math.max(1, rStart - CONTEXT)
    const to = Math.min(lines.length, rEnd + CONTEXT)
    console.log(`\n  Lines ${rStart}–${rEnd}:`)
    for (let l = from; l <= to; l++) {
      const marker = uncoveredLines.has(l) ? ">>>" : "   "
      const lineNum = String(l).padStart(4)
      console.log(`  ${marker} ${lineNum}: ${lines[l - 1]}`)
    }
  }
}

console.log("")
