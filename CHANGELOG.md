# Civet Changelog

This changelog is generated automatically by [`build/changelog.civet`](build/changelog.civet).
For each version of Civet, it lists and links to all incorporated PRs,
as well as a full diff and commit list.

## 0.10.7 (2025-09-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.10.6...v0.10.7), [commits](https://github.com/DanielXMoore/Civet/commits/v0.10.7))
* Support Unicode BOM: UTF-8, UTF-16 LE and BE [[#1792](https://github.com/DanielXMoore/Civet/pull/1792)]
* Fix access detection in braced expressions [[#1794](https://github.com/DanielXMoore/Civet/pull/1794)]
* Fix errors in TypeScript types [[#1798](https://github.com/DanielXMoore/Civet/pull/1798)]
* CLI passes SIGINT etc signals onto ESM scripts [[#1787](https://github.com/DanielXMoore/Civet/pull/1787)]
* Fix `AutoPromise` wrapper in async functions with complex return types (e.g. OR) [[#1793](https://github.com/DanielXMoore/Civet/pull/1793)]
* Global configuration of operators via `operators` [[#1799](https://github.com/DanielXMoore/Civet/pull/1799)]

## 0.10.6 (2025-09-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.10.5...v0.10.6), [commits](https://github.com/DanielXMoore/Civet/commits/v0.10.6))
* Comment and tidy up source mapping util [[#1758](https://github.com/DanielXMoore/Civet/pull/1758)]
* Throw on esbuild emitDeclaration misconfiguration [[#1759](https://github.com/DanielXMoore/Civet/pull/1759)]
* LSP: log to `connection.console` instead of stdio for Neovim compatibility [[#1764](https://github.com/DanielXMoore/Civet/pull/1764)]
* LSP: Fix loading race condition by making `TSService` initialization async [[#1771](https://github.com/DanielXMoore/Civet/pull/1771)]
* LSP: Option to disable language server for JS/TS files [[#1773](https://github.com/DanielXMoore/Civet/pull/1773)]
* Fix typo in cheatsheet [[#1770](https://github.com/DanielXMoore/Civet/pull/1770)]
* Fix REPL handling of blank lines on Node 24 [[#1769](https://github.com/DanielXMoore/Civet/pull/1769)]
* LSP: fix and improve tests (for async TSService + removed hardcoded paths) [[#1774](https://github.com/DanielXMoore/Civet/pull/1774)]
* LSP: Handle conflicts and race conditions by rearchitecting update queue for atomic project-based changes [[#1775](https://github.com/DanielXMoore/Civet/pull/1775)]
* Fix source map's `sources` using unplugin with `outputExtension` [[#1782](https://github.com/DanielXMoore/Civet/pull/1782)]
* CoffeeScript classes support static fields/methods [[#1776](https://github.com/DanielXMoore/Civet/pull/1776)]
* LSP cleanup: improve type safety and resolve linter errors [[#1772](https://github.com/DanielXMoore/Civet/pull/1772)]
* Allow implicit object literal to end by `)`/`]`/`}` [[#1786](https://github.com/DanielXMoore/Civet/pull/1786)]

## 0.10.5 (2025-06-30, [diff](https://github.com/DanielXMoore/Civet/compare/v0.10.4...v0.10.5), [commits](https://github.com/DanielXMoore/Civet/commits/v0.10.5))
* `this` and `@` are valid types (within classes) [[#1743](https://github.com/DanielXMoore/Civet/pull/1743)]
* Fix CoffeeScript comments getting treated as `length` shorthand [[#1750](https://github.com/DanielXMoore/Civet/pull/1750)]
* LSP: update TypeScript [[#1753](https://github.com/DanielXMoore/Civet/pull/1753)]

## 0.10.4 (2025-05-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.10.3...v0.10.4), [commits](https://github.com/DanielXMoore/Civet/commits/v0.10.4))
* Fix implicit returns in IIFEs with "civet -implicitReturns" [[#1737](https://github.com/DanielXMoore/Civet/pull/1737)]
* Typed pinned arguments such as `(^x: T) =>`; forbid implicit object literals in pinned patterns [[#1736](https://github.com/DanielXMoore/Civet/pull/1736)]
* Fix `outputExtension` option in unplugin, enabling `.svelte.ts`/`.svelte.js` for Svelte Runes reactive compatibility [[#1733](https://github.com/DanielXMoore/Civet/pull/1733)]
* Type-only class field declarations `declare field: T` [[#1741](https://github.com/DanielXMoore/Civet/pull/1741)]

## 0.10.3 (2025-04-28, [diff](https://github.com/DanielXMoore/Civet/compare/v0.10.2...v0.10.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.10.3))
* Explicit changelog build script shell [[#1727](https://github.com/DanielXMoore/Civet/pull/1727)]
* ESM loader supports civetconfig by default, and overriding configuration [[#1734](https://github.com/DanielXMoore/Civet/pull/1734)]
  * BREAKING CHANGE: If you don't use civetconfig files and want to be robust against their existence in ancestor directories, or want to maximize performance, use `@danielx/civet/register-noconfig` instead of `@danielx/civet/register`
  * BREAKING CHANGE: In unplugin settings, `config: undefined` no longer disables searching for config files. Use `config: false` or `config: null` instead.

## 0.10.2 (2025-04-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.10.1...v0.10.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.10.2))
* Fix unplugin source map directories [[#1726](https://github.com/DanielXMoore/Civet/pull/1726)]

## 0.10.1 (2025-03-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.10.0...v0.10.1), [commits](https://github.com/DanielXMoore/Civet/commits/v0.10.1))
* More general expressions in indented forms of `implements` and `with` [[#1720](https://github.com/DanielXMoore/Civet/pull/1720)]
* Allow `>code` to continue an implicit JSX fragment [[#1721](https://github.com/DanielXMoore/Civet/pull/1721)]
* Fix hot reload via unplugin in NextJS, fix sourcemaps with `ts: "preserve"` [[#1722](https://github.com/DanielXMoore/Civet/pull/1722)]
* Farm and Rolldown bundler support [[#1723](https://github.com/DanielXMoore/Civet/pull/1723)]

## 0.10.0 (2025-03-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.9.7...v0.10.0), [commits](https://github.com/DanielXMoore/Civet/commits/v0.10.0))
* Document `class with A, B` mixins [[#1703](https://github.com/DanielXMoore/Civet/pull/1703)]
* Document how to use VSCode plugin [[#1704](https://github.com/DanielXMoore/Civet/pull/1704)]
* Allow comment before bulleted array [[#1713](https://github.com/DanielXMoore/Civet/pull/1713)]
* Fix exit detection for `switch` with fallthrough [[#1714](https://github.com/DanielXMoore/Civet/pull/1714)]
* Require `from` in backwards `import`/`export` to fix ambiguity with dynamic `import` [[#1715](https://github.com/DanielXMoore/Civet/pull/1715)]
  * BREAKING CHANGE: `module import spec` needs to written as `from module import spec` (`from` can no longer be omitted)
* Support nested types in parentheses [[#1716](https://github.com/DanielXMoore/Civet/pull/1716)]
* Fix `export`ing statement expressions [[#1717](https://github.com/DanielXMoore/Civet/pull/1717)]
* Fix complex one-line `if` then blocks via bracing [[#1718](https://github.com/DanielXMoore/Civet/pull/1718)]
* Indented forms of `implements` and `with` [[#1719](https://github.com/DanielXMoore/Civet/pull/1719)]

## 0.9.7 (2025-02-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.9.6...v0.9.7), [commits](https://github.com/DanielXMoore/Civet/commits/v0.9.7))
* Allow binary operators after nested object literals and bulleted arrays, fix `++` with bulleted arrays [[#1688](https://github.com/DanielXMoore/Civet/pull/1688)]
* Fix bind property shorthand in JSX [[#1690](https://github.com/DanielXMoore/Civet/pull/1690)]
* Property `::` types with initializers are optional [[#1701](https://github.com/DanielXMoore/Civet/pull/1701)]
* Fix LSP when opening files without workspace [[#1702](https://github.com/DanielXMoore/Civet/pull/1702)]

## 0.9.6 (2025-01-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.9.5...v0.9.6), [commits](https://github.com/DanielXMoore/Civet/commits/v0.9.6))
* `yield*` in pipeline [[#1670](https://github.com/DanielXMoore/Civet/pull/1670)]
* Fix implicit return of pipeline with `return`/`throw` [[#1676](https://github.com/DanielXMoore/Civet/pull/1676)]
* Fix immediately called `(op)` in pipeline context  [[#1677](https://github.com/DanielXMoore/Civet/pull/1677)]
* Fix pipe into certain `new` expressions [[#1678](https://github.com/DanielXMoore/Civet/pull/1678)]
* Improve Playground error styling [[#1679](https://github.com/DanielXMoore/Civet/pull/1679)]
* Handle invalid precedence in operators [[#1681](https://github.com/DanielXMoore/Civet/pull/1681)]
* Allow spaces in `(op)`, force spaces in `(in)` and `(instanceof)` [[#1684](https://github.com/DanielXMoore/Civet/pull/1684)]
* Fix unwrapping of operator sections with placeholders [[#1685](https://github.com/DanielXMoore/Civet/pull/1685)]

## 0.9.5 (2025-01-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.9.4...v0.9.5), [commits](https://github.com/DanielXMoore/Civet/commits/v0.9.5))
* Named binding patterns `name^pattern` in pattern matching, function parameters, declarations, `for` loops; fix complex bindings in `for` loops [[#1668](https://github.com/DanielXMoore/Civet/pull/1668)]
* Fix property `::` typing with private fields [[#1669](https://github.com/DanielXMoore/Civet/pull/1669)]

## 0.9.4 (2024-12-31, [diff](https://github.com/DanielXMoore/Civet/compare/v0.9.3...v0.9.4), [commits](https://github.com/DanielXMoore/Civet/commits/v0.9.4))
* Multiple items and spreads in array comprehensions [[#1656](https://github.com/DanielXMoore/Civet/pull/1656)]
* `for concat` reduction for concatenating arrays, `for first` reduction for finding elements [[#1657](https://github.com/DanielXMoore/Civet/pull/1657)]
* `for` reduction fixes: `each` supports implicit body, `for*` is an error [[#1661](https://github.com/DanielXMoore/Civet/pull/1661)]
* Fix top-level `await`/`yield` in `iife` mode (including REPL and Playground) [[#1662](https://github.com/DanielXMoore/Civet/pull/1662)]
* Pattern `name^: value` binds `name`, while `name: value` never does (except for identifiers) [[#1663](https://github.com/DanielXMoore/Civet/pull/1663)]
  * BREAKING CHANGE: Pattern matching with `{name: literal}` no longer binds `name`; use `{name^: literal}` to bind.
* Parallel testing via `CIVET_THREADS` (Mocha's `--parallel`) [[#1665](https://github.com/DanielXMoore/Civet/pull/1665)]
* Range literal improvements: faster, fix doubly strict [[#1664](https://github.com/DanielXMoore/Civet/pull/1664)]
* Worker threads fixes and SourceMap revamp [[#1666](https://github.com/DanielXMoore/Civet/pull/1666)]
  * BREAKING CHANGE: Must update VSCode plugin to 0.3.27 and eslint plugin to 0.0.6

## 0.9.3 (2024-12-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.9.2...v0.9.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.9.3))
* `coffeeClasses` improved compatibility: private static class fields via `=`, bound methods via `=>` , `constructor` shouldn't `return` [[#1650](https://github.com/DanielXMoore/Civet/pull/1650)]
* Pin parameter `^p` assigns function parameter to outer variable [[#1651](https://github.com/DanielXMoore/Civet/pull/1651)]
* List of ASCII symbols in cheatsheet [[#1653](https://github.com/DanielXMoore/Civet/pull/1653)]
* `let x?` allows initial `undefined` value + type inference; `let x? = y` for simple `y` [[#1654](https://github.com/DanielXMoore/Civet/pull/1654)]
* Extension bug fix for unplugin on webpack; cleanup old bug workarounds [[#1655](https://github.com/DanielXMoore/Civet/pull/1655)]

## 0.9.2 (2024-12-18, [diff](https://github.com/DanielXMoore/Civet/compare/v0.9.1...v0.9.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.9.2))
* Non-end rest parameters support types [[#1648](https://github.com/DanielXMoore/Civet/pull/1648)]
* Multithreaded compilation via Node workers and `threads` option or `CIVET_THREADS` environment variable; enable Node compiler cache; improve unplugin caching [[#1646](https://github.com/DanielXMoore/Civet/pull/1646)]

## 0.9.1 (2024-12-12, [diff](https://github.com/DanielXMoore/Civet/compare/v0.9.0...v0.9.1), [commits](https://github.com/DanielXMoore/Civet/commits/v0.9.1))
* Fat pipe `||>` uses semicolons at statement level [[#1636](https://github.com/DanielXMoore/Civet/pull/1636)]
* Fix parser crash on blocks inside `switch` [[#1640](https://github.com/DanielXMoore/Civet/pull/1640)]
* `:label` supports Civet reserved words (but not JS reserved words) [[#1641](https://github.com/DanielXMoore/Civet/pull/1641)]
* `break/continue loop/while/until/for/do` refer to anonymous containing iteration [[#1642](https://github.com/DanielXMoore/Civet/pull/1642)]
* Update unplugin to v2.1.0 [[#1643](https://github.com/DanielXMoore/Civet/pull/1643)]

## 0.9.0 (2024-12-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.17...v0.9.0), [commits](https://github.com/DanielXMoore/Civet/commits/v0.9.0))
* Range literal `[a..b]` defaults to increasing; adaptive behavior behind `"civet coffeeRange"` directive [[#1632](https://github.com/DanielXMoore/Civet/pull/1632)]
  * BREAKING CHANGE: `[a..b]` and `[a...b]` no longer creates a decreasing range without an explicit `>` or `>=`; add one where needed.
* `"""` interpolations require `coffeeInterpolation`, `///` respects `coffeeInterpolation`, `coffeeComment`, `coffeeDiv` [[#1635](https://github.com/DanielXMoore/Civet/pull/1635)]
  * BREAKING CHANGE: `"""` and `///` no longer support `#{expr}` interpolation unless you set `coffeeInterpolation`; `///` no longer supports `#` comments without `coffeeComment`; `///` no longer supports `//` comments with `coffeeDiv`

## 0.8.17 (2024-12-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.16...v0.8.17), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.17))
* `%%` operator types support `bigint` in addition to `number` [[#1620](https://github.com/DanielXMoore/Civet/pull/1620)]
* Fix `new` expression at start of pipeline [[#1625](https://github.com/DanielXMoore/Civet/pull/1625)]
* Fix implicit `async` and `*` in methods [[#1627](https://github.com/DanielXMoore/Civet/pull/1627)]
* Fix object literals and bulleted lists in JSX indented attributes, fix indentation detection [[#1628](https://github.com/DanielXMoore/Civet/pull/1628)]
* Fix placeholders in `for each` loops [[#1630](https://github.com/DanielXMoore/Civet/pull/1630)]
* Fix implicit objects in indented arguments after other arguments [[#1629](https://github.com/DanielXMoore/Civet/pull/1629)]
* Fix mixing access modifiers (e.g. `readonly`) with `@` arguments in constructors [[#1631](https://github.com/DanielXMoore/Civet/pull/1631)]

## 0.8.16 (2024-11-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.15...v0.8.16), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.16))
* `for join` reduction to concatenate strings [[#1604](https://github.com/DanielXMoore/Civet/pull/1604)]
* Numeric object keys in pattern matching [[#1608](https://github.com/DanielXMoore/Civet/pull/1608)]
* Fix trailing member/call behavior [[#1609](https://github.com/DanielXMoore/Civet/pull/1609)]
* Fix complex property globs [[#1610](https://github.com/DanielXMoore/Civet/pull/1610)]
* Allow postfix in indented `if` conditions [[#1612](https://github.com/DanielXMoore/Civet/pull/1612)]
* `for` reduction implicit body can destructure, fix implicitly returned patterns in some cases [[#1613](https://github.com/DanielXMoore/Civet/pull/1613)]
* Fix fallthrough in implicitly returned switch with semicolon, improve `hasExit` heuristic [[#1615](https://github.com/DanielXMoore/Civet/pull/1615)]
* Type postfix `?` and `!` work in long postfix sequence [[#1617](https://github.com/DanielXMoore/Civet/pull/1617)]
* Playground shows IIFE failures only when clicking Run [[#1618](https://github.com/DanielXMoore/Civet/pull/1618)]
* Fix automatic `Promise` wrapping of async return types [[#1619](https://github.com/DanielXMoore/Civet/pull/1619)]

## 0.8.15 (2024-11-12, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.14...v0.8.15), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.15))
* Fix typo in Coffeescript comparison [[#1589](https://github.com/DanielXMoore/Civet/pull/1589)]
* Fix range `for` loop with complex left-hand side [[#1592](https://github.com/DanielXMoore/Civet/pull/1592)]
* Type's postfix `if` must be on the same line [[#1591](https://github.com/DanielXMoore/Civet/pull/1591)]
* Fix missing parentheses in one-line `if` condition [[#1595](https://github.com/DanielXMoore/Civet/pull/1595)]
* LSP: fix autocompletion details error message [[#1596](https://github.com/DanielXMoore/Civet/pull/1596)]
* Fix reduction inside conditions, and other subtle aliasing issues [[#1598](https://github.com/DanielXMoore/Civet/pull/1598)]
* Track indentation of trailing member/call expressions [[#1599](https://github.com/DanielXMoore/Civet/pull/1599)]
  * BREAKING CHANGE: A chain of trailing member accesses must now be consistently indented.

## 0.8.14 (2024-11-07, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.13...v0.8.14), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.14))
* Syntax highlighting: fix leading `_` being treated as a number [[#1578](https://github.com/DanielXMoore/Civet/pull/1578)]
* Scientific numeric literals take priority over access [[#1579](https://github.com/DanielXMoore/Civet/pull/1579)]
* Fix parenthesized `⧺` and `—` shorthands for `++` and `--` [[#1584](https://github.com/DanielXMoore/Civet/pull/1584)]
* Fix wrapping of braced objects in parentheses [[#1585](https://github.com/DanielXMoore/Civet/pull/1585)]
* Object comprehensions via loops in braces [[#1563](https://github.com/DanielXMoore/Civet/pull/1563)]

## 0.8.13 (2024-11-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.12...v0.8.13), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.13))
* Playground copy button for large text fragments [[#1569](https://github.com/DanielXMoore/Civet/pull/1569)]
* Fix unplugin `typecheck`: source mapping and `rewriteCivetImports` combination [[#1571](https://github.com/DanielXMoore/Civet/pull/1571)]
* Playground buttons to copy input or output [[#1572](https://github.com/DanielXMoore/Civet/pull/1572)]
* Fix modulo access with placeholders: `x[& %]` [[#1573](https://github.com/DanielXMoore/Civet/pull/1573)]
* Fix parenthesized `&` followed by type postfix [[#1574](https://github.com/DanielXMoore/Civet/pull/1574)]
* Playground TypeScript toggle [[#1577](https://github.com/DanielXMoore/Civet/pull/1577)]
* Fix parenthesized `&` followed by binary op [[#1576](https://github.com/DanielXMoore/Civet/pull/1576)]
* Object and array literals via `{}` and `[]` followed by items [[#1575](https://github.com/DanielXMoore/Civet/pull/1575)]

## 0.8.12 (2024-11-03, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.11...v0.8.12), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.12))
* Fix REPL support for `ref`s created by Civet [[#1553](https://github.com/DanielXMoore/Civet/pull/1553)]
* `array[i%]` modulo index shorthand [[#1554](https://github.com/DanielXMoore/Civet/pull/1554)]
* Bun docs: improve getting started guidance [[#1555](https://github.com/DanielXMoore/Civet/pull/1555)]
* Avoid duplicate calls in relation chains and `@` bind shorthand via refs  [[#1556](https://github.com/DanielXMoore/Civet/pull/1556)]
* LSP completions show details and documentation [[#1561](https://github.com/DanielXMoore/Civet/pull/1561)]
* Fix `for key: T, value in` loop to define `value` using typed `key` [[#1564](https://github.com/DanielXMoore/Civet/pull/1564)]
* Lone `finally` block provides cleanup for rest of block [[#1566](https://github.com/DanielXMoore/Civet/pull/1566)]

## 0.8.11 (2024-10-30, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.10...v0.8.11), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.11))
* Placeholders lift through reverse slice operators [[#1537](https://github.com/DanielXMoore/Civet/pull/1537)]
* Playground `comptime` restarts playground worker and resets toggle after editing [[#1538](https://github.com/DanielXMoore/Civet/pull/1538)]
* "civet strict" directive to enable JS strict mode [[#1539](https://github.com/DanielXMoore/Civet/pull/1539)]
* Fix reverse slices handling of extreme indices, trailing member access [[#1545](https://github.com/DanielXMoore/Civet/pull/1545)]
* Fix `& &` disambiguation (placeholder vs. bitwise and) [[#1546](https://github.com/DanielXMoore/Civet/pull/1546)]
* Inequality slicing without `..`: `x[<i]` etc. [[#1547](https://github.com/DanielXMoore/Civet/pull/1547)]
* Allow multiple indented blocks of arguments in function call [[#1548](https://github.com/DanielXMoore/Civet/pull/1548)]
* Restart LSP when `package.json` or Civet config file changes [[#1544](https://github.com/DanielXMoore/Civet/pull/1544)]

## 0.8.10 (2024-10-28, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.9...v0.8.10), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.10))
* Fix `sum`/`count`/`each`/`own`/etc. as loop iteration variables [[#1531](https://github.com/DanielXMoore/Civet/pull/1531)]
* Fix parenthesized `for` expression without body [[#1532](https://github.com/DanielXMoore/Civet/pull/1532)]
* Ensure space after `for..of/in` [[#1533](https://github.com/DanielXMoore/Civet/pull/1533)]
* Fix `await` step vs. expression detection in pipeline [[#1535](https://github.com/DanielXMoore/Civet/pull/1535)]
* Fix `for` loops over `&` placeholder [[#1534](https://github.com/DanielXMoore/Civet/pull/1534)]
* Check for valid left-hand sides, forbidding lone placeholder [[#1536](https://github.com/DanielXMoore/Civet/pull/1536)]

## 0.8.9 (2024-10-27, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.8...v0.8.9), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.9))
* Range loops can provide custom skip via `by` (not just in CoffeeScript) [[#1505](https://github.com/DanielXMoore/Civet/pull/1505)]
* LSP completions and hover info up-to-date instead of lagging [[#1500](https://github.com/DanielXMoore/Civet/pull/1500)]
* Fix LSP by dropping `triggerCharacters` which requires fault-tolerant compile [[#1512](https://github.com/DanielXMoore/Civet/pull/1512)]
* Fix LSP: `resolve` of `WithResolver` doesn't return a `Promise` [[#1514](https://github.com/DanielXMoore/Civet/pull/1514)]
* `for some/every/count/sum/product/min/max` reduction loops, empty for loop default behavior, fix unwrapping multiple loops in a row [[#1509](https://github.com/DanielXMoore/Civet/pull/1509)]
* Allow `|> throw` [[#1517](https://github.com/DanielXMoore/Civet/pull/1517)]
* Multiple generator loops at top level, unwrap top-level iterations, fix implicit loop bodies [[#1518](https://github.com/DanielXMoore/Civet/pull/1518)]
* `T?` type shorthand in named tuple elements [[#1521](https://github.com/DanielXMoore/Civet/pull/1521)]
* `:"symbol name"` symbol shorthand with quotes [[#1522](https://github.com/DanielXMoore/Civet/pull/1522)]
* `await`/`throw` with placeholders in pipeline, trailing `|> throw` makes statement without IIFE [[#1520](https://github.com/DanielXMoore/Civet/pull/1520)]
* `async` functions and arrow types auto-wrap return type in `Promise` [[#1523](https://github.com/DanielXMoore/Civet/pull/1523)]
* Fix typing of `return.value` in `async` function [[#1524](https://github.com/DanielXMoore/Civet/pull/1524)]

## 0.8.8 (2024-10-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.7...v0.8.8), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.8))
* `:symbol` shorthand for `Symbol.symbol` or `Symbol.for("symbol")` [[#1498](https://github.com/DanielXMoore/Civet/pull/1498)]
* preventExtensions on comptime functions [[#1494](https://github.com/DanielXMoore/Civet/pull/1494)]
* Fix unplugin's webpack mode: `resolve.alias`, virtual modules [[#1501](https://github.com/DanielXMoore/Civet/pull/1501)]
* `for` loops can filter via `when` conditions (not just in CoffeeScript mode) [[#1502](https://github.com/DanielXMoore/Civet/pull/1502)]

## 0.8.7 (2024-10-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.6...v0.8.7), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.7))
* Fix one-line arrow functions with `@` arguments [[#1490](https://github.com/DanielXMoore/Civet/pull/1490)]
* Fix `Promise<void>` detection with implicit type arguments [[#1491](https://github.com/DanielXMoore/Civet/pull/1491)]
* Fix await with array member expression [[#1492](https://github.com/DanielXMoore/Civet/pull/1492)]

## 0.8.6 (2024-10-21, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.5...v0.8.6), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.6))
* Fix CLI with complex `NODE_OPTIONS`, LSP cleanup [[#1482](https://github.com/DanielXMoore/Civet/pull/1482)]
* `if` conditions continued by binary op on next line [[#1483](https://github.com/DanielXMoore/Civet/pull/1483)]
* `from ... import/export` (reversed `import`/`export`) [[#1484](https://github.com/DanielXMoore/Civet/pull/1484)]

## 0.8.5 (2024-10-21, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.4...v0.8.5), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.5))
* Reverse slices and inequality slices with implicit parts [[#1478](https://github.com/DanielXMoore/Civet/pull/1478)]
* Indented types after binary type operators [[#1479](https://github.com/DanielXMoore/Civet/pull/1479)]
* Pattern matching `catch` [[#1477](https://github.com/DanielXMoore/Civet/pull/1477)]

## 0.8.4 (2024-10-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.3...v0.8.4), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.4))
* Improve project root detection in LSP [[#1470](https://github.com/DanielXMoore/Civet/pull/1470)]
* Loops followed by binary operators, `as` on next line [[#1472](https://github.com/DanielXMoore/Civet/pull/1472)]
* Fix bracing in implicitly returned one-line for loops [[#1474](https://github.com/DanielXMoore/Civet/pull/1474)]
* Fix automatic private fields from constructor `@args` [[#1475](https://github.com/DanielXMoore/Civet/pull/1475)]
* Ranges and slices with inequalities such as `[a<..<b]` [[#1476](https://github.com/DanielXMoore/Civet/pull/1476)]

## 0.8.3 (2024-10-15, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.2...v0.8.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.3))
* Automatically type fields using `@arg` in constructor [[#1469](https://github.com/DanielXMoore/Civet/pull/1469)]

## 0.8.2 (2024-10-14, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.1...v0.8.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.2))
* Compiler directives `iife` and `repl` for wrapping program, fix `comptime` implicitly returned from function [[#1463](https://github.com/DanielXMoore/Civet/pull/1463)]
* `repl` directive hoists function and class declarations too, fix one-line declarations in `if` [[#1466](https://github.com/DanielXMoore/Civet/pull/1466)]
* One-line braced blocks with single-line statements [[#1467](https://github.com/DanielXMoore/Civet/pull/1467)]
* Forbid next-line braced blocks after `return if` and `yield if` [[#1468](https://github.com/DanielXMoore/Civet/pull/1468)]

## 0.8.1 (2024-10-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.8.0...v0.8.1), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.1))
* Fix `catch` type annotation by forbidding indented type arguments in `catch` [[#1446](https://github.com/DanielXMoore/Civet/pull/1446)]
* Require parentheses in complex `&` type annotation [[#1447](https://github.com/DanielXMoore/Civet/pull/1447)]
  * BREAKING CHANGE: `&: number | string` is now treated as `(&: number) | string`, and `&: T ? a : b` is consistently treated as `(&: T) ? a : b`
* CLI exposes top-level declarations with top-level `await` [[#1448](https://github.com/DanielXMoore/Civet/pull/1448)]
* `.d.ts` matches output extension in CLI; `declarationExtension` option in unplugin [[#1451](https://github.com/DanielXMoore/Civet/pull/1451)]
* Fix CLI executing ESM code from stdin or `-e` [[#1454](https://github.com/DanielXMoore/Civet/pull/1454)]
* CLI REPL supports (strips) TypeScript [[#1453](https://github.com/DanielXMoore/Civet/pull/1453)]
* Variance annotations (`in`/`out`) in type parameters [[#1459](https://github.com/DanielXMoore/Civet/pull/1459)]
* Allow pipes etc. in explicit function arguments [[#1460](https://github.com/DanielXMoore/Civet/pull/1460)]
* Pipeline doesn't unwrap in multi-`&` function shorthand [[#1462](https://github.com/DanielXMoore/Civet/pull/1462)]
* Add missing parentheses with `++` concat operator [[#1461](https://github.com/DanielXMoore/Civet/pull/1461)]

## 0.8.0 (2024-10-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.36...v0.8.0), [commits](https://github.com/DanielXMoore/Civet/commits/v0.8.0))
* Assigned expressionized statement followed by pipe, grammar cleanup [[#1442](https://github.com/DanielXMoore/Civet/pull/1442)]
* `yield` in `do` yields in parent in all cases [[#1443](https://github.com/DanielXMoore/Civet/pull/1443)]
* Nested function arguments support trailing member access/call [[#1444](https://github.com/DanielXMoore/Civet/pull/1444)]
  * BREAKING CHANGE: Nested argument using `.` function shorthand should now use `&.` to avoid being treated as a trailing member access

## 0.7.36 (2024-10-09, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.35...v0.7.36), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.36))
* Binary operators continue arguments only if strictly indented [[#1438](https://github.com/DanielXMoore/Civet/pull/1438)]
* Forbid pipes in non-nested implicit arguments [[#1441](https://github.com/DanielXMoore/Civet/pull/1441)]

## 0.7.35 (2024-10-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.34...v0.7.35), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.35))
* Stop implicitly returning final value from generators [[#1430](https://github.com/DanielXMoore/Civet/pull/1430)]
* Prevent stray `await` on one line from pipeline expansion [[#1431](https://github.com/DanielXMoore/Civet/pull/1431)]
* `T!` type shorthand for `NonNullable<T>` [[#1434](https://github.com/DanielXMoore/Civet/pull/1434)]
* `await` with indented argument, or multiple arguments as array [[#1433](https://github.com/DanielXMoore/Civet/pull/1433)]
* Typed `for` loops generate valid TypeScript [[#1435](https://github.com/DanielXMoore/Civet/pull/1435)]
* `await` with array literal awaits the items [[#1437](https://github.com/DanielXMoore/Civet/pull/1437)]
* CoffeeScript `do` allows unary operators beforehand, and handles nested body better [[#1436](https://github.com/DanielXMoore/Civet/pull/1436)]

## 0.7.34 (2024-10-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.33...v0.7.34), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.34))
* Use new Civet icon in VSCode extension [[#1420](https://github.com/DanielXMoore/Civet/pull/1420)]
* `"civet globals"` directive to prevent some auto declarations [[#1423](https://github.com/DanielXMoore/Civet/pull/1423)]
* Fix arrow type with `?` postfix [[#1425](https://github.com/DanielXMoore/Civet/pull/1425)]
* Enable `worker.civet?worker` import in Vite [[#1426](https://github.com/DanielXMoore/Civet/pull/1426)]
* Fix missing semicolon in if/unless followed by else [[#1428](https://github.com/DanielXMoore/Civet/pull/1428)]
* Support `export default` in `declare` blocks [[#1427](https://github.com/DanielXMoore/Civet/pull/1427)]

## 0.7.33 (2024-10-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.32...v0.7.33), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.33))
* VSCode plugin ignores CoffeeScript files [[#1409](https://github.com/DanielXMoore/Civet/pull/1409)]
* Add syntax highlighting support for /d, /s and /v RegExp flags [[#1413](https://github.com/DanielXMoore/Civet/pull/1413)]
* Make `autoVar` skip `declare`d variables [[#1419](https://github.com/DanielXMoore/Civet/pull/1419)]
* Add missing parens in `unless` declaration condition [[#1414](https://github.com/DanielXMoore/Civet/pull/1414)]
* Type specification in `for..of/in` loops [[#1418](https://github.com/DanielXMoore/Civet/pull/1418)]
* Fix implicit empty body for exported functions [[#1417](https://github.com/DanielXMoore/Civet/pull/1417)]
* Fix typed patterns in arrow function with unparenthesized parameter [[#1416](https://github.com/DanielXMoore/Civet/pull/1416)]

## 0.7.32 (2024-10-03, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.31...v0.7.32), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.32))
* Document how to use Civet Web Workers in Vite [[#1403](https://github.com/DanielXMoore/Civet/pull/1403)]
* change types order in package.json exports; default config exports [[#1405](https://github.com/DanielXMoore/Civet/pull/1405)]

## 0.7.31 (2024-09-18, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.30...v0.7.31), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.31))
* `--trace` fixes and documentation, cleanup of `getStateKey` [[#1399](https://github.com/DanielXMoore/Civet/pull/1399)]
* Run `<script type="text/civet">` in browser build [[#1400](https://github.com/DanielXMoore/Civet/pull/1400)]

## 0.7.30 (2024-09-15, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.29...v0.7.30), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.30))
* Fix `!` negated indented argument in function call [[#1393](https://github.com/DanielXMoore/Civet/pull/1393)]
* `break with` and `continue with` for modifying results array in a loop [[#1396](https://github.com/DanielXMoore/Civet/pull/1396)]
* `break/continue [label] with` and better error handling [[#1397](https://github.com/DanielXMoore/Civet/pull/1397)]
* `for*`, `loop*`, `while*`, `do*` generator expressions [[#1398](https://github.com/DanielXMoore/Civet/pull/1398)]

## 0.7.29 (2024-09-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.28...v0.7.29), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.29))
* Lexical declarations as JSX code children [[#1387](https://github.com/DanielXMoore/Civet/pull/1387)]
* Postfix `if`/`unless` in type declaration [[#1388](https://github.com/DanielXMoore/Civet/pull/1388)]
* Add changelog to eslint plugin [[#1389](https://github.com/DanielXMoore/Civet/pull/1389)]
* Improve indentation handling with union/intersection types [[#1390](https://github.com/DanielXMoore/Civet/pull/1390)]
* Remove final implicit comma in nested arguments, better matching source [[#1392](https://github.com/DanielXMoore/Civet/pull/1392)]
* Implicit type arguments, bulleted type tuples, multiple items in indented tuples [[#1391](https://github.com/DanielXMoore/Civet/pull/1391)]

## 0.7.28 (2024-08-30, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.27...v0.7.28), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.28))
* Fix pattern matching with indented object patterns [[#1384](https://github.com/DanielXMoore/Civet/pull/1384)]
* `"civet jsxCode"` directive treats JSX children as Civet code [[#1386](https://github.com/DanielXMoore/Civet/pull/1386)]

## 0.7.27 (2024-08-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.26...v0.7.27), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.27))
* Add `repository` to `package.json`, fixing Dependabot changelog detection [[#1380](https://github.com/DanielXMoore/Civet/pull/1380)]
* Fix glob accessor `.{a,b}` shorthand for `&.{a,b}` [[#1379](https://github.com/DanielXMoore/Civet/pull/1379)]
* Typing of object/array pattern components via `::` [[#1383](https://github.com/DanielXMoore/Civet/pull/1383)]
* JSX attributes with unbraced indented values, code children with `>` [[#1381](https://github.com/DanielXMoore/Civet/pull/1381)]

## 0.7.26 (2024-08-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.25...v0.7.26), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.26))
* Hyphenated object keys like `Content-Type:` [[#1377](https://github.com/DanielXMoore/Civet/pull/1377)]
* Fix unplugin `parseOptions`, fix eslint plugin for Node 22 [[#1378](https://github.com/DanielXMoore/Civet/pull/1378)]

## 0.7.25 (2024-08-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.24...v0.7.25), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.25))
* `import operator` bulk import of operators [[#1372](https://github.com/DanielXMoore/Civet/pull/1372)]
* `continue switch` to fall through at the end of `when` clause [[#1373](https://github.com/DanielXMoore/Civet/pull/1373)]
* Remove Svelte label `$:` exception (use `:$` if needed) [[#1374](https://github.com/DanielXMoore/Civet/pull/1374)]
* Expressionize statements followed by trailing member access/call or pipe [[#1375](https://github.com/DanielXMoore/Civet/pull/1375)]
* Include changelog in NPM release [[#1376](https://github.com/DanielXMoore/Civet/pull/1376)]

## 0.7.24 (2024-08-19, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.23...v0.7.24), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.24))
* Fix placeholder expressions at head of pipeline [[#1366](https://github.com/DanielXMoore/Civet/pull/1366)]
* Support length shorthand `#` when defining objects [[#1367](https://github.com/DanielXMoore/Civet/pull/1367)]
* Generate tags for Civet releases [[#1368](https://github.com/DanielXMoore/Civet/pull/1368)]
* Indented `if`/`unless` conditions to enable indented function calls (e.g. `(and)`) [[#1364](https://github.com/DanielXMoore/Civet/pull/1364)]
* Indented calls in `if` conditions with explicit `then` clause (#1090) [[#1369](https://github.com/DanielXMoore/Civet/pull/1369)]
* Improved release process and changelog generation [[#1370](https://github.com/DanielXMoore/Civet/pull/1370)]

## 0.7.23 (2024-08-15, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.22...v0.7.23), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.23))
* Optional dot in `?.` and `!.` property access: `x?y` and `x!y` [[#1352](https://github.com/DanielXMoore/Civet/pull/1352)]
* Changelog generation: fetch PRs mostly in parallel [[#1353](https://github.com/DanielXMoore/Civet/pull/1353)]
* Allow empty `interface` and `namespace` blocks [[#1356](https://github.com/DanielXMoore/Civet/pull/1356)]
* Add missing parens in ampersand functions starting with object literal [[#1357](https://github.com/DanielXMoore/Civet/pull/1357)]
* Changelog: Add version dates and diff/commit links, add PR links [[#1358](https://github.com/DanielXMoore/Civet/pull/1358)]
* Document how to use with React Native / Metro bundler [[#1359](https://github.com/DanielXMoore/Civet/pull/1359)]
* Fix arrow being treated as assignment in tight arrow functions [[#1360](https://github.com/DanielXMoore/Civet/pull/1360)]
* Fix esbuild unplugin sourcemap bug [[#1362](https://github.com/DanielXMoore/Civet/pull/1362)]
* Bulleted arrays with `.` or `•` [[#1361](https://github.com/DanielXMoore/Civet/pull/1361)]

## 0.7.22 (2024-08-09, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.21...v0.7.22), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.22))
* Add CommonJS build of Babel plugin, enabling React Native support [[#1351](https://github.com/DanielXMoore/Civet/pull/1351)]
* Automatic changelog creation [[#1350](https://github.com/DanielXMoore/Civet/pull/1350)]

## 0.7.21 (2024-08-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.20...v0.7.21), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.21))
* Fix `..` slice operator precedence [[#1332](https://github.com/DanielXMoore/Civet/pull/1332)]
* Fix `&&` chain precedence with bitwise `&`/`|`/`^` [[#1334](https://github.com/DanielXMoore/Civet/pull/1334)]
* Assignment operators for div and mod [[#1338](https://github.com/DanielXMoore/Civet/pull/1338)]
* Nested return type annotation [[#1340](https://github.com/DanielXMoore/Civet/pull/1340)]
* Fix relational chains involving `!=` [[#1346](https://github.com/DanielXMoore/Civet/pull/1346)]
* Add missing Unicode assignment operators [[#1347](https://github.com/DanielXMoore/Civet/pull/1347)]
* Fix CLI for globally installed Civet [[#1348](https://github.com/DanielXMoore/Civet/pull/1348)]
* CLI `-e`/`--eval` option for running/compiling a string [[#1349](https://github.com/DanielXMoore/Civet/pull/1349)]

## 0.7.20 (2024-08-03, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.19...v0.7.20), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.20))
* Fix whitespace in snug `<?` instanceof shorthand [[#1329](https://github.com/DanielXMoore/Civet/pull/1329)]
* Add `%/`/`÷` integer division, fix `%%` precedence [[#1331](https://github.com/DanielXMoore/Civet/pull/1331)]

## 0.7.19 (2024-07-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.18...v0.7.19), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.19))
* Prevent BinaryOp function shorthand from shadowing arrow functions. [[#1317](https://github.com/DanielXMoore/Civet/pull/1317)]
* Use register to avoid experimental loaders deprecation warning [[#1324](https://github.com/DanielXMoore/Civet/pull/1324)]
* Support for `unique symbol` type in TS [[#1323](https://github.com/DanielXMoore/Civet/pull/1323)]

## 0.7.18 (2024-07-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.17...v0.7.18), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.18))
* Jest integration [[#1313](https://github.com/DanielXMoore/Civet/pull/1313)]
* Hoist array binding and rest ref declarations. Fixes #1139. Fixes #1312 [[#1314](https://github.com/DanielXMoore/Civet/pull/1314)]

## 0.7.17 (2024-07-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.16...v0.7.17), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.17))
* Move unplugin and build using Civet instead of tsup [[#1306](https://github.com/DanielXMoore/Civet/pull/1306)]
* CLI tests [[#1308](https://github.com/DanielXMoore/Civet/pull/1308)]
* Fix import looking like multiplication [[#1310](https://github.com/DanielXMoore/Civet/pull/1310)]
* Fix indented chained ternaries [[#1311](https://github.com/DanielXMoore/Civet/pull/1311)]

## 0.7.16 (2024-07-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.15...v0.7.16), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.16))
* Fix pipe mode in CLI [[#1305](https://github.com/DanielXMoore/Civet/pull/1305)]

## 0.7.15 (2024-07-03, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.14...v0.7.15), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.15))
* More CLI/typechecking fixes: `civetconfig` extensions, `@types` support, `includes`/`excludes`/`files` support, typechecking without filename list [[#1304](https://github.com/DanielXMoore/Civet/pull/1304)]

## 0.7.14 (2024-07-01, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.13...v0.7.14), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.14))
* Fix some TS errors and increase code coverage [[#1283](https://github.com/DanielXMoore/Civet/pull/1283)]
* Fix extension for CLI's `--typecheck` [[#1297](https://github.com/DanielXMoore/Civet/pull/1297)]
* Fix `if` types [[#1298](https://github.com/DanielXMoore/Civet/pull/1298)]
* Add `class with A, B` mixin notation [[#1299](https://github.com/DanielXMoore/Civet/pull/1299)]
* Allow `civetConfig` in `package.`[`json`|`yaml`] [[#1300](https://github.com/DanielXMoore/Civet/pull/1300)]
* Typecheck fixes: JSX default, `tsconfig` errors, `imports` field [[#1302](https://github.com/DanielXMoore/Civet/pull/1302)]

## 0.7.13 (2024-06-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.12...v0.7.13), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.13))
* Binary op fixes [[#1282](https://github.com/DanielXMoore/Civet/pull/1282)]
* Fix argument parsing [[#1293](https://github.com/DanielXMoore/Civet/pull/1293)]
* Cleanup Bun loader code [[#1291](https://github.com/DanielXMoore/Civet/pull/1291)]
* Self-test to check Civet can build itself [[#1292](https://github.com/DanielXMoore/Civet/pull/1292)]
* Upgrade TypeScript to 5.5 [[#1294](https://github.com/DanielXMoore/Civet/pull/1294)]
* MaybeNested expressions [[#1295](https://github.com/DanielXMoore/Civet/pull/1295)]

## 0.7.12 (2024-06-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.11...v0.7.12), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.12))
* Pipe to dynamic import [[#1275](https://github.com/DanielXMoore/Civet/pull/1275)]
* Added a cache based on mtime for watch/serve mode in esbuild [[#1276](https://github.com/DanielXMoore/Civet/pull/1276)]
* Fix async detection in a few cases [[#1278](https://github.com/DanielXMoore/Civet/pull/1278)]
* Replacing some instances of __ with stricter whitespace checking [[#1279](https://github.com/DanielXMoore/Civet/pull/1279)]

## 0.7.11 (2024-05-27, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.10...v0.7.11), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.11))
* Fix source-map-support import with new NodeJS register [[#1265](https://github.com/DanielXMoore/Civet/pull/1265)]
* Update Civet and use try..else feature [[#1266](https://github.com/DanielXMoore/Civet/pull/1266)]
* Fix empty block in pattern matching with implicit return [[#1268](https://github.com/DanielXMoore/Civet/pull/1268)]
* Fix empty then clause in if expressions [[#1269](https://github.com/DanielXMoore/Civet/pull/1269)]
* Fix hoistDec within if expression [[#1270](https://github.com/DanielXMoore/Civet/pull/1270)]
* Revamp automatic async and generator, operator support [[#1271](https://github.com/DanielXMoore/Civet/pull/1271)]
* Sourcemap fix, show diagnostics with nonfatal parse errors [[#1272](https://github.com/DanielXMoore/Civet/pull/1272)]

## 0.7.10 (2024-05-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.9...v0.7.10), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.10))
* Use {} for empty if and else blocks [[#1245](https://github.com/DanielXMoore/Civet/pull/1245)]
* Argument magic with `coffeeDo` [[#1246](https://github.com/DanielXMoore/Civet/pull/1246)]
* Fix source mapping for AtThis identifier (#1250) [[#1252](https://github.com/DanielXMoore/Civet/pull/1252)]
* Generous matching of --version, --help [[#1259](https://github.com/DanielXMoore/Civet/pull/1259)]
* Upgrade Playground to modern Prettier [[#1256](https://github.com/DanielXMoore/Civet/pull/1256)]
* Invalid command-line argument handling [[#1257](https://github.com/DanielXMoore/Civet/pull/1257)]
* Fix ASI by handling tokens [[#1260](https://github.com/DanielXMoore/Civet/pull/1260)]
* Fix iteration expression unwrapping in splice assignment [[#1261](https://github.com/DanielXMoore/Civet/pull/1261)]
* Error nodes, ParseErrors get source-mapped location [[#1262](https://github.com/DanielXMoore/Civet/pull/1262)]
* Fix complex negative property access [[#1263](https://github.com/DanielXMoore/Civet/pull/1263)]

## 0.7.9 (2024-05-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.8...v0.7.9), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.9))
* Fix `.#x` [[#1237](https://github.com/DanielXMoore/Civet/pull/1237)]
* Config file and `parseOptions` support in unplugin, more config filenames, config docs [[#1243](https://github.com/DanielXMoore/Civet/pull/1243)]

## 0.7.8 (2024-05-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.7...v0.7.8), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.8))
* Allow EmptyStatement in ClassBody [[#1226](https://github.com/DanielXMoore/Civet/pull/1226)]
* Fix preprocessing of declaration conditions [[#1227](https://github.com/DanielXMoore/Civet/pull/1227)]
* `try ... else` blocks [[#1229](https://github.com/DanielXMoore/Civet/pull/1229)]
* Declaration inside unless/until adds declaration after block [[#1228](https://github.com/DanielXMoore/Civet/pull/1228)]
* Fix duplicate property merging for props not actually bound [[#1232](https://github.com/DanielXMoore/Civet/pull/1232)]
* Ampersand fixes [[#1233](https://github.com/DanielXMoore/Civet/pull/1233)]

## 0.7.7 (2024-05-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.6...v0.7.7), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.7))
* Avoid expressionizing statements in fat arrow functions [[#1221](https://github.com/DanielXMoore/Civet/pull/1221)]
* Use context's globals instead of serializing there [[#1220](https://github.com/DanielXMoore/Civet/pull/1220)]
* comptime else blocks, else refactor [[#1222](https://github.com/DanielXMoore/Civet/pull/1222)]

## 0.7.6 (2024-05-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.5...v0.7.6), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.6))
* Avoid implicit return when block guarantees exit [[#1211](https://github.com/DanielXMoore/Civet/pull/1211)]
* ESLint plugin [[#1205](https://github.com/DanielXMoore/Civet/pull/1205)]
* Duplicate helpers in comptime blocks [[#1212](https://github.com/DanielXMoore/Civet/pull/1212)]
* Better require error messages in comptime [[#1214](https://github.com/DanielXMoore/Civet/pull/1214)]
* CLI avoid errors when output pipe gets closed [[#1213](https://github.com/DanielXMoore/Civet/pull/1213)]
* Don't emit newlines before block prefixes [[#1216](https://github.com/DanielXMoore/Civet/pull/1216)]
* `throws` can specify exception; ParseErrors type; bug fixes [[#1217](https://github.com/DanielXMoore/Civet/pull/1217)]
* eslint: comptime for version, assert instead of with [[#1218](https://github.com/DanielXMoore/Civet/pull/1218)]
* More comptime [[#1219](https://github.com/DanielXMoore/Civet/pull/1219)]

## 0.7.5 (2024-05-03, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.4...v0.7.5), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.5))
* Use `is like` in some cases [[#1208](https://github.com/DanielXMoore/Civet/pull/1208)]
* Improve log feedback in VSCode plugin [[#1209](https://github.com/DanielXMoore/Civet/pull/1209)]
* Async compile API with `comptime`, support `require` in `comptime` [[#1186](https://github.com/DanielXMoore/Civet/pull/1186)]
* Add LSP warning about using dev Civet [[#1210](https://github.com/DanielXMoore/Civet/pull/1210)]

## 0.7.4 (2024-05-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.3...v0.7.4), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.4))
* Comptime fixes [[#1204](https://github.com/DanielXMoore/Civet/pull/1204)]
* Detect Error nodes in inlineMap mode [[#1207](https://github.com/DanielXMoore/Civet/pull/1207)]

## 0.7.3 (2024-05-01, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.2...v0.7.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.3))
* Fix handling of empty arrays and objects in patterns [[#1202](https://github.com/DanielXMoore/Civet/pull/1202)]
* `(is like ...)` section, document `is not like` [[#1203](https://github.com/DanielXMoore/Civet/pull/1203)]

## 0.7.2 (2024-04-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.1...v0.7.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.2))
* First version of comptime (synchronous, no outer scope) [[#1180](https://github.com/DanielXMoore/Civet/pull/1180)]
* Faster and robust config searching via `readdir` instead of `opendir` [[#1183](https://github.com/DanielXMoore/Civet/pull/1183)]
* Insert "function" into ES6 methods [[#1184](https://github.com/DanielXMoore/Civet/pull/1184)]
* Allow empty body in loops, if/else, do, comptime [[#1187](https://github.com/DanielXMoore/Civet/pull/1187)]
* Fix comptime negative zero [[#1190](https://github.com/DanielXMoore/Civet/pull/1190)]
* Serialize typed arrays and well-known symbols [[#1188](https://github.com/DanielXMoore/Civet/pull/1188)]
* Comptime `Object.create null` [[#1192](https://github.com/DanielXMoore/Civet/pull/1192)]
* Comptime classes and generators [[#1194](https://github.com/DanielXMoore/Civet/pull/1194)]
* Comptime function properties [[#1196](https://github.com/DanielXMoore/Civet/pull/1196)]
* Comptime URLs [[#1197](https://github.com/DanielXMoore/Civet/pull/1197)]
* Handle property descriptors (incl. getters/setters) in comptime [[#1198](https://github.com/DanielXMoore/Civet/pull/1198)]
* "is like" pattern matching operator [[#1199](https://github.com/DanielXMoore/Civet/pull/1199)]
* Optional ?:: for coffeePrototype [[#1193](https://github.com/DanielXMoore/Civet/pull/1193)]
* Pattern matching fixes [[#1200](https://github.com/DanielXMoore/Civet/pull/1200)]

## 0.7.1 (2024-04-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.7.0...v0.7.1), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.1))
* Assignment operator sections [[#1174](https://github.com/DanielXMoore/Civet/pull/1174)]
* Fix & in applied (operator) [[#1175](https://github.com/DanielXMoore/Civet/pull/1175)]
* Upgrade CI to Node.js 20 [[#1178](https://github.com/DanielXMoore/Civet/pull/1178)]
* Limit & to return/yield; support indented yield argument [[#1177](https://github.com/DanielXMoore/Civet/pull/1177)]
* Brace block improvements, including `&` statements [[#1179](https://github.com/DanielXMoore/Civet/pull/1179)]

## 0.7.0 (2024-04-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.93...v0.7.0), [commits](https://github.com/DanielXMoore/Civet/commits/v0.7.0))
* New ampersand proposal (#1070) [[#1159](https://github.com/DanielXMoore/Civet/pull/1159)]
  * BREAKING CHANGE: `&` now represents the identity function, while `(&)` is a two-argument function computing Boolean AND. `&` functions also get wrapped higher than before, allowing for growth on the left instead of just the right.

## 0.6.93 (2024-04-19, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.92...v0.6.93), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.93))
* Fix #1155 by consolidating trailing member access [[#1163](https://github.com/DanielXMoore/Civet/pull/1163)]
* Remove old experimental coffee2civet and add bun-civet to ignored coverage [[#1164](https://github.com/DanielXMoore/Civet/pull/1164)]
* `::#` type with `coffeePrototype` [[#1166](https://github.com/DanielXMoore/Civet/pull/1166)]
* Infinite loop detection and no return [[#1165](https://github.com/DanielXMoore/Civet/pull/1165)]
* Pipe assignment to index [[#1167](https://github.com/DanielXMoore/Civet/pull/1167)]
* Improve ASI algorithm [[#1170](https://github.com/DanielXMoore/Civet/pull/1170)]
* Keep `new` inside partial function [[#1171](https://github.com/DanielXMoore/Civet/pull/1171)]

## 0.6.92 (2024-04-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.91...v0.6.92), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.92))
* Simplify quoteString for code coverage [[#1156](https://github.com/DanielXMoore/Civet/pull/1156)]
* Fix unary negated literal with unary post [[#1154](https://github.com/DanielXMoore/Civet/pull/1154)]
* Preserve Vite's default extensions [[#1157](https://github.com/DanielXMoore/Civet/pull/1157)]

## 0.6.91 (2024-04-07, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.90...v0.6.91), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.91))
* Late arrow functions like late assignments [[#1142](https://github.com/DanielXMoore/Civet/pull/1142)]
* Fix ASI bug caused by unstructured blockPrefix [[#1143](https://github.com/DanielXMoore/Civet/pull/1143)]
* Add missing unary numeric and undefined pin patterns in `switch` (#1043) [[#1144](https://github.com/DanielXMoore/Civet/pull/1144)]
* Fix relational chains [[#1146](https://github.com/DanielXMoore/Civet/pull/1146)]
* Infinite range `[x..]` [[#1148](https://github.com/DanielXMoore/Civet/pull/1148)]
* Partial application placeholders [[#1151](https://github.com/DanielXMoore/Civet/pull/1151)]
* Astro integration based on Vite plugin [[#1153](https://github.com/DanielXMoore/Civet/pull/1153)]

## 0.6.90 (2024-04-03, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.89...v0.6.90), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.90))
* Don't treat double colon as colon [[#1136](https://github.com/DanielXMoore/Civet/pull/1136)]
* Optional dot before `#` [[#1137](https://github.com/DanielXMoore/Civet/pull/1137)]
* Prevent `...` as array element in right-hand side [[#1138](https://github.com/DanielXMoore/Civet/pull/1138)]
* Missing insert return after pattern matching statement [[#1141](https://github.com/DanielXMoore/Civet/pull/1141)]
* Nonnull checks in assignment conditions [[#1140](https://github.com/DanielXMoore/Civet/pull/1140)]

## 0.6.89 (2024-04-01, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.88...v0.6.89), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.89))
* Hoist declarations out of async wrapper and other cleanup [[#1133](https://github.com/DanielXMoore/Civet/pull/1133)]

## 0.6.88 (2024-03-31, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.87...v0.6.88), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.88))
* Modern NodeJS register and CLI require/import fixes [[#1128](https://github.com/DanielXMoore/Civet/pull/1128)]
* Dynamic import declarations and expressions [[#1130](https://github.com/DanielXMoore/Civet/pull/1130)]

## 0.6.87 (2024-03-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.86...v0.6.87), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.87))
* Signed number literal types, including dropping + [[#1119](https://github.com/DanielXMoore/Civet/pull/1119)]
* TS override support [[#1120](https://github.com/DanielXMoore/Civet/pull/1120)]
* Fix #54 - Optional chain in assignment lhs [[#1117](https://github.com/DanielXMoore/Civet/pull/1117)]

## 0.6.86 (2024-03-21, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.85...v0.6.86), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.86))
* Fix #1102 - negative index assignment lhs [[#1109](https://github.com/DanielXMoore/Civet/pull/1109)]
* Fix #1101 - reserved word object globs [[#1111](https://github.com/DanielXMoore/Civet/pull/1111)]

## 0.6.85 (2024-03-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.84...v0.6.85), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.85))
* Fix #1098 - if containing for IIFE [[#1103](https://github.com/DanielXMoore/Civet/pull/1103)]
* Fix #1096; Fix #1105; Special operators in assignment rhs [[#1106](https://github.com/DanielXMoore/Civet/pull/1106)]
* Fix #1100 - pipe inside StatementExpression [[#1104](https://github.com/DanielXMoore/Civet/pull/1104)]
* Fix #1107 - pipe to as in JS mode [[#1108](https://github.com/DanielXMoore/Civet/pull/1108)]

## 0.6.84 (2024-03-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.83...v0.6.84), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.84))
* Pattern matching array length type guard (#1075) [[#1089](https://github.com/DanielXMoore/Civet/pull/1089)]
* Fix `get #` (#1087) [[#1088](https://github.com/DanielXMoore/Civet/pull/1088)]
* `export from` type attributes (#1091) [[#1093](https://github.com/DanielXMoore/Civet/pull/1093)]
* RestoreAll within template substitution / CoffeeScript interpolation [[#1095](https://github.com/DanielXMoore/Civet/pull/1095)]
* For loop over character range (#1097) [[#1099](https://github.com/DanielXMoore/Civet/pull/1099)]

## 0.6.83 (2024-03-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.82...v0.6.83), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.83))
* Pipe to unary word ops; await ops (#1065) [[#1069](https://github.com/DanielXMoore/Civet/pull/1069)]
* Strings at start of file followed by pipe or access are not prologues [[#1068](https://github.com/DanielXMoore/Civet/pull/1068)]
* Sourcemap improvement [[#1067](https://github.com/DanielXMoore/Civet/pull/1067)]
* Semicolon before `return.value` when piping (#1048) [[#1071](https://github.com/DanielXMoore/Civet/pull/1071)]
* Added comment to forwardMap [[#1073](https://github.com/DanielXMoore/Civet/pull/1073)]
* Eliminate dead code [[#1072](https://github.com/DanielXMoore/Civet/pull/1072)]
* Don't wrap StatementExpressions in IIFE in declaration (#202) [[#1074](https://github.com/DanielXMoore/Civet/pull/1074)]
* Added support for nested statement expressions [[#1076](https://github.com/DanielXMoore/Civet/pull/1076)]
* Statement expressions [[#1077](https://github.com/DanielXMoore/Civet/pull/1077)]

## 0.6.82 (2024-02-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.81...v0.6.82), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.82))
* Improve forward source mapping, fix `if const` tooltips (#1053) [[#1059](https://github.com/DanielXMoore/Civet/pull/1059)]
* Fix Playground around top-level await [[#1060](https://github.com/DanielXMoore/Civet/pull/1060)]
* Fix `async` iteration expressions (#1058) caused by performance opt [[#1063](https://github.com/DanielXMoore/Civet/pull/1063)]
* Add `#` length shorthand #909 [[#1062](https://github.com/DanielXMoore/Civet/pull/1062)]
* Allow arguments to property bind [[#1064](https://github.com/DanielXMoore/Civet/pull/1064)]
* Add `as tuple` [[#1066](https://github.com/DanielXMoore/Civet/pull/1066)]

## 0.6.81 (2024-02-21, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.80...v0.6.81), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.81))
* Force emitting dts files in unplugin [[#1055](https://github.com/DanielXMoore/Civet/pull/1055)]
* Tell Vite virtual module during dependency scanning [[#1056](https://github.com/DanielXMoore/Civet/pull/1056)]

## 0.6.80 (2024-02-21, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.79...v0.6.80), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.80))
* Properly escape newlines in multi-line strings (#1047) [[#1049](https://github.com/DanielXMoore/Civet/pull/1049)]
* Typechecking allows for extra dependencies beyond build [[#1052](https://github.com/DanielXMoore/Civet/pull/1052)]
* Suppress ESLint `no-cond-assign` with `if const` etc [[#1051](https://github.com/DanielXMoore/Civet/pull/1051)]
* Add esbuild unplugin to Vite's optimizeDeps [[#1054](https://github.com/DanielXMoore/Civet/pull/1054)]

## 0.6.79 (2024-02-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.78...v0.6.79), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.79))
* Snapshots similar to how Vue language tools does [[#1042](https://github.com/DanielXMoore/Civet/pull/1042)]
* log diagnostics timing [[#1045](https://github.com/DanielXMoore/Civet/pull/1045)]
* Non-transpiled files weren't being added to the path map causing them… [[#1044](https://github.com/DanielXMoore/Civet/pull/1044)]
* Don't relativize paths in unplugin [[#1046](https://github.com/DanielXMoore/Civet/pull/1046)]

## 0.6.78 (2024-02-19, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.77...v0.6.78), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.78))
* Avoid double semicolon in then clause [[#1041](https://github.com/DanielXMoore/Civet/pull/1041)]

## 0.6.77 (2024-02-19, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.76...v0.6.77), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.77))
* ignore coverage for parser/types.civet [[#1032](https://github.com/DanielXMoore/Civet/pull/1032)]
* Working towards discriminated union for nodes and type predicates for traversal [[#1033](https://github.com/DanielXMoore/Civet/pull/1033)]
* Automatic TS jsx setting in unplugin and CLI [[#1039](https://github.com/DanielXMoore/Civet/pull/1039)]
* More custom operator precedence [[#1038](https://github.com/DanielXMoore/Civet/pull/1038)]

## 0.6.76 (2024-02-18, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.75...v0.6.76), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.76))
* Split lib.civet into many files [[#1026](https://github.com/DanielXMoore/Civet/pull/1026)]
* Fix CLI typecheck import mapping [[#1030](https://github.com/DanielXMoore/Civet/pull/1030)]
* xor precedence above || [[#1029](https://github.com/DanielXMoore/Civet/pull/1029)]
* Custom operator precedence [[#1031](https://github.com/DanielXMoore/Civet/pull/1031)]

## 0.6.75 (2024-02-18, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.74...v0.6.75), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.75))
* Typechecking CLI [[#1023](https://github.com/DanielXMoore/Civet/pull/1023)]
* Fix #900 - Declaration condition in switch statements w/ nested binop [[#1024](https://github.com/DanielXMoore/Civet/pull/1024)]
* Made some more progress on internal typings [[#1025](https://github.com/DanielXMoore/Civet/pull/1025)]
* Cleanup non-null assertion handling [[#1027](https://github.com/DanielXMoore/Civet/pull/1027)]

## 0.6.74 (2024-02-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.73...v0.6.74), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.74))
* Pipe new [[#1008](https://github.com/DanielXMoore/Civet/pull/1008)]
* Fix #947 - Better const function semantics [[#1009](https://github.com/DanielXMoore/Civet/pull/1009)]
* Fix hasProp type [[#1011](https://github.com/DanielXMoore/Civet/pull/1011)]
* Unary prefix and postfix in braced literal shorthand [[#1014](https://github.com/DanielXMoore/Civet/pull/1014)]
* Support extends shorthand in type parameters [[#1015](https://github.com/DanielXMoore/Civet/pull/1015)]
* Add type assignment shorthand [[#1018](https://github.com/DanielXMoore/Civet/pull/1018)]
* Recognize indentation of type alias [[#1019](https://github.com/DanielXMoore/Civet/pull/1019)]
* Fix #1002 - Allow postfix loops, etc. in declarations [[#1017](https://github.com/DanielXMoore/Civet/pull/1017)]
* Fix #998 - Properly handle void async generators and iterators [[#1020](https://github.com/DanielXMoore/Civet/pull/1020)]
* Fix #959 - Don't duplicate comments when hoisting refs [[#1022](https://github.com/DanielXMoore/Civet/pull/1022)]

## 0.6.73 (2024-02-15, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.72...v0.6.73), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.73))
* Fix triple slash in pattern matching switch [[#991](https://github.com/DanielXMoore/Civet/pull/991)]
* Report error nodes in LSP [[#992](https://github.com/DanielXMoore/Civet/pull/992)]
* Update code around pattern matching to civet style [[#993](https://github.com/DanielXMoore/Civet/pull/993)]
* Consistent arrow vs. pipe precedence [[#994](https://github.com/DanielXMoore/Civet/pull/994)]
* Avoid implicit returns from fat arrows [[#996](https://github.com/DanielXMoore/Civet/pull/996)]
* Allow multiple props per line in implicit object literals [[#997](https://github.com/DanielXMoore/Civet/pull/997)]
* Don't create empty var decs with auto-var [[#1000](https://github.com/DanielXMoore/Civet/pull/1000)]
* Fix cached node mutation when removing trailing comma from rest property [[#1001](https://github.com/DanielXMoore/Civet/pull/1001)]

## 0.6.72 (2024-02-12, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.71...v0.6.72), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.72))
* Fix private field glob getters [[#977](https://github.com/DanielXMoore/Civet/pull/977)]
* Fix spread bug extracted from lib.civet [[#982](https://github.com/DanielXMoore/Civet/pull/982)]
* export default shorthand [[#981](https://github.com/DanielXMoore/Civet/pull/981)]
* perf-compare improvements [[#983](https://github.com/DanielXMoore/Civet/pull/983)]
* Allow enums on one line [[#980](https://github.com/DanielXMoore/Civet/pull/980)]
* Fix TS infer, extends, typeof [[#986](https://github.com/DanielXMoore/Civet/pull/986)]
* Support "Error" nodes in Playground [[#987](https://github.com/DanielXMoore/Civet/pull/987)]

## 0.6.71 (2024-02-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.70...v0.6.71), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.71))
* Typed ampersand function improvements [[#969](https://github.com/DanielXMoore/Civet/pull/969)]
* Fix concatAssign for arrays [[#972](https://github.com/DanielXMoore/Civet/pull/972)]
* TypeScript's `import ... = require(...)` and `export = ...` [[#975](https://github.com/DanielXMoore/Civet/pull/975)]
* CLI import rewriting, --civet option, cleanup [[#974](https://github.com/DanielXMoore/Civet/pull/974)]
* Nested vs. implicit vs. inline object literals [[#976](https://github.com/DanielXMoore/Civet/pull/976)]

## 0.6.70 (2024-02-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.69...v0.6.70), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.70))
* Port CLI to more modern Civet [[#950](https://github.com/DanielXMoore/Civet/pull/950)]
* Fix ASI with one-argument (+) application [[#960](https://github.com/DanielXMoore/Civet/pull/960)]
* Allow return.value in pipeline [[#961](https://github.com/DanielXMoore/Civet/pull/961)]
* Allow return type annotation in getter shorthand [[#962](https://github.com/DanielXMoore/Civet/pull/962)]
* Fix object getters with globs [[#964](https://github.com/DanielXMoore/Civet/pull/964)]

## 0.6.69 (2024-02-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.68...v0.6.69), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.69))
* Operators as functions via parens [[#948](https://github.com/DanielXMoore/Civet/pull/948)]
* Add em dash for decrement [[#953](https://github.com/DanielXMoore/Civet/pull/953)]
* Cleanup Call arguments AST, fix (+) processing [[#955](https://github.com/DanielXMoore/Civet/pull/955)]

## 0.6.68 (2024-02-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.67...v0.6.68), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.68))
* Test validity of JS/TS outputs via esbuild parsing [[#932](https://github.com/DanielXMoore/Civet/pull/932)]
* Shorthand for type indexed access [[#945](https://github.com/DanielXMoore/Civet/pull/945)]
* `!op` shorthand for `not op` [[#946](https://github.com/DanielXMoore/Civet/pull/946)]

## 0.6.67 (2024-02-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.66...v0.6.67), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.67))
* Support TS instantiation expressions [[#940](https://github.com/DanielXMoore/Civet/pull/940)]
* Hera ESM support [[#942](https://github.com/DanielXMoore/Civet/pull/942)]
* Playground eval [[#941](https://github.com/DanielXMoore/Civet/pull/941)]

## 0.6.66 (2024-02-01, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.65...v0.6.66), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.66))
* TS typeof allow for arbitrary expressions, not just types [[#935](https://github.com/DanielXMoore/Civet/pull/935)]
* Fix ASI with pipes [[#937](https://github.com/DanielXMoore/Civet/pull/937)]
* Fix array of objects type [[#936](https://github.com/DanielXMoore/Civet/pull/936)]

## 0.6.65 (2024-01-30, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.64...v0.6.65), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.65))
* Fix optional property access shorthand [[#931](https://github.com/DanielXMoore/Civet/pull/931)]

## 0.6.64 (2024-01-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.63...v0.6.64), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.64))
* Fail on TypeScript errors, or specified types [[#928](https://github.com/DanielXMoore/Civet/pull/928)]

## 0.6.63 (2024-01-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.62...v0.6.63), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.63))
* Wrap thick pipes in parens [[#916](https://github.com/DanielXMoore/Civet/pull/916)]
* Support TypeScript `paths` alias [[#921](https://github.com/DanielXMoore/Civet/pull/921)]
* LSP support importing directories with index.civet [[#923](https://github.com/DanielXMoore/Civet/pull/923)]
* LSP pass on more completion info [[#924](https://github.com/DanielXMoore/Civet/pull/924)]
* Fix ts: 'tsc' behavior around sourcemaps [[#926](https://github.com/DanielXMoore/Civet/pull/926)]
* Use .tsx extension for TypeScript type checking [[#927](https://github.com/DanielXMoore/Civet/pull/927)]

## 0.6.62 (2024-01-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.61...v0.6.62), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.62))
* as! T [[#896](https://github.com/DanielXMoore/Civet/pull/896)]
* ++ concat operator [[#898](https://github.com/DanielXMoore/Civet/pull/898)]
* ++= concat assignment [[#899](https://github.com/DanielXMoore/Civet/pull/899)]
* Optional let declarations [[#902](https://github.com/DanielXMoore/Civet/pull/902)]
* Optional function return types [[#904](https://github.com/DanielXMoore/Civet/pull/904)]
* Conditional types via if/unless [[#905](https://github.com/DanielXMoore/Civet/pull/905)]
* `T?` → `T | undefined`; `T??` → `T | undefined | null` [[#908](https://github.com/DanielXMoore/Civet/pull/908)]
* Extends shorthand `<` and negated forms [[#907](https://github.com/DanielXMoore/Civet/pull/907)]
* Added (+) binary op to function shorthand [[#912](https://github.com/DanielXMoore/Civet/pull/912)]
* `(foo)` for custom operators `foo` [[#914](https://github.com/DanielXMoore/Civet/pull/914)]

## 0.6.61 (2023-12-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.60...v0.6.61), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.61))
* Fix unplugin emitDeclaration and Windows behavior [[#895](https://github.com/DanielXMoore/Civet/pull/895)]

## 0.6.60 (2023-12-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.59...v0.6.60), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.60))
* Use .-1 notation in Civet source [[#879](https://github.com/DanielXMoore/Civet/pull/879)]
* Update font; tagline [[#880](https://github.com/DanielXMoore/Civet/pull/880)]
* docs: Revise tagline, opening paragraph, and purple [[#882](https://github.com/DanielXMoore/Civet/pull/882)]
* Allow arbitrary unary operators before ampersand function notation [[#883](https://github.com/DanielXMoore/Civet/pull/883)]
* `[a ... b]` is a range, `[a ...b]` is implicit call [[#884](https://github.com/DanielXMoore/Civet/pull/884)]
* Stricter unary operators (before &) [[#886](https://github.com/DanielXMoore/Civet/pull/886)]
* Fix ASI before ranges [[#890](https://github.com/DanielXMoore/Civet/pull/890)]

## 0.6.59 (2023-12-18, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.58...v0.6.59), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.59))
* Update docs style [[#871](https://github.com/DanielXMoore/Civet/pull/871)]
* Color tweaks to improve contrast [[#874](https://github.com/DanielXMoore/Civet/pull/874)]
* Fix while(cond) without space [[#875](https://github.com/DanielXMoore/Civet/pull/875)]
* Omit obviously unreachable breaks from switch [[#876](https://github.com/DanielXMoore/Civet/pull/876)]
* Support x?.-1 and other optional fancy accesses [[#877](https://github.com/DanielXMoore/Civet/pull/877)]
* svg backgrounds [[#878](https://github.com/DanielXMoore/Civet/pull/878)]

## 0.6.58 (2023-12-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.57...v0.6.58), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.58))
* Fix implicit generators in assigned -> functions [[#865](https://github.com/DanielXMoore/Civet/pull/865)]
* Omit return with Iterator/Generator<*, void> type [[#866](https://github.com/DanielXMoore/Civet/pull/866)]
* Handle labeled loops [[#867](https://github.com/DanielXMoore/Civet/pull/867)]
* Add angle brackets to surroundingPairs [[#868](https://github.com/DanielXMoore/Civet/pull/868)]

## 0.6.57 (2023-12-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.56...v0.6.57), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.57))
* handleHotUpdate to fix Vite HMR (watch in dev mode) [[#860](https://github.com/DanielXMoore/Civet/pull/860)]
* Support implicit .civet importing unless implicitExtension: false [[#859](https://github.com/DanielXMoore/Civet/pull/859)]

## 0.6.56 (2023-12-15, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.55...v0.6.56), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.56))
* Fix #833: Add newline after trailing comment in implicit braced blocks [[#851](https://github.com/DanielXMoore/Civet/pull/851)]
* Fix #853: catch clause with extra space [[#856](https://github.com/DanielXMoore/Civet/pull/856)]
* Fix #850: Wrap parens around thick pipes with refs in declarations [[#855](https://github.com/DanielXMoore/Civet/pull/855)]
* Fix sourcemap issue in unplugin (#846) [[#857](https://github.com/DanielXMoore/Civet/pull/857)]

## 0.6.55 (2023-12-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.54...v0.6.55), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.55))
* Add bracket/comments matching to vscode plugin [[#835](https://github.com/DanielXMoore/Civet/pull/835)]
* Allow multiple patterns over multiple lines with comma [[#838](https://github.com/DanielXMoore/Civet/pull/838)]
* Fix #839: for each of declaration with auto-let [[#841](https://github.com/DanielXMoore/Civet/pull/841)]
* Import attributes [[#848](https://github.com/DanielXMoore/Civet/pull/848)]
* Fix special relational operator precedence [[#843](https://github.com/DanielXMoore/Civet/pull/843)]

## 0.6.54 (2023-12-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.53...v0.6.54), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.54))
* Generalize pin expressions to allow x.y and ^x.y [[#834](https://github.com/DanielXMoore/Civet/pull/834)]

## 0.6.53 (2023-12-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.52...v0.6.53), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.53))
* Fix unplugin Typescript builds and update API [[#810](https://github.com/DanielXMoore/Civet/pull/810)]
* Fix snug `x<y` [[#830](https://github.com/DanielXMoore/Civet/pull/830)]
* Fix #72. Reset service when tsconfig changes [[#807](https://github.com/DanielXMoore/Civet/pull/807)]

## 0.6.52 (2023-11-25, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.51...v0.6.52), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.52))
* Fix Promise<void> in non-async function [[#815](https://github.com/DanielXMoore/Civet/pull/815)]
* Indented function parameters [[#816](https://github.com/DanielXMoore/Civet/pull/816)]
* Assignments in & functions [[#817](https://github.com/DanielXMoore/Civet/pull/817)]
* Type arguments in template literals [[#820](https://github.com/DanielXMoore/Civet/pull/820)]

## 0.6.51 (2023-11-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.50...v0.6.51), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.51))
* Check for existence of absolute path in unplugin [[#797](https://github.com/DanielXMoore/Civet/pull/797)]
* Added references to lsp [[#801](https://github.com/DanielXMoore/Civet/pull/801)]
* Update xor typing [[#799](https://github.com/DanielXMoore/Civet/pull/799)]
* Fix #705 [[#802](https://github.com/DanielXMoore/Civet/pull/802)]

## 0.6.50 (2023-11-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.49...v0.6.50), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.50))
* Forbid comma operator in one-line thin arrow functions [[#795](https://github.com/DanielXMoore/Civet/pull/795)]
* Fix #704; better open paren whitespace handling in type declarations [[#796](https://github.com/DanielXMoore/Civet/pull/796)]

## 0.6.49 (2023-11-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.48...v0.6.49), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.49))
* Fix #792: TryExpression in conditional declaration [[#793](https://github.com/DanielXMoore/Civet/pull/793)]
* Update more parent pointers along the way [[#794](https://github.com/DanielXMoore/Civet/pull/794)]

## 0.6.48 (2023-10-30, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.47...v0.6.48), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.48))
* unplugin calls addWatchFile [[#780](https://github.com/DanielXMoore/Civet/pull/780)]
* Simpler implementation of comments near Civet directives [[#790](https://github.com/DanielXMoore/Civet/pull/790)]
* Allow -.1 as decimal literal [[#788](https://github.com/DanielXMoore/Civet/pull/788)]

## 0.6.47 (2023-10-27, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.46...v0.6.47), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.47))
* Allow comments near Civet directives [[#783](https://github.com/DanielXMoore/Civet/pull/783)]
* Fix unplugin path resolution (#774) [[#786](https://github.com/DanielXMoore/Civet/pull/786)]
* Transform Vite HTML imports for Civet [[#785](https://github.com/DanielXMoore/Civet/pull/785)]

## 0.6.46 (2023-10-21, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.45...v0.6.46), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.46))
* unplugin transformInclude to avoid transforming unrelated files [[#784](https://github.com/DanielXMoore/Civet/pull/784)]

## 0.6.45 (2023-10-16, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.44...v0.6.45), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.45))

## 0.6.44 (2023-10-16, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.43...v0.6.44), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.44))
* Perf4 [[#772](https://github.com/DanielXMoore/Civet/pull/772)]
* Fix #755: ampersand blocks with coffee compat [[#777](https://github.com/DanielXMoore/Civet/pull/777)]
* Default type for `return` declaration [[#778](https://github.com/DanielXMoore/Civet/pull/778)]
* Fix #643 [[#781](https://github.com/DanielXMoore/Civet/pull/781)]

## 0.6.43 (2023-10-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.42...v0.6.43), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.43))
* fixed line continuation edge case [[#768](https://github.com/DanielXMoore/Civet/pull/768)]
* refactor property access patterns; 0.7% perf improvement [[#770](https://github.com/DanielXMoore/Civet/pull/770)]
* Perf3 [[#771](https://github.com/DanielXMoore/Civet/pull/771)]

## 0.6.42 (2023-10-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.41...v0.6.42), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.42))
* Allow newline before ...rest parameter [[#761](https://github.com/DanielXMoore/Civet/pull/761)]
* Parenthesize if expressions, remove other excess parens [[#762](https://github.com/DanielXMoore/Civet/pull/762)]
* ~10% perf boost by adding some short circuit assertions [[#764](https://github.com/DanielXMoore/Civet/pull/764)]
* Make ts-diagnostic.civet independent of vscode dependencies [[#766](https://github.com/DanielXMoore/Civet/pull/766)]

## 0.6.41 (2023-09-30, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.40...v0.6.41), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.41))

## 0.6.40 (2023-09-30, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.39...v0.6.40), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.40))
* Fix #715; Parens around update assignments [[#748](https://github.com/DanielXMoore/Civet/pull/748)]
* Mild opt [[#749](https://github.com/DanielXMoore/Civet/pull/749)]
* Fix indexOf type signature [[#752](https://github.com/DanielXMoore/Civet/pull/752)]
* Support comments before directives [[#754](https://github.com/DanielXMoore/Civet/pull/754)]
* Remove common indentation of triple quotes [[#758](https://github.com/DanielXMoore/Civet/pull/758)]

## 0.6.39 (2023-09-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.38...v0.6.39), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.39))
* properly encoding js import source [[#736](https://github.com/DanielXMoore/Civet/pull/736)]
* Fix #522: default to JSX preserve for ts config in LSP [[#739](https://github.com/DanielXMoore/Civet/pull/739)]
* LSP Build refactor [[#737](https://github.com/DanielXMoore/Civet/pull/737)]
* basic parser tracing [[#721](https://github.com/DanielXMoore/Civet/pull/721)]
* Fix go to definition [[#738](https://github.com/DanielXMoore/Civet/pull/738)]
* convert build to civet style [[#740](https://github.com/DanielXMoore/Civet/pull/740)]
* Unbundled only works in debug mode [[#741](https://github.com/DanielXMoore/Civet/pull/741)]
* Fix #733; Allow postfixed expressions in array literals [[#746](https://github.com/DanielXMoore/Civet/pull/746)]
* Fix #743; Paren-less for expression with more complex increment [[#747](https://github.com/DanielXMoore/Civet/pull/747)]

## 0.6.38 (2023-09-16, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.37...v0.6.38), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.38))
* Files for testing bun plugin [[#725](https://github.com/DanielXMoore/Civet/pull/725)]
* Fix #714 [[#724](https://github.com/DanielXMoore/Civet/pull/724)]
* Fix 'not in' after logical binop [[#729](https://github.com/DanielXMoore/Civet/pull/729)]
* Fix #726: declaration condition in switch [[#728](https://github.com/DanielXMoore/Civet/pull/728)]
* Fix #104: correct syntax highlight for '.=' [[#730](https://github.com/DanielXMoore/Civet/pull/730)]
* Add type-checking to unplugin [[#689](https://github.com/DanielXMoore/Civet/pull/689)]
* docs: Fix bun plugin link [[#731](https://github.com/DanielXMoore/Civet/pull/731)]
* sourcemap fix [[#734](https://github.com/DanielXMoore/Civet/pull/734)]
* Cli update [[#735](https://github.com/DanielXMoore/Civet/pull/735)]

## 0.6.37 (2023-09-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.36...v0.6.37), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.37))
* Fix #503: TS `using` [[#722](https://github.com/DanielXMoore/Civet/pull/722)]

## 0.6.36 (2023-09-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.35...v0.6.36), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.36))
* Unify pattern matching and declaration conditions [[#717](https://github.com/DanielXMoore/Civet/pull/717)]

## 0.6.35 (2023-09-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.34...v0.6.35), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.35))
* Fix #629: Unary op with late assignment [[#716](https://github.com/DanielXMoore/Civet/pull/716)]
* Reference [[#685](https://github.com/DanielXMoore/Civet/pull/685)]
* get/set method shorthand [[#637](https://github.com/DanielXMoore/Civet/pull/637)]
* Warning-free hack for ergonomic require of cjs esbuild plugin [[#718](https://github.com/DanielXMoore/Civet/pull/718)]
* Fix #719: existential property glob and get/set shorthand with existential glob [[#720](https://github.com/DanielXMoore/Civet/pull/720)]

## 0.6.34 (2023-09-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.33...v0.6.34), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.34))

## 0.6.33 (2023-09-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.32...v0.6.33), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.33))
* Underflowing arrays is a perf killer [[#711](https://github.com/DanielXMoore/Civet/pull/711)]

## 0.6.32 (2023-09-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.31...v0.6.32), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.32))
* Fix #702: assignment dec in postfix if [[#703](https://github.com/DanielXMoore/Civet/pull/703)]
* Fix #701 [[#710](https://github.com/DanielXMoore/Civet/pull/710)]
* Fix #691: unary not with existential [[#709](https://github.com/DanielXMoore/Civet/pull/709)]

## 0.6.31 (2023-09-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.30...v0.6.31), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.31))
* Fix #699 void arrow functions shouldn't implicitly return [[#700](https://github.com/DanielXMoore/Civet/pull/700)]

## 0.6.30 (2023-09-03, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.29...v0.6.30), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.30))
* Fix #692: proper handling of re-alaised binding properties [[#698](https://github.com/DanielXMoore/Civet/pull/698)]
* Fix #695; consolidate method and function returns [[#696](https://github.com/DanielXMoore/Civet/pull/696)]
* Fix #504; single binding pattern parameter arrow function shorthand [[#697](https://github.com/DanielXMoore/Civet/pull/697)]

## 0.6.29 (2023-09-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.28...v0.6.29), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.29))
* Fix #684: Add support for TypeScript /// directives [[#686](https://github.com/DanielXMoore/Civet/pull/686)]

## 0.6.28 (2023-09-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.27...v0.6.28), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.28))
* Document unplugin [[#675](https://github.com/DanielXMoore/Civet/pull/675)]
* Add nextjs unplugin example [[#676](https://github.com/DanielXMoore/Civet/pull/676)]
* New try at indented application [[#677](https://github.com/DanielXMoore/Civet/pull/677)]
* Convert to more Civet-y style [[#683](https://github.com/DanielXMoore/Civet/pull/683)]
* Fix `/*...*/` after dot in access [[#679](https://github.com/DanielXMoore/Civet/pull/679)]
* Fix objects immediately inside braced blocks [[#680](https://github.com/DanielXMoore/Civet/pull/680)]
* Fixes #682; Fixes #653; Improved arrow function const assignment [[#687](https://github.com/DanielXMoore/Civet/pull/687)]
* `(&)` identity function shorthand [[#688](https://github.com/DanielXMoore/Civet/pull/688)]

## 0.6.27 (2023-08-31, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.26...v0.6.27), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.27))
* 🐈🐈🐈 [[#657](https://github.com/DanielXMoore/Civet/pull/657)]
* Added void to improve types and opt out of implicit returns [[#672](https://github.com/DanielXMoore/Civet/pull/672)]
* Add missing semicolon after one-line `if` branch [[#671](https://github.com/DanielXMoore/Civet/pull/671)]
* Fix hoisting of implicitly returned `function` [[#673](https://github.com/DanielXMoore/Civet/pull/673)]
* Fix implicit function calls with spread on following line [[#674](https://github.com/DanielXMoore/Civet/pull/674)]
* Fix arrow function body closed by closing parenthesis [[#670](https://github.com/DanielXMoore/Civet/pull/670)]
* Add civet unplugin [[#632](https://github.com/DanielXMoore/Civet/pull/632)]

## 0.6.26 (2023-08-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.25...v0.6.26), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.26))
* Fix #564 Implement basic const enums in --js mode [[#654](https://github.com/DanielXMoore/Civet/pull/654)]

## 0.6.25 (2023-08-25, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.24...v0.6.25), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.25))
* Initial auto-const [[#649](https://github.com/DanielXMoore/Civet/pull/649)]
* Fix #639 hoistable thick pipe ref decs [[#651](https://github.com/DanielXMoore/Civet/pull/651)]
* Fix #640 implicit return of const function declarations [[#652](https://github.com/DanielXMoore/Civet/pull/652)]

## 0.6.24 (2023-08-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.23...v0.6.24), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.24))
* Updated the Bun-related how-to [[#646](https://github.com/DanielXMoore/Civet/pull/646)]

## 0.6.23 (2023-08-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.22...v0.6.23), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.23))
* Postfix expressions inside indented implicit object literals [[#630](https://github.com/DanielXMoore/Civet/pull/630)]
* Postfix expressions inside inline object literals [[#631](https://github.com/DanielXMoore/Civet/pull/631)]
* Added private this shorthand. Fixes #633 [[#636](https://github.com/DanielXMoore/Civet/pull/636)]
* source/lib.js -> source/lib.ts [[#638](https://github.com/DanielXMoore/Civet/pull/638)]
* for own..in [[#644](https://github.com/DanielXMoore/Civet/pull/644)]

## 0.6.22 (2023-08-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.21...v0.6.22), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.22))
* Constructor prefix goes after super call [[#626](https://github.com/DanielXMoore/Civet/pull/626)]
* Fix hoisting around IIFE [[#627](https://github.com/DanielXMoore/Civet/pull/627)]

## 0.6.21 (2023-08-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.20...v0.6.21), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.21))
* for item, index of list [[#621](https://github.com/DanielXMoore/Civet/pull/621)]
* for key, value in object [[#622](https://github.com/DanielXMoore/Civet/pull/622)]
* for each..of [[#623](https://github.com/DanielXMoore/Civet/pull/623)]

## 0.6.20 (2023-08-07, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.19...v0.6.20), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.20))
* Fix tuple-matching behavior [[#608](https://github.com/DanielXMoore/Civet/pull/608)]
* Forbid binary op after newline within SingleLineStatements (e.g. `then`) [[#612](https://github.com/DanielXMoore/Civet/pull/612)]
* Remove forbidMultiLineImplicitObjectLiteral [[#613](https://github.com/DanielXMoore/Civet/pull/613)]
* Revamp braced object literals [[#614](https://github.com/DanielXMoore/Civet/pull/614)]
* Revamp array literals [[#617](https://github.com/DanielXMoore/Civet/pull/617)]
* `type` declaration without `=` [[#611](https://github.com/DanielXMoore/Civet/pull/611)]
* Cache fix for function calls within inline objects [[#618](https://github.com/DanielXMoore/Civet/pull/618)]
* Fix implicit return with switch+then [[#620](https://github.com/DanielXMoore/Civet/pull/620)]
* Unify Samedent/Nested, and other indent cleanup [[#619](https://github.com/DanielXMoore/Civet/pull/619)]

## 0.6.19 (2023-08-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.18...v0.6.19), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.19))
* Implicit returns of (last) declaration [[#606](https://github.com/DanielXMoore/Civet/pull/606)]
  * BREAKING CHANGE: `x := 5` now implicitly returns `x`

## 0.6.18 (2023-08-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.17...v0.6.18), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.18))
* TypeScript named tuples [[#604](https://github.com/DanielXMoore/Civet/pull/604)]
* Allow ?: with named elements in tuple types [[#605](https://github.com/DanielXMoore/Civet/pull/605)]
* Possessive object access [[#603](https://github.com/DanielXMoore/Civet/pull/603)]

## 0.6.17 (2023-07-31, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.16...v0.6.17), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.17))
* `switch` fixes [[#594](https://github.com/DanielXMoore/Civet/pull/594)]
* Support indented RHS after binary op [[#600](https://github.com/DanielXMoore/Civet/pull/600)]
* No implicit return from async function: Promise<void> [[#601](https://github.com/DanielXMoore/Civet/pull/601)]
* autoVar/autoLet should treat `=>` and methods same as functions [[#602](https://github.com/DanielXMoore/Civet/pull/602)]

## 0.6.16 (2023-07-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.15...v0.6.16), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.16))
* Fix export functions getting implicit empty blocks [[#592](https://github.com/DanielXMoore/Civet/pull/592)]

## 0.6.15 (2023-07-19, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.14...v0.6.15), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.15))
* Fix inner assignments mixed with operator assignments [[#585](https://github.com/DanielXMoore/Civet/pull/585)]
* Allow trailing CallExpression after ExpressionizedStatement [[#584](https://github.com/DanielXMoore/Civet/pull/584)]

## 0.6.14 (2023-07-15, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.13...v0.6.14), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.14))
* Existence operator chaining and cleanup [[#578](https://github.com/DanielXMoore/Civet/pull/578)]
* Arrow function types fixes: `abstract new` and `asserts`/predicates [[#580](https://github.com/DanielXMoore/Civet/pull/580)]
* Fix weird custom operator behavior [[#581](https://github.com/DanielXMoore/Civet/pull/581)]

## 0.6.13 (2023-07-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.12...v0.6.13), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.13))
* Forbid implicit calls with braced argument in extends/if/else/for/when/case [[#576](https://github.com/DanielXMoore/Civet/pull/576)]
* Fix nested object with function children (caching) [[#577](https://github.com/DanielXMoore/Civet/pull/577)]

## 0.6.12 (2023-07-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.11...v0.6.12), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.12))
* Fix empty objects in if statements [[#571](https://github.com/DanielXMoore/Civet/pull/571)]
* Fix binary ops RHS in pattern matching switch [[#575](https://github.com/DanielXMoore/Civet/pull/575)]
* Fix missing closing braces [[#574](https://github.com/DanielXMoore/Civet/pull/574)]

## 0.6.11 (2023-07-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.10...v0.6.11), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.11))
* Add missing parentheses to glob assignments with refs [[#567](https://github.com/DanielXMoore/Civet/pull/567)]
* Support TypeScript optional methods [[#568](https://github.com/DanielXMoore/Civet/pull/568)]
* Support new arrow function types [[#569](https://github.com/DanielXMoore/Civet/pull/569)]

## 0.6.10 (2023-07-03, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.9...v0.6.10), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.10))
* `not` support outside coffeeCompat mode [[#557](https://github.com/DanielXMoore/Civet/pull/557)]
* Unicode operators ≤≥≠≢≡≣⩶⩵«»⋙‖⁇∈∉∋∌▷‥…≔→⇒ [[#558](https://github.com/DanielXMoore/Civet/pull/558)]

## 0.6.9 (2023-06-18, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.8...v0.6.9), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.9))

## 0.6.8 (2023-06-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.7...v0.6.8), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.8))
* Function implicit bodies [[#542](https://github.com/DanielXMoore/Civet/pull/542)]
* Fix implicit calls with bind and decorators [[#545](https://github.com/DanielXMoore/Civet/pull/545)]
* Fix readonly support in interfaces  [[#546](https://github.com/DanielXMoore/Civet/pull/546)]

## 0.6.7 (2023-06-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.6...v0.6.7), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.7))

## 0.6.6 (2023-05-31, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.5...v0.6.6), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.6))

## 0.6.5 (2023-05-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.4...v0.6.5), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.5))

## 0.6.4 (2023-05-25, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.3...v0.6.4), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.4))

## 0.6.3 (2023-05-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.2...v0.6.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.3))
* Small whitespace fix for trailing splat [[#524](https://github.com/DanielXMoore/Civet/pull/524)]

## 0.6.2 (2023-05-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.1...v0.6.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.2))
* Support splats in type tuples [[#521](https://github.com/DanielXMoore/Civet/pull/521)]

## 0.6.1 (2023-05-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.6.0...v0.6.1), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.1))

## 0.6.0 (2023-05-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.94...v0.6.0), [commits](https://github.com/DanielXMoore/Civet/commits/v0.6.0))

## 0.5.94 (2023-04-15, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.93...v0.5.94), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.94))
* x@y and @@x bind shorthand, plus JSX fixes [[#506](https://github.com/DanielXMoore/Civet/pull/506)]
* JSX unbraced @ and @@ shorthand [[#507](https://github.com/DanielXMoore/Civet/pull/507)]
* JSX braceless call/member/glob expressions [[#508](https://github.com/DanielXMoore/Civet/pull/508)]

## 0.5.93 (2023-04-01, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.92...v0.5.93), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.93))
* Call splice method directly [[#499](https://github.com/DanielXMoore/Civet/pull/499)]
* Fix sourcemap support from CLI [[#498](https://github.com/DanielXMoore/Civet/pull/498)]
* Remove tsx after ESM transpilation [[#500](https://github.com/DanielXMoore/Civet/pull/500)]
* Fix implicit async/* in functions with arguments [[#501](https://github.com/DanielXMoore/Civet/pull/501)]

## 0.5.92 (2023-03-30, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.91...v0.5.92), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.92))

## 0.5.91 (2023-03-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.90...v0.5.91), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.91))
* Indentation after await operator [[#475](https://github.com/DanielXMoore/Civet/pull/475)]
* CLI can run ESM scripts via import [[#477](https://github.com/DanielXMoore/Civet/pull/477)]
* Inline implicit object literals can't end with comma [[#479](https://github.com/DanielXMoore/Civet/pull/479)]

## 0.5.90 (2023-03-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.89...v0.5.90), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.90))

## 0.5.89 (2023-03-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.88...v0.5.89), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.89))

## 0.5.88 (2023-03-19, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.87...v0.5.88), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.88))

## 0.5.87 (2023-03-16, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.86...v0.5.87), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.87))
* Link to Civetman [[#450](https://github.com/DanielXMoore/Civet/pull/450)]

## 0.5.86 (2023-03-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.85...v0.5.86), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.86))

## 0.5.85 (2023-03-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.84...v0.5.85), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.85))
* For loop optimizations and generalizations [[#442](https://github.com/DanielXMoore/Civet/pull/442)]
* Semicolon-separated statements in blocks [[#443](https://github.com/DanielXMoore/Civet/pull/443)]

## 0.5.84 (2023-03-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.83...v0.5.84), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.84))

## 0.5.83 (2023-03-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.82...v0.5.83), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.83))
* Fix regression in indented application from decorators change. Fixes #434 [[#435](https://github.com/DanielXMoore/Civet/pull/435)]

## 0.5.82 (2023-03-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.81...v0.5.82), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.82))

## 0.5.81 (2023-03-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.80...v0.5.81), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.81))

## 0.5.80 (2023-03-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.79...v0.5.80), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.80))
* New top-level statement system [[#414](https://github.com/DanielXMoore/Civet/pull/414)]

## 0.5.79 (2023-02-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.78...v0.5.79), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.79))

## 0.5.78 (2023-02-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.77...v0.5.78), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.78))
* Call with unparenthesized iteration expression argument [[#411](https://github.com/DanielXMoore/Civet/pull/411)]

## 0.5.77 (2023-02-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.76...v0.5.77), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.77))
* async do, async for [[#402](https://github.com/DanielXMoore/Civet/pull/402)]
* Improve ligature toggles [[#404](https://github.com/DanielXMoore/Civet/pull/404)]
* Leave plain JSX strings alone, including newlines [[#408](https://github.com/DanielXMoore/Civet/pull/408)]
* enum support [[#410](https://github.com/DanielXMoore/Civet/pull/410)]

## 0.5.76 (2023-02-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.75...v0.5.76), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.76))
* Fix automatic async vs. pipe invocations [[#401](https://github.com/DanielXMoore/Civet/pull/401)]

## 0.5.75 (2023-02-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.74...v0.5.75), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.75))
* Move Philosophy to civet.dev [[#394](https://github.com/DanielXMoore/Civet/pull/394)]
* Prevent indented application in Coffee for loops [[#396](https://github.com/DanielXMoore/Civet/pull/396)]
* Forbid indented application in first line of array literal [[#397](https://github.com/DanielXMoore/Civet/pull/397)]
* Automatically await/async expressionized statements with await [[#399](https://github.com/DanielXMoore/Civet/pull/399)]

## 0.5.74 (2023-02-19, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.73...v0.5.74), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.74))
* do expressions wrapping in iffe [[#376](https://github.com/DanielXMoore/Civet/pull/376)]
* Write an intro to Civet for the front page [[#386](https://github.com/DanielXMoore/Civet/pull/386)]
* Update Hero.vue [[#392](https://github.com/DanielXMoore/Civet/pull/392)]
* TypeScript non-null declarations [[#393](https://github.com/DanielXMoore/Civet/pull/393)]

## 0.5.73 (2023-02-15, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.72...v0.5.73), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.73))

## 0.5.72 (2023-02-14, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.71...v0.5.72), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.72))

## 0.5.71 (2023-02-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.70...v0.5.71), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.71))
* return.value and return = [[#364](https://github.com/DanielXMoore/Civet/pull/364)]
* Trailing member properties in blocks [[#368](https://github.com/DanielXMoore/Civet/pull/368)]
* Declare and update return.value [[#366](https://github.com/DanielXMoore/Civet/pull/366)]

## 0.5.70 (2023-02-12, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.69...v0.5.70), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.70))
* Allow label argument in break and continue [[#363](https://github.com/DanielXMoore/Civet/pull/363)]

## 0.5.69 (2023-02-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.68...v0.5.69), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.69))
*  Allow assignments and update operators within assignments and update operators ++/-- [[#353](https://github.com/DanielXMoore/Civet/pull/353)]
* Support for labeling statements [[#354](https://github.com/DanielXMoore/Civet/pull/354)]
* Cleanup flag stacks, re-allow stuff inside parens/brackets/braces [[#356](https://github.com/DanielXMoore/Civet/pull/356)]
* Prevent `case:` from implicit object literal [[#357](https://github.com/DanielXMoore/Civet/pull/357)]

## 0.5.68 (2023-02-09, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.67...v0.5.68), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.68))
* Inner assignments within assignment chains [[#348](https://github.com/DanielXMoore/Civet/pull/348)]
* Test helper `throws` supports description and --- [[#349](https://github.com/DanielXMoore/Civet/pull/349)]

## 0.5.67 (2023-02-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.66...v0.5.67), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.67))
* Switch prelude declarations from const to var [[#344](https://github.com/DanielXMoore/Civet/pull/344)]
* Spreads in object globs [[#343](https://github.com/DanielXMoore/Civet/pull/343)]
* Pipelines lower precedence than implicit arguments [[#347](https://github.com/DanielXMoore/Civet/pull/347)]
* Support hex and other numbers in ranges [[#345](https://github.com/DanielXMoore/Civet/pull/345)]

## 0.5.66 (2023-02-07, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.65...v0.5.66), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.66))
* xor/^^ and xnor/!^ operators [[#340](https://github.com/DanielXMoore/Civet/pull/340)]

## 0.5.65 (2023-02-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.64...v0.5.65), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.65))

## 0.5.64 (2023-02-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.63...v0.5.64), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.64))
* Object globs, v2 [[#333](https://github.com/DanielXMoore/Civet/pull/333)]
* Fix #332 [[#334](https://github.com/DanielXMoore/Civet/pull/334)]

## 0.5.63 (2023-02-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.62...v0.5.63), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.63))
* Improve super property support [[#326](https://github.com/DanielXMoore/Civet/pull/326)]

## 0.5.62 (2023-02-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.61...v0.5.62), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.62))
* Tagged string literals become tagged template literals [[#322](https://github.com/DanielXMoore/Civet/pull/322)]
* Function fixes [[#323](https://github.com/DanielXMoore/Civet/pull/323)]
* typeof shorthand [[#325](https://github.com/DanielXMoore/Civet/pull/325)]

## 0.5.61 (2023-02-01, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.60...v0.5.61), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.61))

## 0.5.60 (2023-02-01, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.59...v0.5.60), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.60))
* operator= assignment [[#301](https://github.com/DanielXMoore/Civet/pull/301)]

## 0.5.59 (2023-01-28, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.58...v0.5.59), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.59))

## 0.5.58 (2023-01-28, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.57...v0.5.58), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.58))

## 0.5.57 (2023-01-27, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.56...v0.5.57), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.57))

## 0.5.56 (2023-01-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.55...v0.5.56), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.56))
* `{x[y]}` shorthand for `{[y]: x[y]}` [[#284](https://github.com/DanielXMoore/Civet/pull/284)]
* Require space in JSX after identifier or `...rest` attribute [[#285](https://github.com/DanielXMoore/Civet/pull/285)]
* `not instanceof`, `!<?`, reserve `not` [[#286](https://github.com/DanielXMoore/Civet/pull/286)]

## 0.5.55 (2023-01-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.54...v0.5.55), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.55))
* Integer property access [[#283](https://github.com/DanielXMoore/Civet/pull/283)]

## 0.5.54 (2023-01-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.53...v0.5.54), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.54))

## 0.5.53 (2023-01-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.52...v0.5.53), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.53))
* Fix Init being called too late [[#280](https://github.com/DanielXMoore/Civet/pull/280)]
* Fix semicolon method body [[#281](https://github.com/DanielXMoore/Civet/pull/281)]

## 0.5.52 (2023-01-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.51...v0.5.52), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.52))
* `<:` shorthand for implements [[#275](https://github.com/DanielXMoore/Civet/pull/275)]
* Braced object literal shorthand [[#276](https://github.com/DanielXMoore/Civet/pull/276)]
* Property access with string literals [[#278](https://github.com/DanielXMoore/Civet/pull/278)]
* Insert semicolons between lines that JS would combine [[#277](https://github.com/DanielXMoore/Civet/pull/277)]

## 0.5.51 (2023-01-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.50...v0.5.51), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.51))

## 0.5.50 (2023-01-21, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.49...v0.5.50), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.50))

## 0.5.49 (2023-01-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.48...v0.5.49), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.49))
* Contributing document for getting started with Civet [[#255](https://github.com/DanielXMoore/Civet/pull/255)]

## 0.5.48 (2023-01-18, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.47...v0.5.48), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.48))

## 0.5.47 (2023-01-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.46...v0.5.47), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.47))

## 0.5.46 (2023-01-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.45...v0.5.46), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.46))

## 0.5.45 (2023-01-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.44...v0.5.45), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.45))

## 0.5.44 (2023-01-16, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.43...v0.5.44), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.44))

## 0.5.43 (2023-01-15, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.42...v0.5.43), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.43))

## 0.5.42 (2023-01-15, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.41...v0.5.42), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.42))

## 0.5.41 (2023-01-14, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.40...v0.5.41), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.41))

## 0.5.40 (2023-01-14, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.39...v0.5.40), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.40))
* New fast JSX parser [[#235](https://github.com/DanielXMoore/Civet/pull/235)]

## 0.5.39 (2023-01-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.38...v0.5.39), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.39))
* Fix CLI behavior especially on Unix [[#232](https://github.com/DanielXMoore/Civet/pull/232)]

## 0.5.38 (2023-01-12, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.37...v0.5.38), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.38))

## 0.5.37 (2023-01-12, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.36...v0.5.37), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.37))

## 0.5.36 (2023-01-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.35...v0.5.36), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.36))
* Gulp plugin [[#206](https://github.com/DanielXMoore/Civet/pull/206)]

## 0.5.35 (2023-01-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.34...v0.5.35), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.35))

## 0.5.34 (2023-01-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.33...v0.5.34), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.34))

## 0.5.33 (2023-01-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.32...v0.5.33), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.33))
* Synonyous -> synonymous [[#180](https://github.com/DanielXMoore/Civet/pull/180)]

## 0.5.32 (2023-01-09, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.31...v0.5.32), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.32))

## 0.5.31 (2023-01-09, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.30...v0.5.31), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.31))

## 0.5.30 (2023-01-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.29...v0.5.30), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.30))

## 0.5.29 (2023-01-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.28...v0.5.29), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.29))

## 0.5.28 (2023-01-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.27...v0.5.28), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.28))
* Create directory in `-o` option if it doesn't exist [[#164](https://github.com/DanielXMoore/Civet/pull/164)]

## 0.5.27 (2023-01-07, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.26...v0.5.27), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.27))

## 0.5.26 (2023-01-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.25...v0.5.26), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.26))
* New Playground tag in docs [[#125](https://github.com/DanielXMoore/Civet/pull/125)]
* Docs: fix code examples rendering [[#140](https://github.com/DanielXMoore/Civet/pull/140)]

## 0.5.25 (2023-01-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.24...v0.5.25), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.25))
* Fix for nested JSX if else expressions [[#133](https://github.com/DanielXMoore/Civet/pull/133)]

## 0.5.24 (2023-01-06, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.23...v0.5.24), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.24))

## 0.5.23 (2023-01-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.22...v0.5.23), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.23))

## 0.5.22 (2023-01-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.21...v0.5.22), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.22))

## 0.5.21 (2023-01-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.20...v0.5.21), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.21))

## 0.5.20 (2023-01-03, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.19...v0.5.20), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.20))

## 0.5.19 (2022-12-31, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.18...v0.5.19), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.19))

## 0.5.18 (2022-12-30, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.16...v0.5.18), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.18))

## 0.5.16 (2022-12-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.15...v0.5.16), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.16))

## 0.5.15 (2022-12-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.14...v0.5.15), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.15))

## 0.5.14 (2022-12-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.13...v0.5.14), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.14))

## 0.5.13 (2022-12-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.12...v0.5.13), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.13))

## 0.5.12 (2022-12-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.11...v0.5.12), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.12))

## 0.5.11 (2022-12-25, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.10...v0.5.11), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.11))

## 0.5.10 (2022-12-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.9...v0.5.10), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.10))

## 0.5.9 (2022-12-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.8...v0.5.9), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.9))

## 0.5.8 (2022-12-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.7...v0.5.8), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.8))

## 0.5.7 (2022-12-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.6...v0.5.7), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.7))

## 0.5.6 (2022-12-20, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.5...v0.5.6), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.6))

## 0.5.5 (2022-12-18, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.4...v0.5.5), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.5))

## 0.5.4 (2022-12-18, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.3...v0.5.4), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.4))

## 0.5.3 (2022-12-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.2...v0.5.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.3))

## 0.5.2 (2022-12-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.1...v0.5.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.2))

## 0.5.1 (2022-12-16, [diff](https://github.com/DanielXMoore/Civet/compare/v0.5.0...v0.5.1), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.1))

## 0.5.0 (2022-12-14, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.38...v0.5.0), [commits](https://github.com/DanielXMoore/Civet/commits/v0.5.0))

## 0.4.38 (2022-12-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.37...v0.4.38), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.38))

## 0.4.37 (2022-12-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.36...v0.4.37), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.37))

## 0.4.36 (2022-12-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.35...v0.4.36), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.36))

## 0.4.35 (2022-12-12, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.34...v0.4.35), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.35))

## 0.4.34 (2022-12-12, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.33...v0.4.34), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.34))

## 0.4.33 (2022-12-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.32...v0.4.33), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.33))

## 0.4.32 (2022-12-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.31...v0.4.32), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.32))

## 0.4.31 (2022-12-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.28...v0.4.31), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.31))

## 0.4.28 (2022-12-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.27...v0.4.28), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.28))

## 0.4.27 (2022-12-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.26...v0.4.27), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.27))

## 0.4.26 (2022-12-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.25...v0.4.26), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.26))

## 0.4.25 (2022-12-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.24...v0.4.25), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.25))

## 0.4.24 (2022-12-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.23...v0.4.24), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.24))

## 0.4.23 (2022-12-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.22...v0.4.23), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.23))
* CoffeeScript export to-do [[#22](https://github.com/DanielXMoore/Civet/pull/22)]
* Add command to restart language server [[#23](https://github.com/DanielXMoore/Civet/pull/23)]

## 0.4.22 (2022-12-07, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.21...v0.4.22), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.22))
* More consistent use of paths vs. file URIs [[#19](https://github.com/DanielXMoore/Civet/pull/19)]
* Support for unbraced `export x, y` [[#21](https://github.com/DanielXMoore/Civet/pull/21)]

## 0.4.21 (2022-12-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.20...v0.4.21), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.21))

## 0.4.20 (2022-12-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.14...v0.4.20), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.20))

## 0.4.19-pre.14 (2022-11-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.13...v0.4.19-pre.14), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.14))
* Allow and= / or= by default (not just coffeeCompat) [[#16](https://github.com/DanielXMoore/Civet/pull/16)]
* MIT license [[#17](https://github.com/DanielXMoore/Civet/pull/17)]

## 0.4.19-pre.13 (2022-11-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.12...v0.4.19-pre.13), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.13))

## 0.4.19-pre.12 (2022-11-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.11...v0.4.19-pre.12), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.12))

## 0.4.19-pre.11 (2022-11-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.10...v0.4.19-pre.11), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.11))
* Caching [[#14](https://github.com/DanielXMoore/Civet/pull/14)]

## 0.4.19-pre.10 (2022-11-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.9...v0.4.19-pre.10), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.10))

## 0.4.19-pre.9 (2022-11-12, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.7...v0.4.19-pre.9), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.9))

## 0.4.19-pre.7 (2022-11-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.6...v0.4.19-pre.7), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.7))

## 0.4.19-pre.6 (2022-11-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.5...v0.4.19-pre.6), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.6))

## 0.4.19-pre.5 (2022-11-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.4...v0.4.19-pre.5), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.5))

## 0.4.19-pre.4 (2022-11-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.3...v0.4.19-pre.4), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.4))
* Add script for testing compatibility with CoffeeScript [[#7](https://github.com/DanielXMoore/Civet/pull/7)]

## 0.4.19-pre.3 (2022-11-09, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.2...v0.4.19-pre.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.3))

## 0.4.19-pre.2 (2022-11-09, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.1...v0.4.19-pre.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.2))

## 0.4.19-pre.1 (2022-11-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.19-pre.0...v0.4.19-pre.1), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.1))

## 0.4.19-pre.0 (2022-11-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.18.3...v0.4.19-pre.0), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.19-pre.0))

## 0.4.18.3 (2022-11-08, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.18.2...v0.4.18.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.18.3))
* Rewrite cli to use readline interface [[#6](https://github.com/DanielXMoore/Civet/pull/6)]

## 0.4.18.2 (2022-11-07, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.18.1...v0.4.18.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.18.2))

## 0.4.18.1 (2022-11-07, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.18...v0.4.18.1), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.18.1))

## 0.4.18 (2022-11-07, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.17...v0.4.18), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.18))
* Coffee comprehensions [[#4](https://github.com/DanielXMoore/Civet/pull/4)]

## 0.4.17 (2022-11-02, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.16...v0.4.17), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.17))
* Auto var [[#3](https://github.com/DanielXMoore/Civet/pull/3)]

## 0.4.16 (2022-10-25, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.15...v0.4.16), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.16))

## 0.4.15 (2022-10-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.14...v0.4.15), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.15))

## 0.4.14 (2022-10-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.13...v0.4.14), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.14))

## 0.4.13 (2022-10-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.12...v0.4.13), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.13))

## 0.4.12 (2022-10-18, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.10...v0.4.12), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.12))

## 0.4.10 (2022-10-17, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.9...v0.4.10), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.10))

## 0.4.9 (2022-10-12, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.8...v0.4.9), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.9))

## 0.4.8 (2022-10-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.7...v0.4.8), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.8))

## 0.4.7 (2022-10-10, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.6...v0.4.7), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.7))

## 0.4.6 (2022-10-01, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.5...v0.4.6), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.6))

## 0.4.5 (2022-10-01, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.4...v0.4.5), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.5))

## 0.4.4 (2022-09-30, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.3...v0.4.4), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.4))

## 0.4.3 (2022-09-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.2...v0.4.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.3))

## 0.4.2 (2022-09-29, [diff](https://github.com/DanielXMoore/Civet/compare/v0.4.0...v0.4.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.2))

## 0.4.0 (2022-09-27, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.16...v0.4.0), [commits](https://github.com/DanielXMoore/Civet/commits/v0.4.0))

## 0.3.16 (2022-09-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.15...v0.3.16), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.16))

## 0.3.15 (2022-09-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.14...v0.3.15), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.15))

## 0.3.14 (2022-09-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.13...v0.3.14), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.14))

## 0.3.13 (2022-09-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.12...v0.3.13), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.13))

## 0.3.12 (2022-09-22, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.10...v0.3.12), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.12))
* Transpilation overhaul [[#1](https://github.com/DanielXMoore/Civet/pull/1)]

## 0.3.10 (2022-09-14, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.9...v0.3.10), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.10))

## 0.3.9 (2022-09-14, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.8...v0.3.9), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.9))

## 0.3.8 (2022-09-14, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.7...v0.3.8), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.8))

## 0.3.7 (2022-09-14, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.6...v0.3.7), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.7))

## 0.3.6 (2022-09-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.5...v0.3.6), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.6))

## 0.3.5 (2022-09-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.4...v0.3.5), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.5))

## 0.3.4 (2022-09-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.3...v0.3.4), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.4))

## 0.3.3 (2022-09-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.2...v0.3.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.3))

## 0.3.2 (2022-09-13, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.1...v0.3.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.2))

## 0.3.1 (2022-09-11, [diff](https://github.com/DanielXMoore/Civet/compare/v0.3.0...v0.3.1), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.1))

## 0.3.0 (2022-09-09, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.16...v0.3.0), [commits](https://github.com/DanielXMoore/Civet/commits/v0.3.0))

## 0.2.16 (2022-09-07, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.15...v0.2.16), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.16))

## 0.2.15 (2022-09-05, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.14...v0.2.15), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.15))

## 0.2.14 (2022-09-04, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.13...v0.2.14), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.14))

## 0.2.13 (2022-08-27, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.12...v0.2.13), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.13))

## 0.2.12 (2022-08-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.11...v0.2.12), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.12))

## 0.2.11 (2022-08-26, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.9...v0.2.11), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.11))

## 0.2.9 (2022-08-25, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.8...v0.2.9), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.9))

## 0.2.8 (2022-08-25, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.7...v0.2.8), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.8))

## 0.2.7 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.6...v0.2.7), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.7))

## 0.2.6 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.5...v0.2.6), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.6))

## 0.2.5 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.4...v0.2.5), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.5))

## 0.2.4 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.3...v0.2.4), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.4))

## 0.2.3 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.2...v0.2.3), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.3))

## 0.2.2 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.2.0...v0.2.2), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.2))

## 0.2.0 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/v0.1.1...v0.2.0), [commits](https://github.com/DanielXMoore/Civet/commits/v0.2.0))

## 0.1.1 (2022-08-23, [diff](https://github.com/DanielXMoore/Civet/compare/v0.1.0...v0.1.1), [commits](https://github.com/DanielXMoore/Civet/commits/v0.1.1))

## 0.1.0 (2022-08-07, [commits](https://github.com/DanielXMoore/Civet/commits/v0.1.0))

