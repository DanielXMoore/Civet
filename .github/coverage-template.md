---
name: Coverage improvement
about: Improve test coverage for a specific area of the codebase
title: "Coverage: "
labels: ""
assignees: ""
---

## Goal

Increase test coverage toward 100% statement and branch coverage for **AREA_NAME**.

## Uncovered files (by line count)

<!-- Run `pnpm test:coverage && pnpm show-uncovered` to populate this list -->

- `source/example.civet` — N lines / N regions

## How to find uncovered code

```bash
pnpm test:coverage
pnpm show-uncovered <pattern>
```

`show-uncovered` prints each uncovered region with surrounding context lines, making it easy to understand what input would trigger the branch.

## Workflow

1. Run `pnpm test:coverage` then `pnpm show-uncovered <pattern>` to identify uncovered regions
2. Read the uncovered code to understand what input would trigger it
3. Write a test in the appropriate `test/` file (look at existing tests for the input→output pattern)
4. Run `pnpm test:coverage` and `pnpm show-uncovered <pattern>` to confirm coverage improved
5. Commit after any forward progress (new test, bug fix, dead code removal)
6. Repeat

## Rules

- **If a line is provably unreachable**, delete it
- **If uncovered code has a bug**, fix the bug and write a test that validates the fix
- **Last resort**: if a region is extremely difficult to cover, add `/* c8 ignore next */` with a reason
- Always verify with `show-uncovered` that your test actually covers the target region
- Target both statement and branch coverage — ensure all `if`/`else`/`switch`/`??` branches are exercised
