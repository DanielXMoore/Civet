# Civet Changelog

This changelog is generated automatically by [`build/changelog.civet`](build/changelog.civet).

## 0.7.23 (2024-08-15, [diff](https://github.com/DanielXMoore/Civet/compare/2911264c014135f356955967f0085352ed569f64...b909f467e263c3a307bad7ee699ebdbf862f2e76), [commit](https://github.com/DanielXMoore/Civet/commit/b909f467e263c3a307bad7ee699ebdbf862f2e76))
* Optional dot in `?.` and `!.` property access: `x?y` and `x!y` [[#1352](https://github.com/DanielXMoore/Civet/pull/1352)]
* Changelog generation: fetch PRs mostly in parallel [[#1353](https://github.com/DanielXMoore/Civet/pull/1353)]
* Allow empty `interface` and `namespace` blocks [[#1356](https://github.com/DanielXMoore/Civet/pull/1356)]
* Add missing parens in ampersand functions starting with object literal [[#1357](https://github.com/DanielXMoore/Civet/pull/1357)]
* Changelog: Add version dates and diff/commit links, add PR links [[#1358](https://github.com/DanielXMoore/Civet/pull/1358)]
* Document how to use with React Native / Metro bundler [[#1359](https://github.com/DanielXMoore/Civet/pull/1359)]
* Fix arrow being treated as assignment in tight arrow functions [[#1360](https://github.com/DanielXMoore/Civet/pull/1360)]
* Fix esbuild unplugin sourcemap bug [[#1362](https://github.com/DanielXMoore/Civet/pull/1362)]
* Bulleted arrays with `.` or `•` [[#1361](https://github.com/DanielXMoore/Civet/pull/1361)]

## 0.7.22 (2024-08-09, [diff](https://github.com/DanielXMoore/Civet/compare/ffa327c2488dfb20e06b70718afa4b78c4909cde...2911264c014135f356955967f0085352ed569f64), [commit](https://github.com/DanielXMoore/Civet/commit/2911264c014135f356955967f0085352ed569f64))
* Add CommonJS build of Babel plugin, enabling React Native support [[#1351](https://github.com/DanielXMoore/Civet/pull/1351)]
* Automatic changelog creation [[#1350](https://github.com/DanielXMoore/Civet/pull/1350)]

## 0.7.21 (2024-08-08, [diff](https://github.com/DanielXMoore/Civet/compare/1f6b8c4c86780a7db396a662a9603f3b3e5c0e4f...ffa327c2488dfb20e06b70718afa4b78c4909cde), [commit](https://github.com/DanielXMoore/Civet/commit/ffa327c2488dfb20e06b70718afa4b78c4909cde))
* Fix `..` slice operator precedence [[#1332](https://github.com/DanielXMoore/Civet/pull/1332)]
* Fix `&&` chain precedence with bitwise `&`/`|`/`^` [[#1334](https://github.com/DanielXMoore/Civet/pull/1334)]
* Assignment operators for div and mod [[#1338](https://github.com/DanielXMoore/Civet/pull/1338)]
* Nested return type annotation [[#1340](https://github.com/DanielXMoore/Civet/pull/1340)]
* Fix relational chains involving `!=` [[#1346](https://github.com/DanielXMoore/Civet/pull/1346)]
* Add missing Unicode assignment operators [[#1347](https://github.com/DanielXMoore/Civet/pull/1347)]
* Fix CLI for globally installed Civet [[#1348](https://github.com/DanielXMoore/Civet/pull/1348)]
* CLI `-e`/`--eval` option for running/compiling a string [[#1349](https://github.com/DanielXMoore/Civet/pull/1349)]

## 0.7.20 (2024-08-03, [diff](https://github.com/DanielXMoore/Civet/compare/2677d5d7bcb03114745582e854655296766f1ca9...1f6b8c4c86780a7db396a662a9603f3b3e5c0e4f), [commit](https://github.com/DanielXMoore/Civet/commit/1f6b8c4c86780a7db396a662a9603f3b3e5c0e4f))
* Fix whitespace in snug `<?` instanceof shorthand [[#1329](https://github.com/DanielXMoore/Civet/pull/1329)]
* Add `%/`/`÷` integer division, fix `%%` precedence [[#1331](https://github.com/DanielXMoore/Civet/pull/1331)]

## 0.7.19 (2024-07-20, [diff](https://github.com/DanielXMoore/Civet/compare/086536135d33d96e4e3ac6b06ae3ce49812e5cb8...2677d5d7bcb03114745582e854655296766f1ca9), [commit](https://github.com/DanielXMoore/Civet/commit/2677d5d7bcb03114745582e854655296766f1ca9))
* Prevent BinaryOp function shorthand from shadowing arrow functions. [[#1317](https://github.com/DanielXMoore/Civet/pull/1317)]
* Use register to avoid experimental loaders deprecation warning [[#1324](https://github.com/DanielXMoore/Civet/pull/1324)]
* Support for `unique symbol` type in TS [[#1323](https://github.com/DanielXMoore/Civet/pull/1323)]

## 0.7.18 (2024-07-10, [diff](https://github.com/DanielXMoore/Civet/compare/89f02fe40752398e36a371ee24b85b932390e127...086536135d33d96e4e3ac6b06ae3ce49812e5cb8), [commit](https://github.com/DanielXMoore/Civet/commit/086536135d33d96e4e3ac6b06ae3ce49812e5cb8))
* Jest integration [[#1313](https://github.com/DanielXMoore/Civet/pull/1313)]
* Hoist array binding and rest ref declarations. Fixes #1139. Fixes #1312 [[#1314](https://github.com/DanielXMoore/Civet/pull/1314)]

## 0.7.17 (2024-07-08, [diff](https://github.com/DanielXMoore/Civet/compare/29148e11130a4124207f6204dbf1933b7c0744d7...89f02fe40752398e36a371ee24b85b932390e127), [commit](https://github.com/DanielXMoore/Civet/commit/89f02fe40752398e36a371ee24b85b932390e127))
* Move unplugin and build using Civet instead of tsup [[#1306](https://github.com/DanielXMoore/Civet/pull/1306)]
* CLI tests [[#1308](https://github.com/DanielXMoore/Civet/pull/1308)]
* Fix import looking like multiplication [[#1310](https://github.com/DanielXMoore/Civet/pull/1310)]
* Fix indented chained ternaries [[#1311](https://github.com/DanielXMoore/Civet/pull/1311)]

## 0.7.16 (2024-07-06, [diff](https://github.com/DanielXMoore/Civet/compare/294a36eb3d4b7ace7fe822ec0710966f9dafc7f2...29148e11130a4124207f6204dbf1933b7c0744d7), [commit](https://github.com/DanielXMoore/Civet/commit/29148e11130a4124207f6204dbf1933b7c0744d7))
* Fix pipe mode in CLI [[#1305](https://github.com/DanielXMoore/Civet/pull/1305)]

## 0.7.15 (2024-07-03, [diff](https://github.com/DanielXMoore/Civet/compare/566b9c60f9d44fc62ebb37094cf4e8e3dd684652...294a36eb3d4b7ace7fe822ec0710966f9dafc7f2), [commit](https://github.com/DanielXMoore/Civet/commit/294a36eb3d4b7ace7fe822ec0710966f9dafc7f2))
* More CLI/typechecking fixes: `civetconfig` extensions, `@types` support, `includes`/`excludes`/`files` support, typechecking without filename list [[#1304](https://github.com/DanielXMoore/Civet/pull/1304)]

## 0.7.14 (2024-07-01, [diff](https://github.com/DanielXMoore/Civet/compare/db1e5576fb77796ae7a89d26ec7e6c6c72f8579e...566b9c60f9d44fc62ebb37094cf4e8e3dd684652), [commit](https://github.com/DanielXMoore/Civet/commit/566b9c60f9d44fc62ebb37094cf4e8e3dd684652))
* Fix some TS errors and increase code coverage [[#1283](https://github.com/DanielXMoore/Civet/pull/1283)]
* Fix extension for CLI's `--typecheck` [[#1297](https://github.com/DanielXMoore/Civet/pull/1297)]
* Fix `if` types [[#1298](https://github.com/DanielXMoore/Civet/pull/1298)]
* Add `class with A, B` mixin notation [[#1299](https://github.com/DanielXMoore/Civet/pull/1299)]
* Allow `civetConfig` in `package.`[`json`|`yaml`] [[#1300](https://github.com/DanielXMoore/Civet/pull/1300)]
* Typecheck fixes: JSX default, `tsconfig` errors, `imports` field [[#1302](https://github.com/DanielXMoore/Civet/pull/1302)]

## 0.7.13 (2024-06-26, [diff](https://github.com/DanielXMoore/Civet/compare/b1dacb71939c47b78b1184cbdf27b9fa296d36b1...db1e5576fb77796ae7a89d26ec7e6c6c72f8579e), [commit](https://github.com/DanielXMoore/Civet/commit/db1e5576fb77796ae7a89d26ec7e6c6c72f8579e))
* Binary op fixes [[#1282](https://github.com/DanielXMoore/Civet/pull/1282)]
* Fix argument parsing [[#1293](https://github.com/DanielXMoore/Civet/pull/1293)]
* Cleanup Bun loader code [[#1291](https://github.com/DanielXMoore/Civet/pull/1291)]
* Self-test [[#1292](https://github.com/DanielXMoore/Civet/pull/1292)]
* Upgrade TypeScript to 5.5 [[#1294](https://github.com/DanielXMoore/Civet/pull/1294)]
* MaybeNested expressions [[#1295](https://github.com/DanielXMoore/Civet/pull/1295)]

## 0.7.12 (2024-06-11, [diff](https://github.com/DanielXMoore/Civet/compare/e9fdc424edcaeacca280027f97ce130c3aa5d859...b1dacb71939c47b78b1184cbdf27b9fa296d36b1), [commit](https://github.com/DanielXMoore/Civet/commit/b1dacb71939c47b78b1184cbdf27b9fa296d36b1))
* Pipe to dynamic import [[#1275](https://github.com/DanielXMoore/Civet/pull/1275)]
* Added a cache based on mtime for watch/serve mode in esbuild [[#1276](https://github.com/DanielXMoore/Civet/pull/1276)]
* Fix async detection in a few cases [[#1278](https://github.com/DanielXMoore/Civet/pull/1278)]
* Replacing some instances of __ with stricter whitespace checking [[#1279](https://github.com/DanielXMoore/Civet/pull/1279)]

## 0.7.11 (2024-05-27, [diff](https://github.com/DanielXMoore/Civet/compare/4f7694c40f1df66512107791110a61f1ff7d13ed...e9fdc424edcaeacca280027f97ce130c3aa5d859), [commit](https://github.com/DanielXMoore/Civet/commit/e9fdc424edcaeacca280027f97ce130c3aa5d859))
* Fix source-map-support import with new NodeJS register [[#1265](https://github.com/DanielXMoore/Civet/pull/1265)]
* Update Civet and use try..else feature [[#1266](https://github.com/DanielXMoore/Civet/pull/1266)]
* Fix empty block in pattern matching with implicit return [[#1268](https://github.com/DanielXMoore/Civet/pull/1268)]
* Fix empty then clause in if expressions [[#1269](https://github.com/DanielXMoore/Civet/pull/1269)]
* Fix hoistDec within if expression [[#1270](https://github.com/DanielXMoore/Civet/pull/1270)]
* Revamp automatic async and generator, operator support [[#1271](https://github.com/DanielXMoore/Civet/pull/1271)]
* Sourcemap fix, show diagnostics with nonfatal parse errors [[#1272](https://github.com/DanielXMoore/Civet/pull/1272)]

## 0.7.10 (2024-05-24, [diff](https://github.com/DanielXMoore/Civet/compare/c19114100f8e6e68a90c1cf4d6471b31d4417366...4f7694c40f1df66512107791110a61f1ff7d13ed), [commit](https://github.com/DanielXMoore/Civet/commit/4f7694c40f1df66512107791110a61f1ff7d13ed))
* Use {} for empty if and else blocks [[#1245](https://github.com/DanielXMoore/Civet/pull/1245)]
* Argument magic with `coffeeDo` [[#1246](https://github.com/DanielXMoore/Civet/pull/1246)]
* Fix #1250 - source mapping for AtThis identifier [[#1252](https://github.com/DanielXMoore/Civet/pull/1252)]
* Generous matching of --version, --help [[#1259](https://github.com/DanielXMoore/Civet/pull/1259)]
* Upgrade Playground to modern Prettier [[#1256](https://github.com/DanielXMoore/Civet/pull/1256)]
* Invalid command-line argument handling [[#1257](https://github.com/DanielXMoore/Civet/pull/1257)]
* Fix ASI by handling tokens [[#1260](https://github.com/DanielXMoore/Civet/pull/1260)]
* Fix iteration expression unwrapping in splice assignment [[#1261](https://github.com/DanielXMoore/Civet/pull/1261)]
* Error nodes, ParseErrors get source-mapped location [[#1262](https://github.com/DanielXMoore/Civet/pull/1262)]
* Fix complex negative property access [[#1263](https://github.com/DanielXMoore/Civet/pull/1263)]

## 0.7.9 (2024-05-10, [diff](https://github.com/DanielXMoore/Civet/compare/672cc277aa950ed4408315af9f063eec2c26b06f...c19114100f8e6e68a90c1cf4d6471b31d4417366), [commit](https://github.com/DanielXMoore/Civet/commit/c19114100f8e6e68a90c1cf4d6471b31d4417366))
* Fix `.#x` [[#1237](https://github.com/DanielXMoore/Civet/pull/1237)]
* Config [[#1243](https://github.com/DanielXMoore/Civet/pull/1243)]

## 0.7.8 (2024-05-08, [diff](https://github.com/DanielXMoore/Civet/compare/0912fcbf912caa350e83ed05b0b7947522fd5301...672cc277aa950ed4408315af9f063eec2c26b06f), [commit](https://github.com/DanielXMoore/Civet/commit/672cc277aa950ed4408315af9f063eec2c26b06f))
* Allow EmptyStatement in ClassBody [[#1226](https://github.com/DanielXMoore/Civet/pull/1226)]
* Fix preprocessing of declaration conditions [[#1227](https://github.com/DanielXMoore/Civet/pull/1227)]
* try else blocks [[#1229](https://github.com/DanielXMoore/Civet/pull/1229)]
* Declaration inside unless/until adds declaration after block [[#1228](https://github.com/DanielXMoore/Civet/pull/1228)]
* Fix duplicate property merging for props not actually bound [[#1232](https://github.com/DanielXMoore/Civet/pull/1232)]
* Ampersand fixes [[#1233](https://github.com/DanielXMoore/Civet/pull/1233)]

## 0.7.7 (2024-05-05, [diff](https://github.com/DanielXMoore/Civet/compare/25f90ba669493b9f4ba08c6ee38de0a63de432ad...0912fcbf912caa350e83ed05b0b7947522fd5301), [commit](https://github.com/DanielXMoore/Civet/commit/0912fcbf912caa350e83ed05b0b7947522fd5301))
* Avoid expressionizing statements in fat arrow functions [[#1221](https://github.com/DanielXMoore/Civet/pull/1221)]
* Use context's globals instead of serializing there [[#1220](https://github.com/DanielXMoore/Civet/pull/1220)]
* comptime else blocks, else refactor [[#1222](https://github.com/DanielXMoore/Civet/pull/1222)]

## 0.7.6 (2024-05-05, [diff](https://github.com/DanielXMoore/Civet/compare/bf76cb6e0a624c97a84f3180507aec12a84e5832...25f90ba669493b9f4ba08c6ee38de0a63de432ad), [commit](https://github.com/DanielXMoore/Civet/commit/25f90ba669493b9f4ba08c6ee38de0a63de432ad))
* Avoid implicit return when block guarantees exit [[#1211](https://github.com/DanielXMoore/Civet/pull/1211)]
* ESLint plugin [[#1205](https://github.com/DanielXMoore/Civet/pull/1205)]
* Duplicate helpers in comptime blocks [[#1212](https://github.com/DanielXMoore/Civet/pull/1212)]
* Better require error messages in comptime [[#1214](https://github.com/DanielXMoore/Civet/pull/1214)]
* CLI avoid errors when output pipe gets closed [[#1213](https://github.com/DanielXMoore/Civet/pull/1213)]
* Don't emit newlines before block prefixes [[#1216](https://github.com/DanielXMoore/Civet/pull/1216)]
* throws can specify exception; ParseErrors type; bug fixes [[#1217](https://github.com/DanielXMoore/Civet/pull/1217)]
* eslint: comptime for version, assert instead of with [[#1218](https://github.com/DanielXMoore/Civet/pull/1218)]
* More comptime [[#1219](https://github.com/DanielXMoore/Civet/pull/1219)]

## 0.7.5 (2024-05-03, [diff](https://github.com/DanielXMoore/Civet/compare/061048416eb32662819d289bf774cf5c03ad97e3...bf76cb6e0a624c97a84f3180507aec12a84e5832), [commit](https://github.com/DanielXMoore/Civet/commit/bf76cb6e0a624c97a84f3180507aec12a84e5832))
* Use `is like` in some cases [[#1208](https://github.com/DanielXMoore/Civet/pull/1208)]
* Improve log feedback in VSCode plugin [[#1209](https://github.com/DanielXMoore/Civet/pull/1209)]
* Async compile API with comptime, support require [[#1186](https://github.com/DanielXMoore/Civet/pull/1186)]
* Add LSP warning about using dev Civet [[#1210](https://github.com/DanielXMoore/Civet/pull/1210)]

## 0.7.4 (2024-05-02, [diff](https://github.com/DanielXMoore/Civet/compare/07c588e4e519a138eac895be8f7b642088af2b14...061048416eb32662819d289bf774cf5c03ad97e3), [commit](https://github.com/DanielXMoore/Civet/commit/061048416eb32662819d289bf774cf5c03ad97e3))
* Comptime fixes [[#1204](https://github.com/DanielXMoore/Civet/pull/1204)]
* Detect Error nodes in inlineMap mode [[#1207](https://github.com/DanielXMoore/Civet/pull/1207)]

## 0.7.3 (2024-05-01, [diff](https://github.com/DanielXMoore/Civet/compare/b7b85fecf1d3a8f9b3f398b03797bc4bf0d8f271...07c588e4e519a138eac895be8f7b642088af2b14), [commit](https://github.com/DanielXMoore/Civet/commit/07c588e4e519a138eac895be8f7b642088af2b14))
* Fix handling of empty arrays and objects in patterns [[#1202](https://github.com/DanielXMoore/Civet/pull/1202)]
* (is like ...) section, document "is not like" [[#1203](https://github.com/DanielXMoore/Civet/pull/1203)]

## 0.7.2 (2024-04-29, [diff](https://github.com/DanielXMoore/Civet/compare/19b9868b88ce06e9f28ba5ff5887d82e25246659...b7b85fecf1d3a8f9b3f398b03797bc4bf0d8f271), [commit](https://github.com/DanielXMoore/Civet/commit/b7b85fecf1d3a8f9b3f398b03797bc4bf0d8f271))
* First version of comptime (synchronous, no outer scope) [[#1180](https://github.com/DanielXMoore/Civet/pull/1180)]
* Faster and robust config searching via `readdir` instead of `opendir` [[#1183](https://github.com/DanielXMoore/Civet/pull/1183)]
* Insert "function" into ES6 methods [[#1184](https://github.com/DanielXMoore/Civet/pull/1184)]
* Allow empty body in loops, if/else, do, comptime [[#1187](https://github.com/DanielXMoore/Civet/pull/1187)]
* Fix comptime negative zero [[#1190](https://github.com/DanielXMoore/Civet/pull/1190)]
* Serialize typed arrays and well-known symbols [[#1188](https://github.com/DanielXMoore/Civet/pull/1188)]
* comptime `Object.create null` [[#1192](https://github.com/DanielXMoore/Civet/pull/1192)]
* Comptime classes and generators [[#1194](https://github.com/DanielXMoore/Civet/pull/1194)]
* Comptime function properties [[#1196](https://github.com/DanielXMoore/Civet/pull/1196)]
* Comptime URLs [[#1197](https://github.com/DanielXMoore/Civet/pull/1197)]
* Handle property descriptors (incl. getters/setters) in comptime [[#1198](https://github.com/DanielXMoore/Civet/pull/1198)]
* "is like" pattern matching operator [[#1199](https://github.com/DanielXMoore/Civet/pull/1199)]
* Optional ?:: for coffeePrototype [[#1193](https://github.com/DanielXMoore/Civet/pull/1193)]
* Pattern matching fixes [[#1200](https://github.com/DanielXMoore/Civet/pull/1200)]

## 0.7.1 (2024-04-22, [diff](https://github.com/DanielXMoore/Civet/compare/c6c44284a2dc8ed75070eb8729f20c7ff9d7c29b...19b9868b88ce06e9f28ba5ff5887d82e25246659), [commit](https://github.com/DanielXMoore/Civet/commit/19b9868b88ce06e9f28ba5ff5887d82e25246659))
* Assignment operator sections [[#1174](https://github.com/DanielXMoore/Civet/pull/1174)]
* Fix & in applied (operator) [[#1175](https://github.com/DanielXMoore/Civet/pull/1175)]
* Upgrade CI to Node.js 20 [[#1178](https://github.com/DanielXMoore/Civet/pull/1178)]
* Limit & to return/yield; support indented yield argument [[#1177](https://github.com/DanielXMoore/Civet/pull/1177)]
* Brace block improvements, including `&` statements [[#1179](https://github.com/DanielXMoore/Civet/pull/1179)]

## 0.7.0 (2024-04-20, [diff](https://github.com/DanielXMoore/Civet/compare/667f6a409f89ef8fa138b2f70d790bc9dc66645d...c6c44284a2dc8ed75070eb8729f20c7ff9d7c29b), [commit](https://github.com/DanielXMoore/Civet/commit/c6c44284a2dc8ed75070eb8729f20c7ff9d7c29b))
* New ampersand proposal (#1070) [[#1159](https://github.com/DanielXMoore/Civet/pull/1159)]

## 0.6.93 (2024-04-19, [diff](https://github.com/DanielXMoore/Civet/compare/c8e4356fb9e5ef364aa7016706baec5e36302e5c...667f6a409f89ef8fa138b2f70d790bc9dc66645d), [commit](https://github.com/DanielXMoore/Civet/commit/667f6a409f89ef8fa138b2f70d790bc9dc66645d))
* Fix #1155 by consolidating trailing member access [[#1163](https://github.com/DanielXMoore/Civet/pull/1163)]
* remove old experimental coffee2civet and add bun-civet to ignored coverage [[#1164](https://github.com/DanielXMoore/Civet/pull/1164)]
* `::#` type with `coffeePrototype` [[#1166](https://github.com/DanielXMoore/Civet/pull/1166)]
* Infinite loop detection and no return [[#1165](https://github.com/DanielXMoore/Civet/pull/1165)]
* Pipe assignment to index [[#1167](https://github.com/DanielXMoore/Civet/pull/1167)]
* Improve ASI algorithm [[#1170](https://github.com/DanielXMoore/Civet/pull/1170)]
* Keep new inside partial function [[#1171](https://github.com/DanielXMoore/Civet/pull/1171)]

## 0.6.92 (2024-04-08, [diff](https://github.com/DanielXMoore/Civet/compare/89416c63e19c815f5d5e1e4e5c6fb2da7eaa5921...c8e4356fb9e5ef364aa7016706baec5e36302e5c), [commit](https://github.com/DanielXMoore/Civet/commit/c8e4356fb9e5ef364aa7016706baec5e36302e5c))
* Simplify quoteString for code coverage [[#1156](https://github.com/DanielXMoore/Civet/pull/1156)]
* Fix unary negated literal with unary post [[#1154](https://github.com/DanielXMoore/Civet/pull/1154)]
* Preserve Vite's default extensions [[#1157](https://github.com/DanielXMoore/Civet/pull/1157)]

## 0.6.91 (2024-04-07, [diff](https://github.com/DanielXMoore/Civet/compare/868ce791eef24d5c5097b51b2b73e6b90cf13d9b...89416c63e19c815f5d5e1e4e5c6fb2da7eaa5921), [commit](https://github.com/DanielXMoore/Civet/commit/89416c63e19c815f5d5e1e4e5c6fb2da7eaa5921))
* Late arrow functions like late assignments [[#1142](https://github.com/DanielXMoore/Civet/pull/1142)]
* Fix ASI bug caused by unstructured blockPrefix [[#1143](https://github.com/DanielXMoore/Civet/pull/1143)]
* Fix #1043 - Add missing unary numeric and undefined pin patterns in switch [[#1144](https://github.com/DanielXMoore/Civet/pull/1144)]
* Fix relational chains [[#1146](https://github.com/DanielXMoore/Civet/pull/1146)]
* Infinite range [x..] [[#1148](https://github.com/DanielXMoore/Civet/pull/1148)]
* Partial application placeholders [[#1151](https://github.com/DanielXMoore/Civet/pull/1151)]
* Astro integration based on Vite plugin [[#1153](https://github.com/DanielXMoore/Civet/pull/1153)]

## 0.6.90 (2024-04-03, [diff](https://github.com/DanielXMoore/Civet/compare/8dd331d0cd4347c405d71893aefaf5e10590ffa2...868ce791eef24d5c5097b51b2b73e6b90cf13d9b), [commit](https://github.com/DanielXMoore/Civet/commit/868ce791eef24d5c5097b51b2b73e6b90cf13d9b))
* Don't treat double colon as colon [[#1136](https://github.com/DanielXMoore/Civet/pull/1136)]
* Optional dot before # [[#1137](https://github.com/DanielXMoore/Civet/pull/1137)]
* Prevent `...` as array element in right-hand side [[#1138](https://github.com/DanielXMoore/Civet/pull/1138)]
* Missing insert return after pattern matching statement [[#1141](https://github.com/DanielXMoore/Civet/pull/1141)]
* Nonnull checks in assignment conditions [[#1140](https://github.com/DanielXMoore/Civet/pull/1140)]

## 0.6.89 (2024-04-01, [diff](https://github.com/DanielXMoore/Civet/compare/84bb1a23993aa2cd1aec70f3e7ec212dda4d8949...8dd331d0cd4347c405d71893aefaf5e10590ffa2), [commit](https://github.com/DanielXMoore/Civet/commit/8dd331d0cd4347c405d71893aefaf5e10590ffa2))
* Hoist declarations out of async wrapper and other cleanup [[#1133](https://github.com/DanielXMoore/Civet/pull/1133)]

## 0.6.88 (2024-03-31, [diff](https://github.com/DanielXMoore/Civet/compare/56b5047c1986511aad1a414a0bcc56a7739470d3...84bb1a23993aa2cd1aec70f3e7ec212dda4d8949), [commit](https://github.com/DanielXMoore/Civet/commit/84bb1a23993aa2cd1aec70f3e7ec212dda4d8949))
* Modern NodeJS register and CLI require/import fixes [[#1128](https://github.com/DanielXMoore/Civet/pull/1128)]
* Dynamic import declarations and expressions [[#1130](https://github.com/DanielXMoore/Civet/pull/1130)]

## 0.6.87 (2024-03-29, [diff](https://github.com/DanielXMoore/Civet/compare/343c973a87c35b2b02364719497cd2f7e379c85c...56b5047c1986511aad1a414a0bcc56a7739470d3), [commit](https://github.com/DanielXMoore/Civet/commit/56b5047c1986511aad1a414a0bcc56a7739470d3))
* Signed number literal types, including dropping + [[#1119](https://github.com/DanielXMoore/Civet/pull/1119)]
* TS override support [[#1120](https://github.com/DanielXMoore/Civet/pull/1120)]
* Fix #54 - Optional chain in assignment lhs [[#1117](https://github.com/DanielXMoore/Civet/pull/1117)]

## 0.6.86 (2024-03-21, [diff](https://github.com/DanielXMoore/Civet/compare/92b44050ad10ebc6fb3f49bf6ff4259fb3213d48...343c973a87c35b2b02364719497cd2f7e379c85c), [commit](https://github.com/DanielXMoore/Civet/commit/343c973a87c35b2b02364719497cd2f7e379c85c))
* Fix #1102 - negative index assignment lhs [[#1109](https://github.com/DanielXMoore/Civet/pull/1109)]
* Fix #1101 - reserved word object globs [[#1111](https://github.com/DanielXMoore/Civet/pull/1111)]

## 0.6.85 (2024-03-20, [diff](https://github.com/DanielXMoore/Civet/compare/2e8cbd9084d01b456bbabd96394b6568749fe755...92b44050ad10ebc6fb3f49bf6ff4259fb3213d48), [commit](https://github.com/DanielXMoore/Civet/commit/92b44050ad10ebc6fb3f49bf6ff4259fb3213d48))
* Fix #1098 - if containing for IIFE [[#1103](https://github.com/DanielXMoore/Civet/pull/1103)]
* Fix #1096; Fix #1105; Special operators in assignment rhs [[#1106](https://github.com/DanielXMoore/Civet/pull/1106)]
* Fix #1100 - pipe inside StatementExpression [[#1104](https://github.com/DanielXMoore/Civet/pull/1104)]
* Fix #1107 - pipe to as in JS mode [[#1108](https://github.com/DanielXMoore/Civet/pull/1108)]

## 0.6.84 (2024-03-17, [diff](https://github.com/DanielXMoore/Civet/compare/33be7ee610102b8c7ce485774d45a6067e1ae802...2e8cbd9084d01b456bbabd96394b6568749fe755), [commit](https://github.com/DanielXMoore/Civet/commit/2e8cbd9084d01b456bbabd96394b6568749fe755))
* Fix #1075 - Pattern matching array length type guard [[#1089](https://github.com/DanielXMoore/Civet/pull/1089)]
* Fix #1087 [[#1088](https://github.com/DanielXMoore/Civet/pull/1088)]
* Fix #1091 [[#1093](https://github.com/DanielXMoore/Civet/pull/1093)]
* RestoreAll within template substitution / CoffeeScript interpolation [[#1095](https://github.com/DanielXMoore/Civet/pull/1095)]
* Fix #1097 - for loop over character range [[#1099](https://github.com/DanielXMoore/Civet/pull/1099)]

## 0.6.83 (2024-03-04, [diff](https://github.com/DanielXMoore/Civet/compare/8c8e5a6d3b105f0f8830c4778293aedc1647d26d...33be7ee610102b8c7ce485774d45a6067e1ae802), [commit](https://github.com/DanielXMoore/Civet/commit/33be7ee610102b8c7ce485774d45a6067e1ae802))
* Fix #1065 - pipe to unary word ops; await ops [[#1069](https://github.com/DanielXMoore/Civet/pull/1069)]
* Strings at start of file followed by pipe or access are not prologues [[#1068](https://github.com/DanielXMoore/Civet/pull/1068)]
* Sourcemap improvement [[#1067](https://github.com/DanielXMoore/Civet/pull/1067)]
* Fix #1048 - semicolon before return.value when piping [[#1071](https://github.com/DanielXMoore/Civet/pull/1071)]
* Added comment to forwardMap [[#1073](https://github.com/DanielXMoore/Civet/pull/1073)]
* eliminate dead code [[#1072](https://github.com/DanielXMoore/Civet/pull/1072)]
* #202 - Don't wrap StatementExpressions in IIFE in declaration [[#1074](https://github.com/DanielXMoore/Civet/pull/1074)]
* Added support for nested statement expressions [[#1076](https://github.com/DanielXMoore/Civet/pull/1076)]
* Statement expressions [[#1077](https://github.com/DanielXMoore/Civet/pull/1077)]

## 0.6.82 (2024-02-26, [diff](https://github.com/DanielXMoore/Civet/compare/2f933681843a83ebcc96501fdd2cfd2546e5ace9...8c8e5a6d3b105f0f8830c4778293aedc1647d26d), [commit](https://github.com/DanielXMoore/Civet/commit/8c8e5a6d3b105f0f8830c4778293aedc1647d26d))
* 1053 [[#1059](https://github.com/DanielXMoore/Civet/pull/1059)]
* Fix Playground around top-level await [[#1060](https://github.com/DanielXMoore/Civet/pull/1060)]
* Fix #1058 - Missed 'async' as valid start for iteration expressions in performance opt [[#1063](https://github.com/DanielXMoore/Civet/pull/1063)]
* Add # length shorthand #909 [[#1062](https://github.com/DanielXMoore/Civet/pull/1062)]
* Allow arguments to property bind [[#1064](https://github.com/DanielXMoore/Civet/pull/1064)]
* Add `as tuple` [[#1066](https://github.com/DanielXMoore/Civet/pull/1066)]

## 0.6.81 (2024-02-21, [diff](https://github.com/DanielXMoore/Civet/compare/189e311299763d6afec6b4cccecaf32f4a7de896...2f933681843a83ebcc96501fdd2cfd2546e5ace9), [commit](https://github.com/DanielXMoore/Civet/commit/2f933681843a83ebcc96501fdd2cfd2546e5ace9))
* Force emitting dts files in unplugin [[#1055](https://github.com/DanielXMoore/Civet/pull/1055)]
* Tell Vite virtual module during dependency scanning [[#1056](https://github.com/DanielXMoore/Civet/pull/1056)]

## 0.6.80 (2024-02-21, [diff](https://github.com/DanielXMoore/Civet/compare/50bed6e44d080bfe6650e091b4b7f78786803eb7...189e311299763d6afec6b4cccecaf32f4a7de896), [commit](https://github.com/DanielXMoore/Civet/commit/189e311299763d6afec6b4cccecaf32f4a7de896))
* Fix #1047 - Properly escape newlines in multi-line strings [[#1049](https://github.com/DanielXMoore/Civet/pull/1049)]
* Typechecking allows for extra dependencies beyond build [[#1052](https://github.com/DanielXMoore/Civet/pull/1052)]
* Suppress ESLint `no-cond-assign` with `if const` etc [[#1051](https://github.com/DanielXMoore/Civet/pull/1051)]
* Add esbuild unplugin to Vite's optimizeDeps [[#1054](https://github.com/DanielXMoore/Civet/pull/1054)]

## 0.6.79 (2024-02-20, [diff](https://github.com/DanielXMoore/Civet/compare/ce949424b2dfff5cc8cb40a217d78cd718de9acb...50bed6e44d080bfe6650e091b4b7f78786803eb7), [commit](https://github.com/DanielXMoore/Civet/commit/50bed6e44d080bfe6650e091b4b7f78786803eb7))
* Snapshots similar to how Vue language tools does [[#1042](https://github.com/DanielXMoore/Civet/pull/1042)]
* log diagnostics timing [[#1045](https://github.com/DanielXMoore/Civet/pull/1045)]
* Non-transpiled files weren't being added to the path map causing them… [[#1044](https://github.com/DanielXMoore/Civet/pull/1044)]
* Don't relativize paths in unplugin [[#1046](https://github.com/DanielXMoore/Civet/pull/1046)]

## 0.6.78 (2024-02-19, [diff](https://github.com/DanielXMoore/Civet/compare/5a666bbb8cdf0d70f23030ecdd942be600abd440...ce949424b2dfff5cc8cb40a217d78cd718de9acb), [commit](https://github.com/DanielXMoore/Civet/commit/ce949424b2dfff5cc8cb40a217d78cd718de9acb))
* Avoid double semicolon in then clause [[#1041](https://github.com/DanielXMoore/Civet/pull/1041)]

## 0.6.77 (2024-02-19, [diff](https://github.com/DanielXMoore/Civet/compare/b5a1e5413ebde5b9b28620734ceb2a80a0c93348...5a666bbb8cdf0d70f23030ecdd942be600abd440), [commit](https://github.com/DanielXMoore/Civet/commit/5a666bbb8cdf0d70f23030ecdd942be600abd440))
* ignore coverage for parser/types.civet [[#1032](https://github.com/DanielXMoore/Civet/pull/1032)]
* Working towards discriminated union for nodes and type predicates for traversal [[#1033](https://github.com/DanielXMoore/Civet/pull/1033)]
* Automatic TS jsx setting in unplugin and CLI [[#1039](https://github.com/DanielXMoore/Civet/pull/1039)]
* More custom operator precedence [[#1038](https://github.com/DanielXMoore/Civet/pull/1038)]

## 0.6.76 (2024-02-18, [diff](https://github.com/DanielXMoore/Civet/compare/6bd3df1bf6f950e2f5c00d54ae1b7b8feb88288f...b5a1e5413ebde5b9b28620734ceb2a80a0c93348), [commit](https://github.com/DanielXMoore/Civet/commit/b5a1e5413ebde5b9b28620734ceb2a80a0c93348))
* Split lib.civet into many files [[#1026](https://github.com/DanielXMoore/Civet/pull/1026)]
* Fix CLI typecheck import mapping [[#1030](https://github.com/DanielXMoore/Civet/pull/1030)]
* xor precedence above || [[#1029](https://github.com/DanielXMoore/Civet/pull/1029)]
* Custom operator precedence [[#1031](https://github.com/DanielXMoore/Civet/pull/1031)]

## 0.6.75 (2024-02-18, [diff](https://github.com/DanielXMoore/Civet/compare/f48c21a64b12b33d802ad446cefeda21ec174fd6...6bd3df1bf6f950e2f5c00d54ae1b7b8feb88288f), [commit](https://github.com/DanielXMoore/Civet/commit/6bd3df1bf6f950e2f5c00d54ae1b7b8feb88288f))
* Typechecking CLI [[#1023](https://github.com/DanielXMoore/Civet/pull/1023)]
* Fix #900 - Declaration condition in switch statements w/ nested binop [[#1024](https://github.com/DanielXMoore/Civet/pull/1024)]
* Made some more progress on internal typings [[#1025](https://github.com/DanielXMoore/Civet/pull/1025)]
* Cleanup non-null assertion handling [[#1027](https://github.com/DanielXMoore/Civet/pull/1027)]

## 0.6.74 (2024-02-17, [diff](https://github.com/DanielXMoore/Civet/compare/d129ed2f4fe0f652b9d0c147597e6e834e238326...f48c21a64b12b33d802ad446cefeda21ec174fd6), [commit](https://github.com/DanielXMoore/Civet/commit/f48c21a64b12b33d802ad446cefeda21ec174fd6))
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

## 0.6.73 (2024-02-15, [diff](https://github.com/DanielXMoore/Civet/compare/724826bdd9a44bf7df248680b4003b5276853671...d129ed2f4fe0f652b9d0c147597e6e834e238326), [commit](https://github.com/DanielXMoore/Civet/commit/d129ed2f4fe0f652b9d0c147597e6e834e238326))
* Fix triple slash in pattern matching switch [[#991](https://github.com/DanielXMoore/Civet/pull/991)]
* Report error nodes in LSP [[#992](https://github.com/DanielXMoore/Civet/pull/992)]
* Update code around pattern matching to civet style [[#993](https://github.com/DanielXMoore/Civet/pull/993)]
* Consistent arrow vs. pipe precedence [[#994](https://github.com/DanielXMoore/Civet/pull/994)]
* Avoid implicit returns from fat arrows [[#996](https://github.com/DanielXMoore/Civet/pull/996)]
* Allow multiple props per line in implicit object literals [[#997](https://github.com/DanielXMoore/Civet/pull/997)]
* Don't create empty var decs with auto-var [[#1000](https://github.com/DanielXMoore/Civet/pull/1000)]
* Fix cached node mutation when removing trailing comma from rest property [[#1001](https://github.com/DanielXMoore/Civet/pull/1001)]

## 0.6.72 (2024-02-12, [diff](https://github.com/DanielXMoore/Civet/compare/cf10dbe568eced93bc573089d80847b8670b5621...724826bdd9a44bf7df248680b4003b5276853671), [commit](https://github.com/DanielXMoore/Civet/commit/724826bdd9a44bf7df248680b4003b5276853671))
* Fix private field glob getters [[#977](https://github.com/DanielXMoore/Civet/pull/977)]
* Fix spread bug extracted from lib.civet [[#982](https://github.com/DanielXMoore/Civet/pull/982)]
* export default shorthand [[#981](https://github.com/DanielXMoore/Civet/pull/981)]
* perf-compare improvements [[#983](https://github.com/DanielXMoore/Civet/pull/983)]
* Allow enums on one line [[#980](https://github.com/DanielXMoore/Civet/pull/980)]
* Fix TS infer, extends, typeof [[#986](https://github.com/DanielXMoore/Civet/pull/986)]
* Support "Error" nodes in Playground [[#987](https://github.com/DanielXMoore/Civet/pull/987)]

## 0.6.71 (2024-02-10, [diff](https://github.com/DanielXMoore/Civet/compare/ee1ac2f117350d67a706c7a2b5ff0294f0d5f4f6...cf10dbe568eced93bc573089d80847b8670b5621), [commit](https://github.com/DanielXMoore/Civet/commit/cf10dbe568eced93bc573089d80847b8670b5621))
* Typed ampersand function improvements [[#969](https://github.com/DanielXMoore/Civet/pull/969)]
* Fix concatAssign for arrays [[#972](https://github.com/DanielXMoore/Civet/pull/972)]
* TypeScript's `import ... = require(...)` and `export = ...` [[#975](https://github.com/DanielXMoore/Civet/pull/975)]
* CLI import rewriting, --civet option, cleanup [[#974](https://github.com/DanielXMoore/Civet/pull/974)]
* Nested vs. implicit vs. inline object literals [[#976](https://github.com/DanielXMoore/Civet/pull/976)]

## 0.6.70 (2024-02-08, [diff](https://github.com/DanielXMoore/Civet/compare/eac86d4e81842090c79bfb1f61945b19d2055784...ee1ac2f117350d67a706c7a2b5ff0294f0d5f4f6), [commit](https://github.com/DanielXMoore/Civet/commit/ee1ac2f117350d67a706c7a2b5ff0294f0d5f4f6))
* Port CLI to more modern Civet [[#950](https://github.com/DanielXMoore/Civet/pull/950)]
* Fix ASI with one-argument (+) application [[#960](https://github.com/DanielXMoore/Civet/pull/960)]
* Allow return.value in pipeline [[#961](https://github.com/DanielXMoore/Civet/pull/961)]
* Allow return type annotation in getter shorthand [[#962](https://github.com/DanielXMoore/Civet/pull/962)]
* Fix object getters with globs [[#964](https://github.com/DanielXMoore/Civet/pull/964)]

## 0.6.69 (2024-02-08, [diff](https://github.com/DanielXMoore/Civet/compare/759017a1e9bd70d26a924830e403dec0841abc78...eac86d4e81842090c79bfb1f61945b19d2055784), [commit](https://github.com/DanielXMoore/Civet/commit/eac86d4e81842090c79bfb1f61945b19d2055784))
* Operators as functions via parens [[#948](https://github.com/DanielXMoore/Civet/pull/948)]
* Add em dash for decrement [[#953](https://github.com/DanielXMoore/Civet/pull/953)]
* Cleanup Call arguments AST, fix (+) processing [[#955](https://github.com/DanielXMoore/Civet/pull/955)]

## 0.6.68 (2024-02-06, [diff](https://github.com/DanielXMoore/Civet/compare/0590ec470d682423aced9d50cf8c74e4dd8ddb0a...759017a1e9bd70d26a924830e403dec0841abc78), [commit](https://github.com/DanielXMoore/Civet/commit/759017a1e9bd70d26a924830e403dec0841abc78))
* Test validity of JS/TS outputs via esbuild parsing [[#932](https://github.com/DanielXMoore/Civet/pull/932)]
* Shorthand for type indexed access [[#945](https://github.com/DanielXMoore/Civet/pull/945)]
* `!op` shorthand for `not op` [[#946](https://github.com/DanielXMoore/Civet/pull/946)]

## 0.6.67 (2024-02-05, [diff](https://github.com/DanielXMoore/Civet/compare/fd55f387436a385f7d90d88ff6c63951805c7456...0590ec470d682423aced9d50cf8c74e4dd8ddb0a), [commit](https://github.com/DanielXMoore/Civet/commit/0590ec470d682423aced9d50cf8c74e4dd8ddb0a))
* Support TS instantiation expressions [[#940](https://github.com/DanielXMoore/Civet/pull/940)]
* Hera ESM support [[#942](https://github.com/DanielXMoore/Civet/pull/942)]
* Playground eval [[#941](https://github.com/DanielXMoore/Civet/pull/941)]

## 0.6.66 (2024-02-01, [diff](https://github.com/DanielXMoore/Civet/compare/562aff7199268f32fd8a2d4794446f7e686f2aaa...fd55f387436a385f7d90d88ff6c63951805c7456), [commit](https://github.com/DanielXMoore/Civet/commit/fd55f387436a385f7d90d88ff6c63951805c7456))
* TS typeof allow for arbitrary expressions, not just types [[#935](https://github.com/DanielXMoore/Civet/pull/935)]
* Fix ASI with pipes [[#937](https://github.com/DanielXMoore/Civet/pull/937)]
* Fix array of objects type [[#936](https://github.com/DanielXMoore/Civet/pull/936)]

## 0.6.65 (2024-01-30, [diff](https://github.com/DanielXMoore/Civet/compare/17f6ddb893a932f543e6b99e2e3a9987e1811e5b...562aff7199268f32fd8a2d4794446f7e686f2aaa), [commit](https://github.com/DanielXMoore/Civet/commit/562aff7199268f32fd8a2d4794446f7e686f2aaa))
* Fix optional property access shorthand [[#931](https://github.com/DanielXMoore/Civet/pull/931)]

## 0.6.64 (2024-01-26, [diff](https://github.com/DanielXMoore/Civet/compare/5808b792571c805019bd409a4e612067a3134d76...17f6ddb893a932f543e6b99e2e3a9987e1811e5b), [commit](https://github.com/DanielXMoore/Civet/commit/17f6ddb893a932f543e6b99e2e3a9987e1811e5b))
* Fail on TypeScript errors, or specified types [[#928](https://github.com/DanielXMoore/Civet/pull/928)]

## 0.6.63 (2024-01-24, [diff](https://github.com/DanielXMoore/Civet/compare/fd50eb0cd6bdaa7cef3456dc7c82a70a499472ed...5808b792571c805019bd409a4e612067a3134d76), [commit](https://github.com/DanielXMoore/Civet/commit/5808b792571c805019bd409a4e612067a3134d76))
* Wrap thick pipes in parens [[#916](https://github.com/DanielXMoore/Civet/pull/916)]
* Support TypeScript `paths` alias [[#921](https://github.com/DanielXMoore/Civet/pull/921)]
* LSP support importing directories with index.civet [[#923](https://github.com/DanielXMoore/Civet/pull/923)]
* LSP pass on more completion info [[#924](https://github.com/DanielXMoore/Civet/pull/924)]
* Fix ts: 'tsc' behavior around sourcemaps [[#926](https://github.com/DanielXMoore/Civet/pull/926)]
* Use .tsx extension for TypeScript type checking [[#927](https://github.com/DanielXMoore/Civet/pull/927)]

## 0.6.62 (2024-01-05, [diff](https://github.com/DanielXMoore/Civet/compare/908b83cc93b98add83a213580961b5a8233928cc...fd50eb0cd6bdaa7cef3456dc7c82a70a499472ed), [commit](https://github.com/DanielXMoore/Civet/commit/fd50eb0cd6bdaa7cef3456dc7c82a70a499472ed))
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

## 0.6.61 (2023-12-26, [diff](https://github.com/DanielXMoore/Civet/compare/bfa20986113ec0bba19134626af3b62b581c4f94...908b83cc93b98add83a213580961b5a8233928cc), [commit](https://github.com/DanielXMoore/Civet/commit/908b83cc93b98add83a213580961b5a8233928cc))
* Fix unplugin emitDeclaration and Windows behavior [[#895](https://github.com/DanielXMoore/Civet/pull/895)]

## 0.6.60 (2023-12-22, [diff](https://github.com/DanielXMoore/Civet/compare/1b900203689d07f34353d330c2ccba759795d645...bfa20986113ec0bba19134626af3b62b581c4f94), [commit](https://github.com/DanielXMoore/Civet/commit/bfa20986113ec0bba19134626af3b62b581c4f94))
* Use .-1 notation in Civet source [[#879](https://github.com/DanielXMoore/Civet/pull/879)]
* Update font; tagline [[#880](https://github.com/DanielXMoore/Civet/pull/880)]
* docs: Revise tagline, opening paragraph, and purple [[#882](https://github.com/DanielXMoore/Civet/pull/882)]
* Allow arbitrary unary operators before ampersand function notation [[#883](https://github.com/DanielXMoore/Civet/pull/883)]
* `[a ... b]` is a range, `[a ...b]` is implicit call [[#884](https://github.com/DanielXMoore/Civet/pull/884)]
* Stricter unary operators (before &) [[#886](https://github.com/DanielXMoore/Civet/pull/886)]
* Fix ASI before ranges [[#890](https://github.com/DanielXMoore/Civet/pull/890)]

## 0.6.59 (2023-12-18, [diff](https://github.com/DanielXMoore/Civet/compare/e5e1cfd29021100b82fb788a0325e2c392f3c285...1b900203689d07f34353d330c2ccba759795d645), [commit](https://github.com/DanielXMoore/Civet/commit/1b900203689d07f34353d330c2ccba759795d645))
* Update docs style [[#871](https://github.com/DanielXMoore/Civet/pull/871)]
* Color tweaks to improve contrast [[#874](https://github.com/DanielXMoore/Civet/pull/874)]
* Fix while(cond) without space [[#875](https://github.com/DanielXMoore/Civet/pull/875)]
* Omit obviously unreachable breaks from switch [[#876](https://github.com/DanielXMoore/Civet/pull/876)]
* Support x?.-1 and other optional fancy accesses [[#877](https://github.com/DanielXMoore/Civet/pull/877)]
* svg backgrounds [[#878](https://github.com/DanielXMoore/Civet/pull/878)]

## 0.6.58 (2023-12-17, [diff](https://github.com/DanielXMoore/Civet/compare/f482df037a47543517587fbdb9cdb3689f6b663d...e5e1cfd29021100b82fb788a0325e2c392f3c285), [commit](https://github.com/DanielXMoore/Civet/commit/e5e1cfd29021100b82fb788a0325e2c392f3c285))
* Fix implicit generators in assigned -> functions [[#865](https://github.com/DanielXMoore/Civet/pull/865)]
* Omit return with Iterator/Generator<*, void> type [[#866](https://github.com/DanielXMoore/Civet/pull/866)]
* Handle labeled loops [[#867](https://github.com/DanielXMoore/Civet/pull/867)]
* Add angle brackets to surroundingPairs [[#868](https://github.com/DanielXMoore/Civet/pull/868)]

## 0.6.57 (2023-12-17, [diff](https://github.com/DanielXMoore/Civet/compare/40763a0f552db678e9e4d216d1100794c87f1499...f482df037a47543517587fbdb9cdb3689f6b663d), [commit](https://github.com/DanielXMoore/Civet/commit/f482df037a47543517587fbdb9cdb3689f6b663d))
* handleHotUpdate to fix Vite HMR (watch in dev mode) [[#860](https://github.com/DanielXMoore/Civet/pull/860)]
* Support implicit .civet importing unless implicitExtension: false [[#859](https://github.com/DanielXMoore/Civet/pull/859)]

## 0.6.56 (2023-12-15, [diff](https://github.com/DanielXMoore/Civet/compare/bb1fb54ed7eae99dccb99b16f736f6b19ad61000...40763a0f552db678e9e4d216d1100794c87f1499), [commit](https://github.com/DanielXMoore/Civet/commit/40763a0f552db678e9e4d216d1100794c87f1499))
* Fix #833: Add newline after trailing comment in implicit braced blocks [[#851](https://github.com/DanielXMoore/Civet/pull/851)]
* Fix #853: catch clause with extra space [[#856](https://github.com/DanielXMoore/Civet/pull/856)]
* Fix #850: Wrap parens around thick pipes with refs in declarations [[#855](https://github.com/DanielXMoore/Civet/pull/855)]
* Fix sourcemap issue in unplugin (#846) [[#857](https://github.com/DanielXMoore/Civet/pull/857)]

## 0.6.55 (2023-12-11, [diff](https://github.com/DanielXMoore/Civet/compare/e56f3333f357e2fcd88dab320b07fb960e25755b...bb1fb54ed7eae99dccb99b16f736f6b19ad61000), [commit](https://github.com/DanielXMoore/Civet/commit/bb1fb54ed7eae99dccb99b16f736f6b19ad61000))
* Add bracket/comments matching to vscode plugin [[#835](https://github.com/DanielXMoore/Civet/pull/835)]
* Allow multiple patterns over multiple lines with comma [[#838](https://github.com/DanielXMoore/Civet/pull/838)]
* Fix #839: for each of declaration with auto-let [[#841](https://github.com/DanielXMoore/Civet/pull/841)]
* Import attributes [[#848](https://github.com/DanielXMoore/Civet/pull/848)]
* Fix special relational operator precedence [[#843](https://github.com/DanielXMoore/Civet/pull/843)]

## 0.6.54 (2023-12-06, [diff](https://github.com/DanielXMoore/Civet/compare/fc0aea12259f6052a50393c283f73909669798b4...e56f3333f357e2fcd88dab320b07fb960e25755b), [commit](https://github.com/DanielXMoore/Civet/commit/e56f3333f357e2fcd88dab320b07fb960e25755b))
* Generalize pin expressions to allow x.y and ^x.y [[#834](https://github.com/DanielXMoore/Civet/pull/834)]

## 0.6.53 (2023-12-05, [diff](https://github.com/DanielXMoore/Civet/compare/127770783440b47e3611983b86c72425014747f1...fc0aea12259f6052a50393c283f73909669798b4), [commit](https://github.com/DanielXMoore/Civet/commit/fc0aea12259f6052a50393c283f73909669798b4))
* Fix unplugin Typescript builds and update API [[#810](https://github.com/DanielXMoore/Civet/pull/810)]
* Fix snug `x<y` [[#830](https://github.com/DanielXMoore/Civet/pull/830)]
* Fix #72. Reset service when tsconfig changes [[#807](https://github.com/DanielXMoore/Civet/pull/807)]

## 0.6.52 (2023-11-25, [diff](https://github.com/DanielXMoore/Civet/compare/2bcb609195626397195d1abeba73bf1951c4a58a...127770783440b47e3611983b86c72425014747f1), [commit](https://github.com/DanielXMoore/Civet/commit/127770783440b47e3611983b86c72425014747f1))
* Fix Promise<void> in non-async function [[#815](https://github.com/DanielXMoore/Civet/pull/815)]
* Indented function parameters [[#816](https://github.com/DanielXMoore/Civet/pull/816)]
* Assignments in & functions [[#817](https://github.com/DanielXMoore/Civet/pull/817)]
* Type arguments in template literals [[#820](https://github.com/DanielXMoore/Civet/pull/820)]

## 0.6.51 (2023-11-22, [diff](https://github.com/DanielXMoore/Civet/compare/7a48643419638b52ec7bf16926e941d219150cc3...2bcb609195626397195d1abeba73bf1951c4a58a), [commit](https://github.com/DanielXMoore/Civet/commit/2bcb609195626397195d1abeba73bf1951c4a58a))
* Check for existence of absolute path in unplugin [[#797](https://github.com/DanielXMoore/Civet/pull/797)]
* Added references to lsp [[#801](https://github.com/DanielXMoore/Civet/pull/801)]
* Update xor typing [[#799](https://github.com/DanielXMoore/Civet/pull/799)]
* Fix #705 [[#802](https://github.com/DanielXMoore/Civet/pull/802)]

## 0.6.50 (2023-11-06, [diff](https://github.com/DanielXMoore/Civet/compare/50318d7eff1ed0862957aa8857ac24853b1eecb2...7a48643419638b52ec7bf16926e941d219150cc3), [commit](https://github.com/DanielXMoore/Civet/commit/7a48643419638b52ec7bf16926e941d219150cc3))
* Forbid comma operator in one-line thin arrow functions [[#795](https://github.com/DanielXMoore/Civet/pull/795)]
* Fix #704; better open paren whitespace handling in type declarations [[#796](https://github.com/DanielXMoore/Civet/pull/796)]

## 0.6.49 (2023-11-05, [diff](https://github.com/DanielXMoore/Civet/compare/e062bdcc5708ce245093d882d18f9627040a5d79...50318d7eff1ed0862957aa8857ac24853b1eecb2), [commit](https://github.com/DanielXMoore/Civet/commit/50318d7eff1ed0862957aa8857ac24853b1eecb2))
* Fix #792: TryExpression in conditional declaration [[#793](https://github.com/DanielXMoore/Civet/pull/793)]
* Update more parent pointers along the way [[#794](https://github.com/DanielXMoore/Civet/pull/794)]

## 0.6.48 (2023-10-30, [diff](https://github.com/DanielXMoore/Civet/compare/6ba10ecd03757fcca7d0861aec54617d5dad00ed...e062bdcc5708ce245093d882d18f9627040a5d79), [commit](https://github.com/DanielXMoore/Civet/commit/e062bdcc5708ce245093d882d18f9627040a5d79))
* unplugin calls addWatchFile [[#780](https://github.com/DanielXMoore/Civet/pull/780)]
* Simpler implementation of comments near Civet directives [[#790](https://github.com/DanielXMoore/Civet/pull/790)]
* Allow -.1 as decimal literal [[#788](https://github.com/DanielXMoore/Civet/pull/788)]

## 0.6.47 (2023-10-27, [diff](https://github.com/DanielXMoore/Civet/compare/463047eade444d95e38bc5b61f6cf78df6b7737e...6ba10ecd03757fcca7d0861aec54617d5dad00ed), [commit](https://github.com/DanielXMoore/Civet/commit/6ba10ecd03757fcca7d0861aec54617d5dad00ed))
* Allow comments near Civet directives [[#783](https://github.com/DanielXMoore/Civet/pull/783)]
* Fix unplugin path resolution (#774) [[#786](https://github.com/DanielXMoore/Civet/pull/786)]
* Transform Vite HTML imports for Civet [[#785](https://github.com/DanielXMoore/Civet/pull/785)]

## 0.6.46 (2023-10-21, [diff](https://github.com/DanielXMoore/Civet/compare/7b08e01197ec6e770f410d60c51bddaf4e1ff922...463047eade444d95e38bc5b61f6cf78df6b7737e), [commit](https://github.com/DanielXMoore/Civet/commit/463047eade444d95e38bc5b61f6cf78df6b7737e))
* unplugin transformInclude to avoid transforming unrelated files [[#784](https://github.com/DanielXMoore/Civet/pull/784)]

## 0.6.45 (2023-10-16, [diff](https://github.com/DanielXMoore/Civet/compare/df765aa0c4ee74089a10b95f56cd51de38587a22...7b08e01197ec6e770f410d60c51bddaf4e1ff922), [commit](https://github.com/DanielXMoore/Civet/commit/7b08e01197ec6e770f410d60c51bddaf4e1ff922))

## 0.6.44 (2023-10-16, [diff](https://github.com/DanielXMoore/Civet/compare/0a99a72b029afc790f97c9390c7ecd6b9600bbfb...df765aa0c4ee74089a10b95f56cd51de38587a22), [commit](https://github.com/DanielXMoore/Civet/commit/df765aa0c4ee74089a10b95f56cd51de38587a22))
* Perf4 [[#772](https://github.com/DanielXMoore/Civet/pull/772)]
* Fix #755: ampersand blocks with coffee compat [[#777](https://github.com/DanielXMoore/Civet/pull/777)]
* Default type for `return` declaration [[#778](https://github.com/DanielXMoore/Civet/pull/778)]
* Fix #643 [[#781](https://github.com/DanielXMoore/Civet/pull/781)]

## 0.6.43 (2023-10-06, [diff](https://github.com/DanielXMoore/Civet/compare/279c76720f251870118a0fdc6224f5b888dd6f66...0a99a72b029afc790f97c9390c7ecd6b9600bbfb), [commit](https://github.com/DanielXMoore/Civet/commit/0a99a72b029afc790f97c9390c7ecd6b9600bbfb))
* fixed line continuation edge case [[#768](https://github.com/DanielXMoore/Civet/pull/768)]
* refactor property access patterns; 0.7% perf improvement [[#770](https://github.com/DanielXMoore/Civet/pull/770)]
* Perf3 [[#771](https://github.com/DanielXMoore/Civet/pull/771)]

## 0.6.42 (2023-10-04, [diff](https://github.com/DanielXMoore/Civet/compare/c6c9b48647e9c64b6a63e61bdfc4cbf7e01c6af3...279c76720f251870118a0fdc6224f5b888dd6f66), [commit](https://github.com/DanielXMoore/Civet/commit/279c76720f251870118a0fdc6224f5b888dd6f66))
* Allow newline before ...rest parameter [[#761](https://github.com/DanielXMoore/Civet/pull/761)]
* Parenthesize if expressions, remove other excess parens [[#762](https://github.com/DanielXMoore/Civet/pull/762)]
* ~10% perf boost by adding some short circuit assertions [[#764](https://github.com/DanielXMoore/Civet/pull/764)]
* Make ts-diagnostic.civet independent of vscode dependencies [[#766](https://github.com/DanielXMoore/Civet/pull/766)]

## 0.6.41 (2023-09-30, [diff](https://github.com/DanielXMoore/Civet/compare/e84586ec4e0017ad3cbd4001d0cdcac625d2c4ec...c6c9b48647e9c64b6a63e61bdfc4cbf7e01c6af3), [commit](https://github.com/DanielXMoore/Civet/commit/c6c9b48647e9c64b6a63e61bdfc4cbf7e01c6af3))

## 0.6.40 (2023-09-30, [diff](https://github.com/DanielXMoore/Civet/compare/612a2af5bdebe116b40b8b768558dbe209fd21f8...e84586ec4e0017ad3cbd4001d0cdcac625d2c4ec), [commit](https://github.com/DanielXMoore/Civet/commit/e84586ec4e0017ad3cbd4001d0cdcac625d2c4ec))
* Fix #715; Parens around update assignments [[#748](https://github.com/DanielXMoore/Civet/pull/748)]
* Mild opt [[#749](https://github.com/DanielXMoore/Civet/pull/749)]
* Fix indexOf type signature [[#752](https://github.com/DanielXMoore/Civet/pull/752)]
* Support comments before directives [[#754](https://github.com/DanielXMoore/Civet/pull/754)]
* Remove common indentation of triple quotes [[#758](https://github.com/DanielXMoore/Civet/pull/758)]

## 0.6.39 (2023-09-23, [diff](https://github.com/DanielXMoore/Civet/compare/19233aad949903d4e1da123ec2b97a2b3278f411...612a2af5bdebe116b40b8b768558dbe209fd21f8), [commit](https://github.com/DanielXMoore/Civet/commit/612a2af5bdebe116b40b8b768558dbe209fd21f8))
* properly encoding js import source [[#736](https://github.com/DanielXMoore/Civet/pull/736)]
* Fix #522: default to JSX preserve for ts config in LSP [[#739](https://github.com/DanielXMoore/Civet/pull/739)]
* LSP Build refactor [[#737](https://github.com/DanielXMoore/Civet/pull/737)]
* basic parser tracing [[#721](https://github.com/DanielXMoore/Civet/pull/721)]
* Fix go to definition [[#738](https://github.com/DanielXMoore/Civet/pull/738)]
* convert build to civet style [[#740](https://github.com/DanielXMoore/Civet/pull/740)]
* Unbundled only works in debug mode [[#741](https://github.com/DanielXMoore/Civet/pull/741)]
* Fix #733; Allow postfixed expressions in array literals [[#746](https://github.com/DanielXMoore/Civet/pull/746)]
* Fix #743; Paren-less for expression with more complex increment [[#747](https://github.com/DanielXMoore/Civet/pull/747)]

## 0.6.38 (2023-09-16, [diff](https://github.com/DanielXMoore/Civet/compare/f8133592ac71b3b4532fa3db8658d4af63679790...19233aad949903d4e1da123ec2b97a2b3278f411), [commit](https://github.com/DanielXMoore/Civet/commit/19233aad949903d4e1da123ec2b97a2b3278f411))
* Files for testing bun plugin [[#725](https://github.com/DanielXMoore/Civet/pull/725)]
* Fix #714 [[#724](https://github.com/DanielXMoore/Civet/pull/724)]
* Fix 'not in' after logical binop [[#729](https://github.com/DanielXMoore/Civet/pull/729)]
* Fix #726: declaration condition in switch [[#728](https://github.com/DanielXMoore/Civet/pull/728)]
* Fix #104: correct syntax highlight for '.=' [[#730](https://github.com/DanielXMoore/Civet/pull/730)]
* Add type-checking to unplugin [[#689](https://github.com/DanielXMoore/Civet/pull/689)]
* docs: Fix bun plugin link [[#731](https://github.com/DanielXMoore/Civet/pull/731)]
* sourcemap fix [[#734](https://github.com/DanielXMoore/Civet/pull/734)]
* Cli update [[#735](https://github.com/DanielXMoore/Civet/pull/735)]

## 0.6.37 (2023-09-11, [diff](https://github.com/DanielXMoore/Civet/compare/07a8da9fc291cb54c7fe54999ee1e9f9d064a441...f8133592ac71b3b4532fa3db8658d4af63679790), [commit](https://github.com/DanielXMoore/Civet/commit/f8133592ac71b3b4532fa3db8658d4af63679790))
* Fix #503: TS `using` [[#722](https://github.com/DanielXMoore/Civet/pull/722)]

## 0.6.36 (2023-09-10, [diff](https://github.com/DanielXMoore/Civet/compare/c83ac2d1d84af473192c9bb83bf10952644c9148...07a8da9fc291cb54c7fe54999ee1e9f9d064a441), [commit](https://github.com/DanielXMoore/Civet/commit/07a8da9fc291cb54c7fe54999ee1e9f9d064a441))
* Unify pattern matching and declaration conditions [[#717](https://github.com/DanielXMoore/Civet/pull/717)]

## 0.6.35 (2023-09-10, [diff](https://github.com/DanielXMoore/Civet/compare/d83faf10060323b45649b9b378a4f2ee5d5f1058...c83ac2d1d84af473192c9bb83bf10952644c9148), [commit](https://github.com/DanielXMoore/Civet/commit/c83ac2d1d84af473192c9bb83bf10952644c9148))
* Fix #629: Unary op with late assignment [[#716](https://github.com/DanielXMoore/Civet/pull/716)]
* Reference [[#685](https://github.com/DanielXMoore/Civet/pull/685)]
* get/set method shorthand [[#637](https://github.com/DanielXMoore/Civet/pull/637)]
* Warning-free hack for ergonomic require of cjs esbuild plugin [[#718](https://github.com/DanielXMoore/Civet/pull/718)]
* Fix #719: existential property glob and get/set shorthand with existential glob [[#720](https://github.com/DanielXMoore/Civet/pull/720)]

## 0.6.34 (2023-09-08, [diff](https://github.com/DanielXMoore/Civet/compare/901b147797c61cd56a580bbde0a6b3ee1a6a2e18...d83faf10060323b45649b9b378a4f2ee5d5f1058), [commit](https://github.com/DanielXMoore/Civet/commit/d83faf10060323b45649b9b378a4f2ee5d5f1058))

## 0.6.33 (2023-09-08, [diff](https://github.com/DanielXMoore/Civet/compare/46fb198afcc93be6c5b76e01503037259de8abe1...901b147797c61cd56a580bbde0a6b3ee1a6a2e18), [commit](https://github.com/DanielXMoore/Civet/commit/901b147797c61cd56a580bbde0a6b3ee1a6a2e18))
* Underflowing arrays is a perf killer [[#711](https://github.com/DanielXMoore/Civet/pull/711)]

## 0.6.32 (2023-09-08, [diff](https://github.com/DanielXMoore/Civet/compare/0ba803c80c78c6ae889509c8ceb30f992391dad2...46fb198afcc93be6c5b76e01503037259de8abe1), [commit](https://github.com/DanielXMoore/Civet/commit/46fb198afcc93be6c5b76e01503037259de8abe1))
* Fix #702: assignment dec in postfix if [[#703](https://github.com/DanielXMoore/Civet/pull/703)]
* Fix #701 [[#710](https://github.com/DanielXMoore/Civet/pull/710)]
* Fix #691: unary not with existential [[#709](https://github.com/DanielXMoore/Civet/pull/709)]

## 0.6.31 (2023-09-04, [diff](https://github.com/DanielXMoore/Civet/compare/ccb8eafb179bdedde4ddf6ddaabde3fa73d6a0e9...0ba803c80c78c6ae889509c8ceb30f992391dad2), [commit](https://github.com/DanielXMoore/Civet/commit/0ba803c80c78c6ae889509c8ceb30f992391dad2))
* Fix #699 void arrow functions shouldn't implicitly return [[#700](https://github.com/DanielXMoore/Civet/pull/700)]

## 0.6.30 (2023-09-03, [diff](https://github.com/DanielXMoore/Civet/compare/f0fd132e6d4293a3b83edc410427bb9e38d80efd...ccb8eafb179bdedde4ddf6ddaabde3fa73d6a0e9), [commit](https://github.com/DanielXMoore/Civet/commit/ccb8eafb179bdedde4ddf6ddaabde3fa73d6a0e9))
* Fix #692: proper handling of re-alaised binding properties [[#698](https://github.com/DanielXMoore/Civet/pull/698)]
* Fix #695; consolidate method and function returns [[#696](https://github.com/DanielXMoore/Civet/pull/696)]
* Fix #504; single binding pattern parameter arrow function shorthand [[#697](https://github.com/DanielXMoore/Civet/pull/697)]

## 0.6.29 (2023-09-02, [diff](https://github.com/DanielXMoore/Civet/compare/9aece63c8db0a55c5e42ab4a71372ac58b53d990...f0fd132e6d4293a3b83edc410427bb9e38d80efd), [commit](https://github.com/DanielXMoore/Civet/commit/f0fd132e6d4293a3b83edc410427bb9e38d80efd))
* Fix #684: Add support for TypeScript /// directives [[#686](https://github.com/DanielXMoore/Civet/pull/686)]

## 0.6.28 (2023-09-02, [diff](https://github.com/DanielXMoore/Civet/compare/d5cc6d02401793341c9dcbc5e232730b2f3714bd...9aece63c8db0a55c5e42ab4a71372ac58b53d990), [commit](https://github.com/DanielXMoore/Civet/commit/9aece63c8db0a55c5e42ab4a71372ac58b53d990))
* Document unplugin [[#675](https://github.com/DanielXMoore/Civet/pull/675)]
* Add nextjs unplugin example [[#676](https://github.com/DanielXMoore/Civet/pull/676)]
* New try at indented application [[#677](https://github.com/DanielXMoore/Civet/pull/677)]
* Convert to more Civet-y style [[#683](https://github.com/DanielXMoore/Civet/pull/683)]
* Fixes #664 [[#679](https://github.com/DanielXMoore/Civet/pull/679)]
* fix #655 [[#680](https://github.com/DanielXMoore/Civet/pull/680)]
* Fixes #682; Fixes #653; Improved arrow function const assignment [[#687](https://github.com/DanielXMoore/Civet/pull/687)]
* Fix #635: Identity function shorthand [[#688](https://github.com/DanielXMoore/Civet/pull/688)]

## 0.6.27 (2023-08-31, [diff](https://github.com/DanielXMoore/Civet/compare/ad2db1d3645b065e923f7a48e76da760b76e9aa4...d5cc6d02401793341c9dcbc5e232730b2f3714bd), [commit](https://github.com/DanielXMoore/Civet/commit/d5cc6d02401793341c9dcbc5e232730b2f3714bd))
* 🐈🐈🐈 [[#657](https://github.com/DanielXMoore/Civet/pull/657)]
* Added void to improve types and opt out of implicit returns [[#672](https://github.com/DanielXMoore/Civet/pull/672)]
* Fix #666 [[#671](https://github.com/DanielXMoore/Civet/pull/671)]
* Fixes #669 [[#673](https://github.com/DanielXMoore/Civet/pull/673)]
* Fixes #662 [[#674](https://github.com/DanielXMoore/Civet/pull/674)]
* Fix #663 [[#670](https://github.com/DanielXMoore/Civet/pull/670)]
* Add civet unplugin [[#632](https://github.com/DanielXMoore/Civet/pull/632)]

## 0.6.26 (2023-08-26, [diff](https://github.com/DanielXMoore/Civet/compare/6000947600fe3c0e70dec4b419894b1d9ee867c7...ad2db1d3645b065e923f7a48e76da760b76e9aa4), [commit](https://github.com/DanielXMoore/Civet/commit/ad2db1d3645b065e923f7a48e76da760b76e9aa4))
* Fix #564 Implement basic const enums in --js mode [[#654](https://github.com/DanielXMoore/Civet/pull/654)]

## 0.6.25 (2023-08-25, [diff](https://github.com/DanielXMoore/Civet/compare/10d42ed53a1354f20994f479b891782b4393f312...6000947600fe3c0e70dec4b419894b1d9ee867c7), [commit](https://github.com/DanielXMoore/Civet/commit/6000947600fe3c0e70dec4b419894b1d9ee867c7))
* Initial auto-const [[#649](https://github.com/DanielXMoore/Civet/pull/649)]
* Fix #639 hoistable thick pipe ref decs [[#651](https://github.com/DanielXMoore/Civet/pull/651)]
* Fix #640 implicit return of const function declarations [[#652](https://github.com/DanielXMoore/Civet/pull/652)]

## 0.6.24 (2023-08-22, [diff](https://github.com/DanielXMoore/Civet/compare/0e34b0a6285b54e6cb9f07d758212d3f02f515f2...10d42ed53a1354f20994f479b891782b4393f312), [commit](https://github.com/DanielXMoore/Civet/commit/10d42ed53a1354f20994f479b891782b4393f312))
* Updated the Bun-related how-to [[#646](https://github.com/DanielXMoore/Civet/pull/646)]

## 0.6.23 (2023-08-20, [diff](https://github.com/DanielXMoore/Civet/compare/ae626a5ebbc8d80926ae0aa9093c6a4bbe6222f9...0e34b0a6285b54e6cb9f07d758212d3f02f515f2), [commit](https://github.com/DanielXMoore/Civet/commit/0e34b0a6285b54e6cb9f07d758212d3f02f515f2))
* Postfix expressions inside indented implicit object literals [[#630](https://github.com/DanielXMoore/Civet/pull/630)]
* Postfix expressions inside inline object literals [[#631](https://github.com/DanielXMoore/Civet/pull/631)]
* Added private this shorthand. Fixes #633 [[#636](https://github.com/DanielXMoore/Civet/pull/636)]
* source/lib.js -> source/lib.ts [[#638](https://github.com/DanielXMoore/Civet/pull/638)]
* for own..in [[#644](https://github.com/DanielXMoore/Civet/pull/644)]

## 0.6.22 (2023-08-13, [diff](https://github.com/DanielXMoore/Civet/compare/643b9bfeb0aedb141290f0ed252bf354bd7f454d...ae626a5ebbc8d80926ae0aa9093c6a4bbe6222f9), [commit](https://github.com/DanielXMoore/Civet/commit/ae626a5ebbc8d80926ae0aa9093c6a4bbe6222f9))
* Constructor prefix goes after super call [[#626](https://github.com/DanielXMoore/Civet/pull/626)]
* Fix hoisting around IIFE [[#627](https://github.com/DanielXMoore/Civet/pull/627)]

## 0.6.21 (2023-08-11, [diff](https://github.com/DanielXMoore/Civet/compare/9eaeb3d13e33d37423ddf8e4cbf23bd2c603c5e0...643b9bfeb0aedb141290f0ed252bf354bd7f454d), [commit](https://github.com/DanielXMoore/Civet/commit/643b9bfeb0aedb141290f0ed252bf354bd7f454d))
* for item, index of list [[#621](https://github.com/DanielXMoore/Civet/pull/621)]
* for key, value in object [[#622](https://github.com/DanielXMoore/Civet/pull/622)]
* for each..of [[#623](https://github.com/DanielXMoore/Civet/pull/623)]

## 0.6.20 (2023-08-07, [diff](https://github.com/DanielXMoore/Civet/compare/2f8698cc5ff3e2ffa0f8a9fc4cbdc9ace5c5a852...9eaeb3d13e33d37423ddf8e4cbf23bd2c603c5e0), [commit](https://github.com/DanielXMoore/Civet/commit/9eaeb3d13e33d37423ddf8e4cbf23bd2c603c5e0))
* Fix tuple-matching behavior [[#608](https://github.com/DanielXMoore/Civet/pull/608)]
* Forbid binary op after newline within SingleLineStatements (e.g. `then`) [[#612](https://github.com/DanielXMoore/Civet/pull/612)]
* Remove forbidMultiLineImplicitObjectLiteral [[#613](https://github.com/DanielXMoore/Civet/pull/613)]
* Revamp braced object literals [[#614](https://github.com/DanielXMoore/Civet/pull/614)]
* Revamp array literals [[#617](https://github.com/DanielXMoore/Civet/pull/617)]
* `type` declaration without `=` [[#611](https://github.com/DanielXMoore/Civet/pull/611)]
* Cache fix for function calls within inline objects [[#618](https://github.com/DanielXMoore/Civet/pull/618)]
* Fix implicit return with switch+then [[#620](https://github.com/DanielXMoore/Civet/pull/620)]
* Unify Samedent/Nested, and other indent cleanup [[#619](https://github.com/DanielXMoore/Civet/pull/619)]

## 0.6.19 (2023-08-05, [diff](https://github.com/DanielXMoore/Civet/compare/78e3074251d6b83a5d4115cded20e8631cac5ed1...2f8698cc5ff3e2ffa0f8a9fc4cbdc9ace5c5a852), [commit](https://github.com/DanielXMoore/Civet/commit/2f8698cc5ff3e2ffa0f8a9fc4cbdc9ace5c5a852))
* Implicit returns of (last) declaration [[#606](https://github.com/DanielXMoore/Civet/pull/606)]

## 0.6.18 (2023-08-02, [diff](https://github.com/DanielXMoore/Civet/compare/700da54ff12ba65ba3e28c1806df1ad9a76c0ff1...78e3074251d6b83a5d4115cded20e8631cac5ed1), [commit](https://github.com/DanielXMoore/Civet/commit/78e3074251d6b83a5d4115cded20e8631cac5ed1))
* TypeScript named tuples [[#604](https://github.com/DanielXMoore/Civet/pull/604)]
* Allow ?: with named elements in tuple types [[#605](https://github.com/DanielXMoore/Civet/pull/605)]
* Possessive object access [[#603](https://github.com/DanielXMoore/Civet/pull/603)]

## 0.6.17 (2023-07-31, [diff](https://github.com/DanielXMoore/Civet/compare/28cc0a983a1879ac157bcd0f105489e4784083f8...700da54ff12ba65ba3e28c1806df1ad9a76c0ff1), [commit](https://github.com/DanielXMoore/Civet/commit/700da54ff12ba65ba3e28c1806df1ad9a76c0ff1))
* `switch` fixes [[#594](https://github.com/DanielXMoore/Civet/pull/594)]
* Support indented RHS after binary op [[#600](https://github.com/DanielXMoore/Civet/pull/600)]
* No implicit return from async function: Promise<void> [[#601](https://github.com/DanielXMoore/Civet/pull/601)]
* autoVar/autoLet should treat `=>` and methods same as functions [[#602](https://github.com/DanielXMoore/Civet/pull/602)]

## 0.6.16 (2023-07-24, [diff](https://github.com/DanielXMoore/Civet/compare/629fbf37865f0da2857336b74cac83bbeb81b492...28cc0a983a1879ac157bcd0f105489e4784083f8), [commit](https://github.com/DanielXMoore/Civet/commit/28cc0a983a1879ac157bcd0f105489e4784083f8))
* Fix export functions getting implicit empty blocks [[#592](https://github.com/DanielXMoore/Civet/pull/592)]

## 0.6.15 (2023-07-19, [diff](https://github.com/DanielXMoore/Civet/compare/14f37f7e1cd0b98b10a09c2d0167d178fe4d8745...629fbf37865f0da2857336b74cac83bbeb81b492), [commit](https://github.com/DanielXMoore/Civet/commit/629fbf37865f0da2857336b74cac83bbeb81b492))
* Fix inner assignments mixed with operator assignments [[#585](https://github.com/DanielXMoore/Civet/pull/585)]
* Allow trailing CallExpression after ExpressionizedStatement [[#584](https://github.com/DanielXMoore/Civet/pull/584)]

## 0.6.14 (2023-07-15, [diff](https://github.com/DanielXMoore/Civet/compare/cec810cc32ebf5b0038b4156a9173b138e9233cc...14f37f7e1cd0b98b10a09c2d0167d178fe4d8745), [commit](https://github.com/DanielXMoore/Civet/commit/14f37f7e1cd0b98b10a09c2d0167d178fe4d8745))
* Existence operator chaining and cleanup [[#578](https://github.com/DanielXMoore/Civet/pull/578)]
* Arrow function types fixes: `abstract new` and `asserts`/predicates [[#580](https://github.com/DanielXMoore/Civet/pull/580)]
* Fix weird custom operator behavior [[#581](https://github.com/DanielXMoore/Civet/pull/581)]

## 0.6.13 (2023-07-08, [diff](https://github.com/DanielXMoore/Civet/compare/1781b85f63c183afc35e2616917e638fab4ccd77...cec810cc32ebf5b0038b4156a9173b138e9233cc), [commit](https://github.com/DanielXMoore/Civet/commit/cec810cc32ebf5b0038b4156a9173b138e9233cc))
* Forbid implicit calls with braced argument in extends/if/else/for/when/case [[#576](https://github.com/DanielXMoore/Civet/pull/576)]
* Fix nested object with function children (caching) [[#577](https://github.com/DanielXMoore/Civet/pull/577)]

## 0.6.12 (2023-07-08, [diff](https://github.com/DanielXMoore/Civet/compare/d47c12999c6a1ec6dd7c1b7d421c218c063b6047...1781b85f63c183afc35e2616917e638fab4ccd77), [commit](https://github.com/DanielXMoore/Civet/commit/1781b85f63c183afc35e2616917e638fab4ccd77))
* Fix empty objects in if statements [[#571](https://github.com/DanielXMoore/Civet/pull/571)]
* Fix binary ops RHS in pattern matching switch [[#575](https://github.com/DanielXMoore/Civet/pull/575)]
* Fix missing closing braces [[#574](https://github.com/DanielXMoore/Civet/pull/574)]

## 0.6.11 (2023-07-06, [diff](https://github.com/DanielXMoore/Civet/compare/40ec7dc3d12c8bf0dd4f204eb29883194dfbc904...d47c12999c6a1ec6dd7c1b7d421c218c063b6047), [commit](https://github.com/DanielXMoore/Civet/commit/d47c12999c6a1ec6dd7c1b7d421c218c063b6047))
* Add missing parentheses to glob assignments with refs [[#567](https://github.com/DanielXMoore/Civet/pull/567)]
* Support TypeScript optional methods [[#568](https://github.com/DanielXMoore/Civet/pull/568)]
* Support new arrow function types [[#569](https://github.com/DanielXMoore/Civet/pull/569)]

## 0.6.10 (2023-07-03, [diff](https://github.com/DanielXMoore/Civet/compare/027d8cd8b722ef6c14f27d71637e3f595128a9f3...40ec7dc3d12c8bf0dd4f204eb29883194dfbc904), [commit](https://github.com/DanielXMoore/Civet/commit/40ec7dc3d12c8bf0dd4f204eb29883194dfbc904))
* `not` support outside coffeeCompat mode [[#557](https://github.com/DanielXMoore/Civet/pull/557)]
* Unicode operators ≤≥≠≢≡≣⩶⩵«»⋙‖⁇∈∉∋∌▷‥…≔→⇒ [[#558](https://github.com/DanielXMoore/Civet/pull/558)]

## 0.6.9 (2023-06-18, [diff](https://github.com/DanielXMoore/Civet/compare/dd674203b577525122ce9518002938d8e3eb9f84...027d8cd8b722ef6c14f27d71637e3f595128a9f3), [commit](https://github.com/DanielXMoore/Civet/commit/027d8cd8b722ef6c14f27d71637e3f595128a9f3))

## 0.6.8 (2023-06-10, [diff](https://github.com/DanielXMoore/Civet/compare/eafbdd8a1782a25365c2a8d128365c27acf6b1e0...dd674203b577525122ce9518002938d8e3eb9f84), [commit](https://github.com/DanielXMoore/Civet/commit/dd674203b577525122ce9518002938d8e3eb9f84))
* Function implicit bodies [[#542](https://github.com/DanielXMoore/Civet/pull/542)]
* Fix implicit calls with bind and decorators [[#545](https://github.com/DanielXMoore/Civet/pull/545)]
* Fix readonly support in interfaces  [[#546](https://github.com/DanielXMoore/Civet/pull/546)]

## 0.6.7 (2023-06-02, [diff](https://github.com/DanielXMoore/Civet/compare/7d6e6c30227625396727ef2c3c1695c919a5a41d...eafbdd8a1782a25365c2a8d128365c27acf6b1e0), [commit](https://github.com/DanielXMoore/Civet/commit/eafbdd8a1782a25365c2a8d128365c27acf6b1e0))

## 0.6.6 (2023-05-31, [diff](https://github.com/DanielXMoore/Civet/compare/3822c4447ecf772c989dd568f03552a375b6fe8a...7d6e6c30227625396727ef2c3c1695c919a5a41d), [commit](https://github.com/DanielXMoore/Civet/commit/7d6e6c30227625396727ef2c3c1695c919a5a41d))

## 0.6.5 (2023-05-29, [diff](https://github.com/DanielXMoore/Civet/compare/0b5bf4bff21488ad097483e2ea1313708bbf3458...3822c4447ecf772c989dd568f03552a375b6fe8a), [commit](https://github.com/DanielXMoore/Civet/commit/3822c4447ecf772c989dd568f03552a375b6fe8a))

## 0.6.4 (2023-05-25, [diff](https://github.com/DanielXMoore/Civet/compare/f1fba33c5a694f94d0090468f7307140f185cb53...0b5bf4bff21488ad097483e2ea1313708bbf3458), [commit](https://github.com/DanielXMoore/Civet/commit/0b5bf4bff21488ad097483e2ea1313708bbf3458))

## 0.6.3 (2023-05-24, [diff](https://github.com/DanielXMoore/Civet/compare/f1c141277e4b2b2685ea0b737229008c339d91de...f1fba33c5a694f94d0090468f7307140f185cb53), [commit](https://github.com/DanielXMoore/Civet/commit/f1fba33c5a694f94d0090468f7307140f185cb53))
* Small whitespace fix for trailing splat [[#524](https://github.com/DanielXMoore/Civet/pull/524)]

## 0.6.2 (2023-05-13, [diff](https://github.com/DanielXMoore/Civet/compare/73b69d11c5c0e386a5dc70c8a3c4212515513665...f1c141277e4b2b2685ea0b737229008c339d91de), [commit](https://github.com/DanielXMoore/Civet/commit/f1c141277e4b2b2685ea0b737229008c339d91de))
* Support splats in type tuples [[#521](https://github.com/DanielXMoore/Civet/pull/521)]

## 0.6.1 (2023-05-02, [diff](https://github.com/DanielXMoore/Civet/compare/d235c93b9be81b00eb28f7da61029ca44e275230...73b69d11c5c0e386a5dc70c8a3c4212515513665), [commit](https://github.com/DanielXMoore/Civet/commit/73b69d11c5c0e386a5dc70c8a3c4212515513665))

## 0.6.0 (2023-05-02, [diff](https://github.com/DanielXMoore/Civet/compare/e9b856e374c94e4af590f9b2121566d3f3c38387...d235c93b9be81b00eb28f7da61029ca44e275230), [commit](https://github.com/DanielXMoore/Civet/commit/d235c93b9be81b00eb28f7da61029ca44e275230))

## 0.5.94 (2023-04-15, [diff](https://github.com/DanielXMoore/Civet/compare/113b090086842305d9dad9822ae65bdbc38f21d6...e9b856e374c94e4af590f9b2121566d3f3c38387), [commit](https://github.com/DanielXMoore/Civet/commit/e9b856e374c94e4af590f9b2121566d3f3c38387))
* x@y and @@x bind shorthand, plus JSX fixes [[#506](https://github.com/DanielXMoore/Civet/pull/506)]
* JSX unbraced @ and @@ shorthand [[#507](https://github.com/DanielXMoore/Civet/pull/507)]
* JSX braceless call/member/glob expressions [[#508](https://github.com/DanielXMoore/Civet/pull/508)]

## 0.5.93 (2023-04-01, [diff](https://github.com/DanielXMoore/Civet/compare/703911f690e89f1e62ae656e949b324a1c9f07b2...113b090086842305d9dad9822ae65bdbc38f21d6), [commit](https://github.com/DanielXMoore/Civet/commit/113b090086842305d9dad9822ae65bdbc38f21d6))
* Call splice method directly [[#499](https://github.com/DanielXMoore/Civet/pull/499)]
* Fix sourcemap support from CLI [[#498](https://github.com/DanielXMoore/Civet/pull/498)]
* Remove tsx after ESM transpilation [[#500](https://github.com/DanielXMoore/Civet/pull/500)]
* Fix implicit async/* in functions with arguments [[#501](https://github.com/DanielXMoore/Civet/pull/501)]

## 0.5.92 (2023-03-30, [diff](https://github.com/DanielXMoore/Civet/compare/806cfc4a19371104f861cc504e60a4900ce0f78e...703911f690e89f1e62ae656e949b324a1c9f07b2), [commit](https://github.com/DanielXMoore/Civet/commit/703911f690e89f1e62ae656e949b324a1c9f07b2))

## 0.5.91 (2023-03-29, [diff](https://github.com/DanielXMoore/Civet/compare/8483dbfce23e203af6e108248eec1d468039d0b0...806cfc4a19371104f861cc504e60a4900ce0f78e), [commit](https://github.com/DanielXMoore/Civet/commit/806cfc4a19371104f861cc504e60a4900ce0f78e))
* Indentation after await operator [[#475](https://github.com/DanielXMoore/Civet/pull/475)]
* CLI can run ESM scripts via import [[#477](https://github.com/DanielXMoore/Civet/pull/477)]
* Inline implicit object literals can't end with comma [[#479](https://github.com/DanielXMoore/Civet/pull/479)]

## 0.5.90 (2023-03-23, [diff](https://github.com/DanielXMoore/Civet/compare/a9894e76ea4da38e14c5321e736484100c7a766b...8483dbfce23e203af6e108248eec1d468039d0b0), [commit](https://github.com/DanielXMoore/Civet/commit/8483dbfce23e203af6e108248eec1d468039d0b0))

## 0.5.89 (2023-03-20, [diff](https://github.com/DanielXMoore/Civet/compare/46d2efd3ca90978a89200a233e844c4d9816a918...a9894e76ea4da38e14c5321e736484100c7a766b), [commit](https://github.com/DanielXMoore/Civet/commit/a9894e76ea4da38e14c5321e736484100c7a766b))

## 0.5.88 (2023-03-19, [diff](https://github.com/DanielXMoore/Civet/compare/b5fdabd253351b357d091f3d72ed2b1f283183d6...46d2efd3ca90978a89200a233e844c4d9816a918), [commit](https://github.com/DanielXMoore/Civet/commit/46d2efd3ca90978a89200a233e844c4d9816a918))

## 0.5.87 (2023-03-16, [diff](https://github.com/DanielXMoore/Civet/compare/ae99d43de74e8053d94531206ade2290690f4188...b5fdabd253351b357d091f3d72ed2b1f283183d6), [commit](https://github.com/DanielXMoore/Civet/commit/b5fdabd253351b357d091f3d72ed2b1f283183d6))
* Link to Civetman [[#450](https://github.com/DanielXMoore/Civet/pull/450)]

## 0.5.86 (2023-03-11, [diff](https://github.com/DanielXMoore/Civet/compare/f0892bc090f83716d81c9db20c93ebd816f57b21...ae99d43de74e8053d94531206ade2290690f4188), [commit](https://github.com/DanielXMoore/Civet/commit/ae99d43de74e8053d94531206ade2290690f4188))

## 0.5.85 (2023-03-10, [diff](https://github.com/DanielXMoore/Civet/compare/2bd8307058e37bce07d5f412848914b5731984da...f0892bc090f83716d81c9db20c93ebd816f57b21), [commit](https://github.com/DanielXMoore/Civet/commit/f0892bc090f83716d81c9db20c93ebd816f57b21))
* For loop optimizations and generalizations [[#442](https://github.com/DanielXMoore/Civet/pull/442)]
* Semicolon-separated statements in blocks [[#443](https://github.com/DanielXMoore/Civet/pull/443)]

## 0.5.84 (2023-03-05, [diff](https://github.com/DanielXMoore/Civet/compare/3261ecd40d31d64c8abcefb34ebffc5a72f894c0...2bd8307058e37bce07d5f412848914b5731984da), [commit](https://github.com/DanielXMoore/Civet/commit/2bd8307058e37bce07d5f412848914b5731984da))

## 0.5.83 (2023-03-05, [diff](https://github.com/DanielXMoore/Civet/compare/648dd946614c89de5511897a066b6657fb76ff42...3261ecd40d31d64c8abcefb34ebffc5a72f894c0), [commit](https://github.com/DanielXMoore/Civet/commit/3261ecd40d31d64c8abcefb34ebffc5a72f894c0))
* Fix regression in indented application from decorators change. Fixes #434 [[#435](https://github.com/DanielXMoore/Civet/pull/435)]

## 0.5.82 (2023-03-04, [diff](https://github.com/DanielXMoore/Civet/compare/d31723397e1af403330d6ad2105229f4004a970c...648dd946614c89de5511897a066b6657fb76ff42), [commit](https://github.com/DanielXMoore/Civet/commit/648dd946614c89de5511897a066b6657fb76ff42))

## 0.5.81 (2023-03-04, [diff](https://github.com/DanielXMoore/Civet/compare/20931f210ca46f62856ba036967265a0e46e61b1...d31723397e1af403330d6ad2105229f4004a970c), [commit](https://github.com/DanielXMoore/Civet/commit/d31723397e1af403330d6ad2105229f4004a970c))

## 0.5.80 (2023-03-02, [diff](https://github.com/DanielXMoore/Civet/compare/bbf4d00317083c0b8daa63189851deb63b03c05f...20931f210ca46f62856ba036967265a0e46e61b1), [commit](https://github.com/DanielXMoore/Civet/commit/20931f210ca46f62856ba036967265a0e46e61b1))
* New top-level statement system [[#414](https://github.com/DanielXMoore/Civet/pull/414)]

## 0.5.79 (2023-02-24, [diff](https://github.com/DanielXMoore/Civet/compare/95b99a538889d1ce7edd374b5d6cb6965fe4c0bc...bbf4d00317083c0b8daa63189851deb63b03c05f), [commit](https://github.com/DanielXMoore/Civet/commit/bbf4d00317083c0b8daa63189851deb63b03c05f))

## 0.5.78 (2023-02-23, [diff](https://github.com/DanielXMoore/Civet/compare/8e42db58205ed3e00c629ecf088c4128c26a1d13...95b99a538889d1ce7edd374b5d6cb6965fe4c0bc), [commit](https://github.com/DanielXMoore/Civet/commit/95b99a538889d1ce7edd374b5d6cb6965fe4c0bc))
* Call with unparenthesized iteration expression argument [[#411](https://github.com/DanielXMoore/Civet/pull/411)]

## 0.5.77 (2023-02-23, [diff](https://github.com/DanielXMoore/Civet/compare/a6228f02038675bcef3b8fd60c04c7ab4a34400b...8e42db58205ed3e00c629ecf088c4128c26a1d13), [commit](https://github.com/DanielXMoore/Civet/commit/8e42db58205ed3e00c629ecf088c4128c26a1d13))
* async do, async for [[#402](https://github.com/DanielXMoore/Civet/pull/402)]
* Improve ligature toggles [[#404](https://github.com/DanielXMoore/Civet/pull/404)]
* Leave plain JSX strings alone, including newlines [[#408](https://github.com/DanielXMoore/Civet/pull/408)]
* enum support [[#410](https://github.com/DanielXMoore/Civet/pull/410)]

## 0.5.76 (2023-02-20, [diff](https://github.com/DanielXMoore/Civet/compare/e0be461a5e9458a97d8eda56eb16b7c611b032ac...a6228f02038675bcef3b8fd60c04c7ab4a34400b), [commit](https://github.com/DanielXMoore/Civet/commit/a6228f02038675bcef3b8fd60c04c7ab4a34400b))
* Fix automatic async vs. pipe invocations [[#401](https://github.com/DanielXMoore/Civet/pull/401)]

## 0.5.75 (2023-02-20, [diff](https://github.com/DanielXMoore/Civet/compare/3baedd45370b5cda937b651acc41a478dbabf16c...e0be461a5e9458a97d8eda56eb16b7c611b032ac), [commit](https://github.com/DanielXMoore/Civet/commit/e0be461a5e9458a97d8eda56eb16b7c611b032ac))
* Move Philosophy to civet.dev [[#394](https://github.com/DanielXMoore/Civet/pull/394)]
* Prevent indented application in Coffee for loops [[#396](https://github.com/DanielXMoore/Civet/pull/396)]
* Forbid indented application in first line of array literal [[#397](https://github.com/DanielXMoore/Civet/pull/397)]
* Automatically await/async expressionized statements with await [[#399](https://github.com/DanielXMoore/Civet/pull/399)]

## 0.5.74 (2023-02-19, [diff](https://github.com/DanielXMoore/Civet/compare/ba798bdba8adc5312ba1cf1c128f57b1e8b5933c...3baedd45370b5cda937b651acc41a478dbabf16c), [commit](https://github.com/DanielXMoore/Civet/commit/3baedd45370b5cda937b651acc41a478dbabf16c))
* do expressions wrapping in iffe [[#376](https://github.com/DanielXMoore/Civet/pull/376)]
* Write an intro to Civet for the front page [[#386](https://github.com/DanielXMoore/Civet/pull/386)]
* Update Hero.vue [[#392](https://github.com/DanielXMoore/Civet/pull/392)]
* TypeScript non-null declarations [[#393](https://github.com/DanielXMoore/Civet/pull/393)]

## 0.5.73 (2023-02-15, [diff](https://github.com/DanielXMoore/Civet/compare/fc063ee91ad0c808d59087f80714a3a621e4ec51...ba798bdba8adc5312ba1cf1c128f57b1e8b5933c), [commit](https://github.com/DanielXMoore/Civet/commit/ba798bdba8adc5312ba1cf1c128f57b1e8b5933c))

## 0.5.72 (2023-02-14, [diff](https://github.com/DanielXMoore/Civet/compare/5a9d3cc98635cca8daad1efe65e95f6a10811a90...fc063ee91ad0c808d59087f80714a3a621e4ec51), [commit](https://github.com/DanielXMoore/Civet/commit/fc063ee91ad0c808d59087f80714a3a621e4ec51))

## 0.5.71 (2023-02-13, [diff](https://github.com/DanielXMoore/Civet/compare/720df990e7f4ba383dc81fe72c028d78c01cc303...5a9d3cc98635cca8daad1efe65e95f6a10811a90), [commit](https://github.com/DanielXMoore/Civet/commit/5a9d3cc98635cca8daad1efe65e95f6a10811a90))
* return.value and return = [[#364](https://github.com/DanielXMoore/Civet/pull/364)]
* Trailing member properties in blocks [[#368](https://github.com/DanielXMoore/Civet/pull/368)]
* Declare and update return.value [[#366](https://github.com/DanielXMoore/Civet/pull/366)]

## 0.5.70 (2023-02-12, [diff](https://github.com/DanielXMoore/Civet/compare/111d2b28aaf039fa2d7402a0452a5cfa6fd04450...720df990e7f4ba383dc81fe72c028d78c01cc303), [commit](https://github.com/DanielXMoore/Civet/commit/720df990e7f4ba383dc81fe72c028d78c01cc303))
* Allow label argument in break and continue [[#363](https://github.com/DanielXMoore/Civet/pull/363)]

## 0.5.69 (2023-02-11, [diff](https://github.com/DanielXMoore/Civet/compare/83725a8d34f7f6a92e465b7cb69b1d81ca9cd61d...111d2b28aaf039fa2d7402a0452a5cfa6fd04450), [commit](https://github.com/DanielXMoore/Civet/commit/111d2b28aaf039fa2d7402a0452a5cfa6fd04450))
*  Allow assignments and update operators within assignments and update operators ++/-- [[#353](https://github.com/DanielXMoore/Civet/pull/353)]
* Support for labeling statements [[#354](https://github.com/DanielXMoore/Civet/pull/354)]
* Cleanup flag stacks, re-allow stuff inside parens/brackets/braces [[#356](https://github.com/DanielXMoore/Civet/pull/356)]
* Prevent `case:` from implicit object literal [[#357](https://github.com/DanielXMoore/Civet/pull/357)]

## 0.5.68 (2023-02-09, [diff](https://github.com/DanielXMoore/Civet/compare/5ba4f8fc74191b8b6b9446a3af91001d7fe88cec...83725a8d34f7f6a92e465b7cb69b1d81ca9cd61d), [commit](https://github.com/DanielXMoore/Civet/commit/83725a8d34f7f6a92e465b7cb69b1d81ca9cd61d))
* Inner assignments within assignment chains [[#348](https://github.com/DanielXMoore/Civet/pull/348)]
* Test helper `throws` supports description and --- [[#349](https://github.com/DanielXMoore/Civet/pull/349)]

## 0.5.67 (2023-02-08, [diff](https://github.com/DanielXMoore/Civet/compare/369324ac4b950f9bda68a66c08aab49fdefe9026...5ba4f8fc74191b8b6b9446a3af91001d7fe88cec), [commit](https://github.com/DanielXMoore/Civet/commit/5ba4f8fc74191b8b6b9446a3af91001d7fe88cec))
* Switch prelude declarations from const to var [[#344](https://github.com/DanielXMoore/Civet/pull/344)]
* Spreads in object globs [[#343](https://github.com/DanielXMoore/Civet/pull/343)]
* Pipelines lower precedence than implicit arguments [[#347](https://github.com/DanielXMoore/Civet/pull/347)]
* Support hex and other numbers in ranges [[#345](https://github.com/DanielXMoore/Civet/pull/345)]

## 0.5.66 (2023-02-07, [diff](https://github.com/DanielXMoore/Civet/compare/5071516619ee72d61b9b7b20e8c3ea08ce9d5c8f...369324ac4b950f9bda68a66c08aab49fdefe9026), [commit](https://github.com/DanielXMoore/Civet/commit/369324ac4b950f9bda68a66c08aab49fdefe9026))
* xor/^^ and xnor/!^ operators [[#340](https://github.com/DanielXMoore/Civet/pull/340)]

## 0.5.65 (2023-02-06, [diff](https://github.com/DanielXMoore/Civet/compare/caa02a80e1569d73281337ece4caba79a7fe0a32...5071516619ee72d61b9b7b20e8c3ea08ce9d5c8f), [commit](https://github.com/DanielXMoore/Civet/commit/5071516619ee72d61b9b7b20e8c3ea08ce9d5c8f))

## 0.5.64 (2023-02-05, [diff](https://github.com/DanielXMoore/Civet/compare/e96cd7fcade90b007f66475b779eadd9e842f1d0...caa02a80e1569d73281337ece4caba79a7fe0a32), [commit](https://github.com/DanielXMoore/Civet/commit/caa02a80e1569d73281337ece4caba79a7fe0a32))
* Object globs, v2 [[#333](https://github.com/DanielXMoore/Civet/pull/333)]
* Fix #332 [[#334](https://github.com/DanielXMoore/Civet/pull/334)]

## 0.5.63 (2023-02-04, [diff](https://github.com/DanielXMoore/Civet/compare/be41108730d77bcd5280ca6a10cdfcc6fa724e82...e96cd7fcade90b007f66475b779eadd9e842f1d0), [commit](https://github.com/DanielXMoore/Civet/commit/e96cd7fcade90b007f66475b779eadd9e842f1d0))
* Improve super property support [[#326](https://github.com/DanielXMoore/Civet/pull/326)]

## 0.5.62 (2023-02-02, [diff](https://github.com/DanielXMoore/Civet/compare/fd50be34c5c75f99b51744b43c96339df63e7eaa...be41108730d77bcd5280ca6a10cdfcc6fa724e82), [commit](https://github.com/DanielXMoore/Civet/commit/be41108730d77bcd5280ca6a10cdfcc6fa724e82))
* Tagged string literals become tagged template literals [[#322](https://github.com/DanielXMoore/Civet/pull/322)]
* Function fixes [[#323](https://github.com/DanielXMoore/Civet/pull/323)]
* typeof shorthand [[#325](https://github.com/DanielXMoore/Civet/pull/325)]

## 0.5.61 (2023-02-01, [diff](https://github.com/DanielXMoore/Civet/compare/40ba3d3c8a167fd96eadc5527aa0854628f31483...fd50be34c5c75f99b51744b43c96339df63e7eaa), [commit](https://github.com/DanielXMoore/Civet/commit/fd50be34c5c75f99b51744b43c96339df63e7eaa))

## 0.5.60 (2023-02-01, [diff](https://github.com/DanielXMoore/Civet/compare/809aad104c07d153ad30f7cd95caa9b9ce0fa040...40ba3d3c8a167fd96eadc5527aa0854628f31483), [commit](https://github.com/DanielXMoore/Civet/commit/40ba3d3c8a167fd96eadc5527aa0854628f31483))
* operator= assignment [[#301](https://github.com/DanielXMoore/Civet/pull/301)]

## 0.5.59 (2023-01-28, [diff](https://github.com/DanielXMoore/Civet/compare/c7915e69f03b75b8d3d030564ae167648240764b...809aad104c07d153ad30f7cd95caa9b9ce0fa040), [commit](https://github.com/DanielXMoore/Civet/commit/809aad104c07d153ad30f7cd95caa9b9ce0fa040))

## 0.5.58 (2023-01-28, [diff](https://github.com/DanielXMoore/Civet/compare/5f9ac219352050106f5005da0c0b2fea8c894b70...c7915e69f03b75b8d3d030564ae167648240764b), [commit](https://github.com/DanielXMoore/Civet/commit/c7915e69f03b75b8d3d030564ae167648240764b))

## 0.5.57 (2023-01-27, [diff](https://github.com/DanielXMoore/Civet/compare/933543c46d2422fc08c22a22beff4a0a711bceac...5f9ac219352050106f5005da0c0b2fea8c894b70), [commit](https://github.com/DanielXMoore/Civet/commit/5f9ac219352050106f5005da0c0b2fea8c894b70))

## 0.5.56 (2023-01-24, [diff](https://github.com/DanielXMoore/Civet/compare/5acb5c47a389323e5b67a7da15cd20d4c7929cf8...933543c46d2422fc08c22a22beff4a0a711bceac), [commit](https://github.com/DanielXMoore/Civet/commit/933543c46d2422fc08c22a22beff4a0a711bceac))
* `{x[y]}` shorthand for `{[y]: x[y]}` [[#284](https://github.com/DanielXMoore/Civet/pull/284)]
* Require space in JSX after identifier or ...rest attribute [[#285](https://github.com/DanielXMoore/Civet/pull/285)]
* `not instanceof`, `!<?`, reserve `not` [[#286](https://github.com/DanielXMoore/Civet/pull/286)]

## 0.5.55 (2023-01-24, [diff](https://github.com/DanielXMoore/Civet/compare/d1d3552a2ce19657ddf1a0a212cecb5d3977e123...5acb5c47a389323e5b67a7da15cd20d4c7929cf8), [commit](https://github.com/DanielXMoore/Civet/commit/5acb5c47a389323e5b67a7da15cd20d4c7929cf8))
* Integer property access [[#283](https://github.com/DanielXMoore/Civet/pull/283)]

## 0.5.54 (2023-01-23, [diff](https://github.com/DanielXMoore/Civet/compare/36cdc770c27f10e8eeae7ba8e741d184d6147289...d1d3552a2ce19657ddf1a0a212cecb5d3977e123), [commit](https://github.com/DanielXMoore/Civet/commit/d1d3552a2ce19657ddf1a0a212cecb5d3977e123))

## 0.5.53 (2023-01-23, [diff](https://github.com/DanielXMoore/Civet/compare/597475d207b817f14e3db58d46367e7b280425f6...36cdc770c27f10e8eeae7ba8e741d184d6147289), [commit](https://github.com/DanielXMoore/Civet/commit/36cdc770c27f10e8eeae7ba8e741d184d6147289))
* Fix Init being called too late [[#280](https://github.com/DanielXMoore/Civet/pull/280)]
* Fix semicolon method body [[#281](https://github.com/DanielXMoore/Civet/pull/281)]

## 0.5.52 (2023-01-23, [diff](https://github.com/DanielXMoore/Civet/compare/54c72eaa82692b88e78cfdd76e317f6e55ac097f...597475d207b817f14e3db58d46367e7b280425f6), [commit](https://github.com/DanielXMoore/Civet/commit/597475d207b817f14e3db58d46367e7b280425f6))
* `<:` shorthand for implements [[#275](https://github.com/DanielXMoore/Civet/pull/275)]
* Braced object literal shorthand [[#276](https://github.com/DanielXMoore/Civet/pull/276)]
* Property access with string literals [[#278](https://github.com/DanielXMoore/Civet/pull/278)]
* Insert semicolons between lines that JS would combine [[#277](https://github.com/DanielXMoore/Civet/pull/277)]

## 0.5.51 (2023-01-22, [diff](https://github.com/DanielXMoore/Civet/compare/ac28d4a2fb9d32eca507e085b6bd838541cb8d50...54c72eaa82692b88e78cfdd76e317f6e55ac097f), [commit](https://github.com/DanielXMoore/Civet/commit/54c72eaa82692b88e78cfdd76e317f6e55ac097f))

## 0.5.50 (2023-01-21, [diff](https://github.com/DanielXMoore/Civet/compare/76955bd2bf44aed053cfe60afb345eb916585481...ac28d4a2fb9d32eca507e085b6bd838541cb8d50), [commit](https://github.com/DanielXMoore/Civet/commit/ac28d4a2fb9d32eca507e085b6bd838541cb8d50))

## 0.5.49 (2023-01-20, [diff](https://github.com/DanielXMoore/Civet/compare/b0d0e7409a32dd8642fcf0d27b1a8060ec02d70b...76955bd2bf44aed053cfe60afb345eb916585481), [commit](https://github.com/DanielXMoore/Civet/commit/76955bd2bf44aed053cfe60afb345eb916585481))
* Contributing document for getting started with Civet [[#255](https://github.com/DanielXMoore/Civet/pull/255)]

## 0.5.48 (2023-01-18, [diff](https://github.com/DanielXMoore/Civet/compare/db1aa881ac93d8c16f0399cf14bc63e8a5fa3417...b0d0e7409a32dd8642fcf0d27b1a8060ec02d70b), [commit](https://github.com/DanielXMoore/Civet/commit/b0d0e7409a32dd8642fcf0d27b1a8060ec02d70b))

## 0.5.47 (2023-01-17, [diff](https://github.com/DanielXMoore/Civet/compare/ac7b7a40e8ec6cabbd36e83fa60c1f843d337604...db1aa881ac93d8c16f0399cf14bc63e8a5fa3417), [commit](https://github.com/DanielXMoore/Civet/commit/db1aa881ac93d8c16f0399cf14bc63e8a5fa3417))

## 0.5.46 (2023-01-17, [diff](https://github.com/DanielXMoore/Civet/compare/63f8b86f1477f445d065b1d71b628256201aeb9a...ac7b7a40e8ec6cabbd36e83fa60c1f843d337604), [commit](https://github.com/DanielXMoore/Civet/commit/ac7b7a40e8ec6cabbd36e83fa60c1f843d337604))

## 0.5.45 (2023-01-17, [diff](https://github.com/DanielXMoore/Civet/compare/7856f807c611376bdfffb4654896dfd5a1bd08e4...63f8b86f1477f445d065b1d71b628256201aeb9a), [commit](https://github.com/DanielXMoore/Civet/commit/63f8b86f1477f445d065b1d71b628256201aeb9a))

## 0.5.44 (2023-01-16, [diff](https://github.com/DanielXMoore/Civet/compare/aad49c9afca3d8c2ed1f71c806fd720d72a4adf5...7856f807c611376bdfffb4654896dfd5a1bd08e4), [commit](https://github.com/DanielXMoore/Civet/commit/7856f807c611376bdfffb4654896dfd5a1bd08e4))

## 0.5.43 (2023-01-15, [diff](https://github.com/DanielXMoore/Civet/compare/02fd5cda1c2cd59bfbef9b743c90bb627f788790...aad49c9afca3d8c2ed1f71c806fd720d72a4adf5), [commit](https://github.com/DanielXMoore/Civet/commit/aad49c9afca3d8c2ed1f71c806fd720d72a4adf5))

## 0.5.42 (2023-01-15, [diff](https://github.com/DanielXMoore/Civet/compare/e9b1f692736768a8c3cea725714ca4237fa80e14...02fd5cda1c2cd59bfbef9b743c90bb627f788790), [commit](https://github.com/DanielXMoore/Civet/commit/02fd5cda1c2cd59bfbef9b743c90bb627f788790))

## 0.5.41 (2023-01-14, [diff](https://github.com/DanielXMoore/Civet/compare/7e37eb15f0ed630d76e81d23aca0d191da2db58b...e9b1f692736768a8c3cea725714ca4237fa80e14), [commit](https://github.com/DanielXMoore/Civet/commit/e9b1f692736768a8c3cea725714ca4237fa80e14))

## 0.5.40 (2023-01-14, [diff](https://github.com/DanielXMoore/Civet/compare/32c68df363688a51af4948ed2ce5d9d1ec674967...7e37eb15f0ed630d76e81d23aca0d191da2db58b), [commit](https://github.com/DanielXMoore/Civet/commit/7e37eb15f0ed630d76e81d23aca0d191da2db58b))
* New fast JSX parser [[#235](https://github.com/DanielXMoore/Civet/pull/235)]

## 0.5.39 (2023-01-13, [diff](https://github.com/DanielXMoore/Civet/compare/3504a6bf0070a400aef40fda50f600b559a7e30a...32c68df363688a51af4948ed2ce5d9d1ec674967), [commit](https://github.com/DanielXMoore/Civet/commit/32c68df363688a51af4948ed2ce5d9d1ec674967))
* Fix CLI behavior especially on Unix [[#232](https://github.com/DanielXMoore/Civet/pull/232)]

## 0.5.38 (2023-01-12, [diff](https://github.com/DanielXMoore/Civet/compare/2d7a01e15fd6788b7d2cc60a5c625054f6708e1d...3504a6bf0070a400aef40fda50f600b559a7e30a), [commit](https://github.com/DanielXMoore/Civet/commit/3504a6bf0070a400aef40fda50f600b559a7e30a))

## 0.5.37 (2023-01-12, [diff](https://github.com/DanielXMoore/Civet/compare/ad636f81699c7bb08e6868fc98fabf9e95b85006...2d7a01e15fd6788b7d2cc60a5c625054f6708e1d), [commit](https://github.com/DanielXMoore/Civet/commit/2d7a01e15fd6788b7d2cc60a5c625054f6708e1d))

## 0.5.36 (2023-01-11, [diff](https://github.com/DanielXMoore/Civet/compare/6cf5025c9b65caab6c3df903e313c4103d71fdca...ad636f81699c7bb08e6868fc98fabf9e95b85006), [commit](https://github.com/DanielXMoore/Civet/commit/ad636f81699c7bb08e6868fc98fabf9e95b85006))
* Gulp plugin [[#206](https://github.com/DanielXMoore/Civet/pull/206)]

## 0.5.35 (2023-01-11, [diff](https://github.com/DanielXMoore/Civet/compare/2bac67111952f46ace28526d15c1c687f5b3bed6...6cf5025c9b65caab6c3df903e313c4103d71fdca), [commit](https://github.com/DanielXMoore/Civet/commit/6cf5025c9b65caab6c3df903e313c4103d71fdca))

## 0.5.34 (2023-01-10, [diff](https://github.com/DanielXMoore/Civet/compare/5896c1e33798d23a81b17b325742e00197e600cb...2bac67111952f46ace28526d15c1c687f5b3bed6), [commit](https://github.com/DanielXMoore/Civet/commit/2bac67111952f46ace28526d15c1c687f5b3bed6))

## 0.5.33 (2023-01-10, [diff](https://github.com/DanielXMoore/Civet/compare/685c11f332a79c7b500310aa099e17b02c07becf...5896c1e33798d23a81b17b325742e00197e600cb), [commit](https://github.com/DanielXMoore/Civet/commit/5896c1e33798d23a81b17b325742e00197e600cb))
* Synonyous -> synonymous [[#180](https://github.com/DanielXMoore/Civet/pull/180)]

## 0.5.32 (2023-01-09, [diff](https://github.com/DanielXMoore/Civet/compare/90c0cf18ad9fd8ca9ebd4709386c18dba66e683d...685c11f332a79c7b500310aa099e17b02c07becf), [commit](https://github.com/DanielXMoore/Civet/commit/685c11f332a79c7b500310aa099e17b02c07becf))

## 0.5.31 (2023-01-09, [diff](https://github.com/DanielXMoore/Civet/compare/1ce757270f971509b6f8ddd77582e6b8d25f5ee8...90c0cf18ad9fd8ca9ebd4709386c18dba66e683d), [commit](https://github.com/DanielXMoore/Civet/commit/90c0cf18ad9fd8ca9ebd4709386c18dba66e683d))

## 0.5.30 (2023-01-08, [diff](https://github.com/DanielXMoore/Civet/compare/42e06abf22a087e433f6ab25b4c94bc29ae5271d...1ce757270f971509b6f8ddd77582e6b8d25f5ee8), [commit](https://github.com/DanielXMoore/Civet/commit/1ce757270f971509b6f8ddd77582e6b8d25f5ee8))

## 0.5.29 (2023-01-08, [diff](https://github.com/DanielXMoore/Civet/compare/0b21fba31f44725ce34880ce6e4f1796f4f5f55d...42e06abf22a087e433f6ab25b4c94bc29ae5271d), [commit](https://github.com/DanielXMoore/Civet/commit/42e06abf22a087e433f6ab25b4c94bc29ae5271d))

## 0.5.28 (2023-01-08, [diff](https://github.com/DanielXMoore/Civet/compare/73aaa9a3c1465946ee944c9727dcf68c742020fb...0b21fba31f44725ce34880ce6e4f1796f4f5f55d), [commit](https://github.com/DanielXMoore/Civet/commit/0b21fba31f44725ce34880ce6e4f1796f4f5f55d))
* Create directory in `-o` option if it doesn't exist [[#164](https://github.com/DanielXMoore/Civet/pull/164)]

## 0.5.27 (2023-01-07, [diff](https://github.com/DanielXMoore/Civet/compare/f67d03666486bcd5299a0a22481846f59ae21adb...73aaa9a3c1465946ee944c9727dcf68c742020fb), [commit](https://github.com/DanielXMoore/Civet/commit/73aaa9a3c1465946ee944c9727dcf68c742020fb))

## 0.5.26 (2023-01-06, [diff](https://github.com/DanielXMoore/Civet/compare/1dba1ea9d0c5caa80c5664c302ea4de4b01cf477...f67d03666486bcd5299a0a22481846f59ae21adb), [commit](https://github.com/DanielXMoore/Civet/commit/f67d03666486bcd5299a0a22481846f59ae21adb))
* New Playground tag in docs [[#125](https://github.com/DanielXMoore/Civet/pull/125)]
* Docs: fix code examples rendering [[#140](https://github.com/DanielXMoore/Civet/pull/140)]

## 0.5.25 (2023-01-06, [diff](https://github.com/DanielXMoore/Civet/compare/04bd9e2d6a20687cf7f3d6ae662f93e893ed5cac...1dba1ea9d0c5caa80c5664c302ea4de4b01cf477), [commit](https://github.com/DanielXMoore/Civet/commit/1dba1ea9d0c5caa80c5664c302ea4de4b01cf477))
* Fix for nested JSX if else expressions [[#133](https://github.com/DanielXMoore/Civet/pull/133)]

## 0.5.24 (2023-01-06, [diff](https://github.com/DanielXMoore/Civet/compare/72afca957ffa68e93ffa49dbe54f1c2e0b823be8...04bd9e2d6a20687cf7f3d6ae662f93e893ed5cac), [commit](https://github.com/DanielXMoore/Civet/commit/04bd9e2d6a20687cf7f3d6ae662f93e893ed5cac))

## 0.5.23 (2023-01-05, [diff](https://github.com/DanielXMoore/Civet/compare/29c37a4dcd9f8095e0fc9f14230c1948ac8b4d14...72afca957ffa68e93ffa49dbe54f1c2e0b823be8), [commit](https://github.com/DanielXMoore/Civet/commit/72afca957ffa68e93ffa49dbe54f1c2e0b823be8))

## 0.5.22 (2023-01-05, [diff](https://github.com/DanielXMoore/Civet/compare/2ee18b276daf3d9ff58bf74d04132678e2d72c94...29c37a4dcd9f8095e0fc9f14230c1948ac8b4d14), [commit](https://github.com/DanielXMoore/Civet/commit/29c37a4dcd9f8095e0fc9f14230c1948ac8b4d14))

## 0.5.21 (2023-01-04, [diff](https://github.com/DanielXMoore/Civet/compare/79488d6314764ab1656625f2b0043fe781e71ee8...2ee18b276daf3d9ff58bf74d04132678e2d72c94), [commit](https://github.com/DanielXMoore/Civet/commit/2ee18b276daf3d9ff58bf74d04132678e2d72c94))

## 0.5.20 (2023-01-03, [diff](https://github.com/DanielXMoore/Civet/compare/b81761f85db339c45553fe5163109682df2d56c4...79488d6314764ab1656625f2b0043fe781e71ee8), [commit](https://github.com/DanielXMoore/Civet/commit/79488d6314764ab1656625f2b0043fe781e71ee8))

## 0.5.19 (2022-12-31, [diff](https://github.com/DanielXMoore/Civet/compare/ceb593cc902ae1a9410df28a6200dc8ad80fd21b...b81761f85db339c45553fe5163109682df2d56c4), [commit](https://github.com/DanielXMoore/Civet/commit/b81761f85db339c45553fe5163109682df2d56c4))

## 0.5.18 (2022-12-30, [diff](https://github.com/DanielXMoore/Civet/compare/5619c2e34f587114492e1d132c16ef95108a6367...ceb593cc902ae1a9410df28a6200dc8ad80fd21b), [commit](https://github.com/DanielXMoore/Civet/commit/ceb593cc902ae1a9410df28a6200dc8ad80fd21b))

## 0.5.16 (2022-12-29, [diff](https://github.com/DanielXMoore/Civet/compare/ccdfae48b1700da8ee198e9ee1058c236d450005...5619c2e34f587114492e1d132c16ef95108a6367), [commit](https://github.com/DanielXMoore/Civet/commit/5619c2e34f587114492e1d132c16ef95108a6367))

## 0.5.15 (2022-12-29, [diff](https://github.com/DanielXMoore/Civet/compare/cf43da26f02a926be32f716966ab0bf50bfc2791...ccdfae48b1700da8ee198e9ee1058c236d450005), [commit](https://github.com/DanielXMoore/Civet/commit/ccdfae48b1700da8ee198e9ee1058c236d450005))

## 0.5.14 (2022-12-29, [diff](https://github.com/DanielXMoore/Civet/compare/e69e17869570edc32806cdeeabc5d938c1853a47...cf43da26f02a926be32f716966ab0bf50bfc2791), [commit](https://github.com/DanielXMoore/Civet/commit/cf43da26f02a926be32f716966ab0bf50bfc2791))

## 0.5.13 (2022-12-29, [diff](https://github.com/DanielXMoore/Civet/compare/81c12591410c45b5266b0602689a436635d10545...e69e17869570edc32806cdeeabc5d938c1853a47), [commit](https://github.com/DanielXMoore/Civet/commit/e69e17869570edc32806cdeeabc5d938c1853a47))

## 0.5.12 (2022-12-26, [diff](https://github.com/DanielXMoore/Civet/compare/33430360f3790ed8654fe3620a49d0df4778d9a3...81c12591410c45b5266b0602689a436635d10545), [commit](https://github.com/DanielXMoore/Civet/commit/81c12591410c45b5266b0602689a436635d10545))

## 0.5.11 (2022-12-25, [diff](https://github.com/DanielXMoore/Civet/compare/19c07671ab3205fc14ed0bf8241c4ff916c3549a...33430360f3790ed8654fe3620a49d0df4778d9a3), [commit](https://github.com/DanielXMoore/Civet/commit/33430360f3790ed8654fe3620a49d0df4778d9a3))

## 0.5.10 (2022-12-23, [diff](https://github.com/DanielXMoore/Civet/compare/5a95bc2df71a23cf1677ad8f869d089d5cebce55...19c07671ab3205fc14ed0bf8241c4ff916c3549a), [commit](https://github.com/DanielXMoore/Civet/commit/19c07671ab3205fc14ed0bf8241c4ff916c3549a))

## 0.5.9 (2022-12-23, [diff](https://github.com/DanielXMoore/Civet/compare/a0b54f4866d9842c4d6ec150c00a30b9753bfbe2...5a95bc2df71a23cf1677ad8f869d089d5cebce55), [commit](https://github.com/DanielXMoore/Civet/commit/5a95bc2df71a23cf1677ad8f869d089d5cebce55))

## 0.5.8 (2022-12-22, [diff](https://github.com/DanielXMoore/Civet/compare/fbeb8af5de4057d42d7f4728fbf338e545ff6074...a0b54f4866d9842c4d6ec150c00a30b9753bfbe2), [commit](https://github.com/DanielXMoore/Civet/commit/a0b54f4866d9842c4d6ec150c00a30b9753bfbe2))

## 0.5.7 (2022-12-20, [diff](https://github.com/DanielXMoore/Civet/compare/b92b7259aabcea45aa372d89bf9a88c902070bfc...fbeb8af5de4057d42d7f4728fbf338e545ff6074), [commit](https://github.com/DanielXMoore/Civet/commit/fbeb8af5de4057d42d7f4728fbf338e545ff6074))

## 0.5.6 (2022-12-20, [diff](https://github.com/DanielXMoore/Civet/compare/399a03a84a4c5449a8a3be55528934e9e41a47c3...b92b7259aabcea45aa372d89bf9a88c902070bfc), [commit](https://github.com/DanielXMoore/Civet/commit/b92b7259aabcea45aa372d89bf9a88c902070bfc))

## 0.5.5 (2022-12-18, [diff](https://github.com/DanielXMoore/Civet/compare/204780f4130b5d6c693dd2a950af6f45c22e2ff3...399a03a84a4c5449a8a3be55528934e9e41a47c3), [commit](https://github.com/DanielXMoore/Civet/commit/399a03a84a4c5449a8a3be55528934e9e41a47c3))

## 0.5.4 (2022-12-18, [diff](https://github.com/DanielXMoore/Civet/compare/f511a0642f5d2b7ac23f24fe680d15d08b378729...204780f4130b5d6c693dd2a950af6f45c22e2ff3), [commit](https://github.com/DanielXMoore/Civet/commit/204780f4130b5d6c693dd2a950af6f45c22e2ff3))

## 0.5.3 (2022-12-17, [diff](https://github.com/DanielXMoore/Civet/compare/bfcfbb9ff64367f7afbd82727570248a9524331f...f511a0642f5d2b7ac23f24fe680d15d08b378729), [commit](https://github.com/DanielXMoore/Civet/commit/f511a0642f5d2b7ac23f24fe680d15d08b378729))

## 0.5.2 (2022-12-17, [diff](https://github.com/DanielXMoore/Civet/compare/cc2317049af8b676389f6d13a4782a5cd3b3928d...bfcfbb9ff64367f7afbd82727570248a9524331f), [commit](https://github.com/DanielXMoore/Civet/commit/bfcfbb9ff64367f7afbd82727570248a9524331f))

## 0.5.1 (2022-12-16, [diff](https://github.com/DanielXMoore/Civet/compare/bf842cdb9ecfc53d8bf0a65b0386a49a47afb88d...cc2317049af8b676389f6d13a4782a5cd3b3928d), [commit](https://github.com/DanielXMoore/Civet/commit/cc2317049af8b676389f6d13a4782a5cd3b3928d))

## 0.5.0 (2022-12-14, [diff](https://github.com/DanielXMoore/Civet/compare/dec48d39677756ade4b210d40de64fc8b8bd7c97...bf842cdb9ecfc53d8bf0a65b0386a49a47afb88d), [commit](https://github.com/DanielXMoore/Civet/commit/bf842cdb9ecfc53d8bf0a65b0386a49a47afb88d))

## 0.4.38 (2022-12-13, [diff](https://github.com/DanielXMoore/Civet/compare/e7ae86f976489ae60668ae757f2eca7a124174ec...dec48d39677756ade4b210d40de64fc8b8bd7c97), [commit](https://github.com/DanielXMoore/Civet/commit/dec48d39677756ade4b210d40de64fc8b8bd7c97))

## 0.4.37 (2022-12-13, [diff](https://github.com/DanielXMoore/Civet/compare/e21f350ee767f90bf5dd06f98771b2441d9a9d6e...e7ae86f976489ae60668ae757f2eca7a124174ec), [commit](https://github.com/DanielXMoore/Civet/commit/e7ae86f976489ae60668ae757f2eca7a124174ec))

## 0.4.36 (2022-12-13, [diff](https://github.com/DanielXMoore/Civet/compare/f0204d24522e8666b0e6a9cdfdbb65d30c1ddece...e21f350ee767f90bf5dd06f98771b2441d9a9d6e), [commit](https://github.com/DanielXMoore/Civet/commit/e21f350ee767f90bf5dd06f98771b2441d9a9d6e))

## 0.4.35 (2022-12-12, [diff](https://github.com/DanielXMoore/Civet/compare/ff9ffd2e037c51c9e08e01624d521033e7542d67...f0204d24522e8666b0e6a9cdfdbb65d30c1ddece), [commit](https://github.com/DanielXMoore/Civet/commit/f0204d24522e8666b0e6a9cdfdbb65d30c1ddece))

## 0.4.34 (2022-12-12, [diff](https://github.com/DanielXMoore/Civet/compare/06798b59565601ff36a03bc0646b3b4768634940...ff9ffd2e037c51c9e08e01624d521033e7542d67), [commit](https://github.com/DanielXMoore/Civet/commit/ff9ffd2e037c51c9e08e01624d521033e7542d67))

## 0.4.33 (2022-12-11, [diff](https://github.com/DanielXMoore/Civet/compare/75764ba6018bb28141d201850a2ede39ae11d5e5...06798b59565601ff36a03bc0646b3b4768634940), [commit](https://github.com/DanielXMoore/Civet/commit/06798b59565601ff36a03bc0646b3b4768634940))

## 0.4.32 (2022-12-11, [diff](https://github.com/DanielXMoore/Civet/compare/cf9b12acc117b472764ef0b222e6d834f113678e...75764ba6018bb28141d201850a2ede39ae11d5e5), [commit](https://github.com/DanielXMoore/Civet/commit/75764ba6018bb28141d201850a2ede39ae11d5e5))

## 0.4.31 (2022-12-11, [diff](https://github.com/DanielXMoore/Civet/compare/7135f7110ffdbdbdd474d010ab76c46d85a6c4e6...cf9b12acc117b472764ef0b222e6d834f113678e), [commit](https://github.com/DanielXMoore/Civet/commit/cf9b12acc117b472764ef0b222e6d834f113678e))

## 0.4.28 (2022-12-10, [diff](https://github.com/DanielXMoore/Civet/compare/63a97b416dda0f4cdb5c5d1dc52f66dba2dd4f2e...7135f7110ffdbdbdd474d010ab76c46d85a6c4e6), [commit](https://github.com/DanielXMoore/Civet/commit/7135f7110ffdbdbdd474d010ab76c46d85a6c4e6))

## 0.4.27 (2022-12-10, [diff](https://github.com/DanielXMoore/Civet/compare/35a1275547d73bb2addfd77ef1db722aea9575c1...63a97b416dda0f4cdb5c5d1dc52f66dba2dd4f2e), [commit](https://github.com/DanielXMoore/Civet/commit/63a97b416dda0f4cdb5c5d1dc52f66dba2dd4f2e))

## 0.4.26 (2022-12-10, [diff](https://github.com/DanielXMoore/Civet/compare/c8f9626f0226d7509e43adb6e7e951af1dd6aace...35a1275547d73bb2addfd77ef1db722aea9575c1), [commit](https://github.com/DanielXMoore/Civet/commit/35a1275547d73bb2addfd77ef1db722aea9575c1))

## 0.4.25 (2022-12-10, [diff](https://github.com/DanielXMoore/Civet/compare/f0629ff0b48a58ba373a34ce33ef76aa06a4b27c...c8f9626f0226d7509e43adb6e7e951af1dd6aace), [commit](https://github.com/DanielXMoore/Civet/commit/c8f9626f0226d7509e43adb6e7e951af1dd6aace))

## 0.4.24 (2022-12-10, [diff](https://github.com/DanielXMoore/Civet/compare/6e91a9e29d93f29f819bea11a163e3acbc9b731d...f0629ff0b48a58ba373a34ce33ef76aa06a4b27c), [commit](https://github.com/DanielXMoore/Civet/commit/f0629ff0b48a58ba373a34ce33ef76aa06a4b27c))

## 0.4.23 (2022-12-08, [diff](https://github.com/DanielXMoore/Civet/compare/314a422c7b9755534807f1b091a1e4b4a3346f8a...6e91a9e29d93f29f819bea11a163e3acbc9b731d), [commit](https://github.com/DanielXMoore/Civet/commit/6e91a9e29d93f29f819bea11a163e3acbc9b731d))
* CoffeeScript export to-do [[#22](https://github.com/DanielXMoore/Civet/pull/22)]
* Add command to restart language server [[#23](https://github.com/DanielXMoore/Civet/pull/23)]

## 0.4.22 (2022-12-07, [diff](https://github.com/DanielXMoore/Civet/compare/bcc692fefa71ab70977233dc3b05b5aefac01ed0...314a422c7b9755534807f1b091a1e4b4a3346f8a), [commit](https://github.com/DanielXMoore/Civet/commit/314a422c7b9755534807f1b091a1e4b4a3346f8a))
* More consistent use of paths vs. file URIs [[#19](https://github.com/DanielXMoore/Civet/pull/19)]
* Support for unbraced `export x, y` [[#21](https://github.com/DanielXMoore/Civet/pull/21)]

## 0.4.21 (2022-12-04, [diff](https://github.com/DanielXMoore/Civet/compare/ebc47fedd7aa009ea903d11d32fd5e21902e9f5c...bcc692fefa71ab70977233dc3b05b5aefac01ed0), [commit](https://github.com/DanielXMoore/Civet/commit/bcc692fefa71ab70977233dc3b05b5aefac01ed0))

## 0.4.20 (2022-12-02, [diff](https://github.com/DanielXMoore/Civet/compare/5f3e59a550531fe6f4a3426466a8326b4d88b36d...ebc47fedd7aa009ea903d11d32fd5e21902e9f5c), [commit](https://github.com/DanielXMoore/Civet/commit/ebc47fedd7aa009ea903d11d32fd5e21902e9f5c))

## 0.4.19-pre.14 (2022-11-29, [diff](https://github.com/DanielXMoore/Civet/compare/f8d85c81f88f8a0a20cc3ccaa03eaf8fa06a10c1...5f3e59a550531fe6f4a3426466a8326b4d88b36d), [commit](https://github.com/DanielXMoore/Civet/commit/5f3e59a550531fe6f4a3426466a8326b4d88b36d))
* Allow and= / or= by default (not just coffeeCompat) [[#16](https://github.com/DanielXMoore/Civet/pull/16)]
* MIT license [[#17](https://github.com/DanielXMoore/Civet/pull/17)]

## 0.4.19-pre.13 (2022-11-26, [diff](https://github.com/DanielXMoore/Civet/compare/5f69db28ac8f98b3c8dd8a5a3e36c62b4e514633...f8d85c81f88f8a0a20cc3ccaa03eaf8fa06a10c1), [commit](https://github.com/DanielXMoore/Civet/commit/f8d85c81f88f8a0a20cc3ccaa03eaf8fa06a10c1))

## 0.4.19-pre.12 (2022-11-26, [diff](https://github.com/DanielXMoore/Civet/compare/312a0befcd065efd22fcaba2398ae9cd55ed014d...5f69db28ac8f98b3c8dd8a5a3e36c62b4e514633), [commit](https://github.com/DanielXMoore/Civet/commit/5f69db28ac8f98b3c8dd8a5a3e36c62b4e514633))

## 0.4.19-pre.11 (2022-11-24, [diff](https://github.com/DanielXMoore/Civet/compare/6d563ef0c877f81e3749f8dcb4cbc56390812285...312a0befcd065efd22fcaba2398ae9cd55ed014d), [commit](https://github.com/DanielXMoore/Civet/commit/312a0befcd065efd22fcaba2398ae9cd55ed014d))
* Caching [[#14](https://github.com/DanielXMoore/Civet/pull/14)]

## 0.4.19-pre.10 (2022-11-24, [diff](https://github.com/DanielXMoore/Civet/compare/45ae6879e140818345d5ace5ef081e4355224261...6d563ef0c877f81e3749f8dcb4cbc56390812285), [commit](https://github.com/DanielXMoore/Civet/commit/6d563ef0c877f81e3749f8dcb4cbc56390812285))

## 0.4.19-pre.9 (2022-11-12, [diff](https://github.com/DanielXMoore/Civet/compare/8d74fecf354c1f45fa7d451c2d50662c2358077c...45ae6879e140818345d5ace5ef081e4355224261), [commit](https://github.com/DanielXMoore/Civet/commit/45ae6879e140818345d5ace5ef081e4355224261))

## 0.4.19-pre.7 (2022-11-11, [diff](https://github.com/DanielXMoore/Civet/compare/8e5c2794447cfaa07c8c33a35ff7d15c0ee3432d...8d74fecf354c1f45fa7d451c2d50662c2358077c), [commit](https://github.com/DanielXMoore/Civet/commit/8d74fecf354c1f45fa7d451c2d50662c2358077c))

## 0.4.19-pre.6 (2022-11-10, [diff](https://github.com/DanielXMoore/Civet/compare/3a804906686da7c1fbaebefe81b4d63ee4bd8992...8e5c2794447cfaa07c8c33a35ff7d15c0ee3432d), [commit](https://github.com/DanielXMoore/Civet/commit/8e5c2794447cfaa07c8c33a35ff7d15c0ee3432d))

## 0.4.19-pre.5 (2022-11-10, [diff](https://github.com/DanielXMoore/Civet/compare/129984988503aec70bf6ed00352094dffa67c526...3a804906686da7c1fbaebefe81b4d63ee4bd8992), [commit](https://github.com/DanielXMoore/Civet/commit/3a804906686da7c1fbaebefe81b4d63ee4bd8992))

## 0.4.19-pre.4 (2022-11-10, [diff](https://github.com/DanielXMoore/Civet/compare/cb25822316a201f12639586190c541740a39722b...129984988503aec70bf6ed00352094dffa67c526), [commit](https://github.com/DanielXMoore/Civet/commit/129984988503aec70bf6ed00352094dffa67c526))
* Add script for testing compatibility with CoffeeScript [[#7](https://github.com/DanielXMoore/Civet/pull/7)]

## 0.4.19-pre.3 (2022-11-09, [diff](https://github.com/DanielXMoore/Civet/compare/2df272f1af72382d433134bcc71f0fe5aefeb515...cb25822316a201f12639586190c541740a39722b), [commit](https://github.com/DanielXMoore/Civet/commit/cb25822316a201f12639586190c541740a39722b))

## 0.4.19-pre.2 (2022-11-09, [diff](https://github.com/DanielXMoore/Civet/compare/b719c45c603fc79e1b0adbce71520e13ab4c144f...2df272f1af72382d433134bcc71f0fe5aefeb515), [commit](https://github.com/DanielXMoore/Civet/commit/2df272f1af72382d433134bcc71f0fe5aefeb515))

## 0.4.19-pre.1 (2022-11-08, [diff](https://github.com/DanielXMoore/Civet/compare/ac95b51521aa22517cae3740bb6031c192294890...b719c45c603fc79e1b0adbce71520e13ab4c144f), [commit](https://github.com/DanielXMoore/Civet/commit/b719c45c603fc79e1b0adbce71520e13ab4c144f))

## 0.4.19-pre.0 (2022-11-08, [diff](https://github.com/DanielXMoore/Civet/compare/2977f71a3b4e667aa10fbc63f75ae3b18ea64186...ac95b51521aa22517cae3740bb6031c192294890), [commit](https://github.com/DanielXMoore/Civet/commit/ac95b51521aa22517cae3740bb6031c192294890))

## 0.4.18.3 (2022-11-08, [diff](https://github.com/DanielXMoore/Civet/compare/88ebb96e5237ea6b27ca74db30809ccc942dbacf...2977f71a3b4e667aa10fbc63f75ae3b18ea64186), [commit](https://github.com/DanielXMoore/Civet/commit/2977f71a3b4e667aa10fbc63f75ae3b18ea64186))
* Rewrite cli to use readline interface [[#6](https://github.com/DanielXMoore/Civet/pull/6)]

## 0.4.18.2 (2022-11-07, [diff](https://github.com/DanielXMoore/Civet/compare/85446ebde2407bd1e7a4b6d8c93ca0502f73f6c1...88ebb96e5237ea6b27ca74db30809ccc942dbacf), [commit](https://github.com/DanielXMoore/Civet/commit/88ebb96e5237ea6b27ca74db30809ccc942dbacf))

## 0.4.18.1 (2022-11-07, [diff](https://github.com/DanielXMoore/Civet/compare/b4cab80d14e91d207a39ddec9197ef2a95e39bf9...85446ebde2407bd1e7a4b6d8c93ca0502f73f6c1), [commit](https://github.com/DanielXMoore/Civet/commit/85446ebde2407bd1e7a4b6d8c93ca0502f73f6c1))

## 0.4.18 (2022-11-07, [diff](https://github.com/DanielXMoore/Civet/compare/efadd1a45674523ca1af0b2a433de4d2ba59f987...b4cab80d14e91d207a39ddec9197ef2a95e39bf9), [commit](https://github.com/DanielXMoore/Civet/commit/b4cab80d14e91d207a39ddec9197ef2a95e39bf9))
* Coffee comprehensions [[#4](https://github.com/DanielXMoore/Civet/pull/4)]

## 0.4.17 (2022-11-02, [diff](https://github.com/DanielXMoore/Civet/compare/66464352793abe39b15eece25a527078d616a028...efadd1a45674523ca1af0b2a433de4d2ba59f987), [commit](https://github.com/DanielXMoore/Civet/commit/efadd1a45674523ca1af0b2a433de4d2ba59f987))
* Auto var [[#3](https://github.com/DanielXMoore/Civet/pull/3)]

## 0.4.16 (2022-10-25, [diff](https://github.com/DanielXMoore/Civet/compare/0646c355a0e06c04e07dec65254d728aaf79aff8...66464352793abe39b15eece25a527078d616a028), [commit](https://github.com/DanielXMoore/Civet/commit/66464352793abe39b15eece25a527078d616a028))

## 0.4.15 (2022-10-24, [diff](https://github.com/DanielXMoore/Civet/compare/398797d3e4a4ebe68cf23438976577267e70ed8d...0646c355a0e06c04e07dec65254d728aaf79aff8), [commit](https://github.com/DanielXMoore/Civet/commit/0646c355a0e06c04e07dec65254d728aaf79aff8))

## 0.4.14 (2022-10-24, [diff](https://github.com/DanielXMoore/Civet/compare/0a3d805395fd7da1a11afc3f5d1976ca83ef5144...398797d3e4a4ebe68cf23438976577267e70ed8d), [commit](https://github.com/DanielXMoore/Civet/commit/398797d3e4a4ebe68cf23438976577267e70ed8d))

## 0.4.13 (2022-10-24, [diff](https://github.com/DanielXMoore/Civet/compare/04a03a21a8e651d2be654b0a524e17ee3df97dd0...0a3d805395fd7da1a11afc3f5d1976ca83ef5144), [commit](https://github.com/DanielXMoore/Civet/commit/0a3d805395fd7da1a11afc3f5d1976ca83ef5144))

## 0.4.12 (2022-10-18, [diff](https://github.com/DanielXMoore/Civet/compare/99dfca9ac523f4200c20383e9dfdfa4251cf5034...04a03a21a8e651d2be654b0a524e17ee3df97dd0), [commit](https://github.com/DanielXMoore/Civet/commit/04a03a21a8e651d2be654b0a524e17ee3df97dd0))

## 0.4.10 (2022-10-17, [diff](https://github.com/DanielXMoore/Civet/compare/4a54cf311b43dbf1e4702a0394894bfb1cefe66b...99dfca9ac523f4200c20383e9dfdfa4251cf5034), [commit](https://github.com/DanielXMoore/Civet/commit/99dfca9ac523f4200c20383e9dfdfa4251cf5034))

## 0.4.9 (2022-10-12, [diff](https://github.com/DanielXMoore/Civet/compare/5a453c2f0648dda35ecd56b459320ef4a14b11c6...4a54cf311b43dbf1e4702a0394894bfb1cefe66b), [commit](https://github.com/DanielXMoore/Civet/commit/4a54cf311b43dbf1e4702a0394894bfb1cefe66b))

## 0.4.8 (2022-10-11, [diff](https://github.com/DanielXMoore/Civet/compare/0fca9214ce0e80b782f0bd70a3e72045ad3606ec...5a453c2f0648dda35ecd56b459320ef4a14b11c6), [commit](https://github.com/DanielXMoore/Civet/commit/5a453c2f0648dda35ecd56b459320ef4a14b11c6))

## 0.4.7 (2022-10-10, [diff](https://github.com/DanielXMoore/Civet/compare/fb37e259b3696f4a5bf15b5e53b1d1a063dad549...0fca9214ce0e80b782f0bd70a3e72045ad3606ec), [commit](https://github.com/DanielXMoore/Civet/commit/0fca9214ce0e80b782f0bd70a3e72045ad3606ec))

## 0.4.6 (2022-10-01, [diff](https://github.com/DanielXMoore/Civet/compare/a876a92b378a872bb84530744426f0143864d9b9...fb37e259b3696f4a5bf15b5e53b1d1a063dad549), [commit](https://github.com/DanielXMoore/Civet/commit/fb37e259b3696f4a5bf15b5e53b1d1a063dad549))

## 0.4.5 (2022-10-01, [diff](https://github.com/DanielXMoore/Civet/compare/1d3ca09c6df5960aeaab6700962d3cc0e875b6b3...a876a92b378a872bb84530744426f0143864d9b9), [commit](https://github.com/DanielXMoore/Civet/commit/a876a92b378a872bb84530744426f0143864d9b9))

## 0.4.4 (2022-09-30, [diff](https://github.com/DanielXMoore/Civet/compare/25a8dd8b74dea55280e5e838439b8c9dc07a9fdc...1d3ca09c6df5960aeaab6700962d3cc0e875b6b3), [commit](https://github.com/DanielXMoore/Civet/commit/1d3ca09c6df5960aeaab6700962d3cc0e875b6b3))

## 0.4.3 (2022-09-29, [diff](https://github.com/DanielXMoore/Civet/compare/fe3280119b26ebee12d96d9d0c8a49878d5f38b9...25a8dd8b74dea55280e5e838439b8c9dc07a9fdc), [commit](https://github.com/DanielXMoore/Civet/commit/25a8dd8b74dea55280e5e838439b8c9dc07a9fdc))

## 0.4.2 (2022-09-29, [diff](https://github.com/DanielXMoore/Civet/compare/4f5e529f411e633c5f856b77aa165ed6b620c373...fe3280119b26ebee12d96d9d0c8a49878d5f38b9), [commit](https://github.com/DanielXMoore/Civet/commit/fe3280119b26ebee12d96d9d0c8a49878d5f38b9))

## 0.4.0 (2022-09-27, [diff](https://github.com/DanielXMoore/Civet/compare/0def4a21e56f91e7a4b8d3165764ae2a05640c36...4f5e529f411e633c5f856b77aa165ed6b620c373), [commit](https://github.com/DanielXMoore/Civet/commit/4f5e529f411e633c5f856b77aa165ed6b620c373))

## 0.3.16 (2022-09-24, [diff](https://github.com/DanielXMoore/Civet/compare/0447364f0c3fc108c09a7ceaa37e7c25da8ccac1...0def4a21e56f91e7a4b8d3165764ae2a05640c36), [commit](https://github.com/DanielXMoore/Civet/commit/0def4a21e56f91e7a4b8d3165764ae2a05640c36))

## 0.3.15 (2022-09-22, [diff](https://github.com/DanielXMoore/Civet/compare/1c029edc4493ac167108c2f4a587abcf0835a171...0447364f0c3fc108c09a7ceaa37e7c25da8ccac1), [commit](https://github.com/DanielXMoore/Civet/commit/0447364f0c3fc108c09a7ceaa37e7c25da8ccac1))

## 0.3.14 (2022-09-22, [diff](https://github.com/DanielXMoore/Civet/compare/c5b89694c5921968532b285bd8ff45dbbf3de9d6...1c029edc4493ac167108c2f4a587abcf0835a171), [commit](https://github.com/DanielXMoore/Civet/commit/1c029edc4493ac167108c2f4a587abcf0835a171))

## 0.3.13 (2022-09-22, [diff](https://github.com/DanielXMoore/Civet/compare/fb6b728d6515d06732591519f94d1aa3e02bc609...c5b89694c5921968532b285bd8ff45dbbf3de9d6), [commit](https://github.com/DanielXMoore/Civet/commit/c5b89694c5921968532b285bd8ff45dbbf3de9d6))

## 0.3.12 (2022-09-22, [diff](https://github.com/DanielXMoore/Civet/compare/b2cf3c3b69c1ec2b6d0cbffdbc7487159847665c...fb6b728d6515d06732591519f94d1aa3e02bc609), [commit](https://github.com/DanielXMoore/Civet/commit/fb6b728d6515d06732591519f94d1aa3e02bc609))
* Transpilation overhaul [[#1](https://github.com/DanielXMoore/Civet/pull/1)]

## 0.3.10 (2022-09-14, [diff](https://github.com/DanielXMoore/Civet/compare/db1d279d04581e19bed42122a08741ed047085bc...b2cf3c3b69c1ec2b6d0cbffdbc7487159847665c), [commit](https://github.com/DanielXMoore/Civet/commit/b2cf3c3b69c1ec2b6d0cbffdbc7487159847665c))

## 0.3.9 (2022-09-14, [diff](https://github.com/DanielXMoore/Civet/compare/85159b7841d6591d7aeaa3450da65470139c6daa...db1d279d04581e19bed42122a08741ed047085bc), [commit](https://github.com/DanielXMoore/Civet/commit/db1d279d04581e19bed42122a08741ed047085bc))

## 0.3.8 (2022-09-14, [diff](https://github.com/DanielXMoore/Civet/compare/79dd606983d5c9ebd3fca0f39caaabe9318e4f57...85159b7841d6591d7aeaa3450da65470139c6daa), [commit](https://github.com/DanielXMoore/Civet/commit/85159b7841d6591d7aeaa3450da65470139c6daa))

## 0.3.7 (2022-09-14, [diff](https://github.com/DanielXMoore/Civet/compare/4de40724ee0ab3f3d7c8551eeae56677935f6001...79dd606983d5c9ebd3fca0f39caaabe9318e4f57), [commit](https://github.com/DanielXMoore/Civet/commit/79dd606983d5c9ebd3fca0f39caaabe9318e4f57))

## 0.3.6 (2022-09-13, [diff](https://github.com/DanielXMoore/Civet/compare/728d416d133652863923119c81a2af80d02e6560...4de40724ee0ab3f3d7c8551eeae56677935f6001), [commit](https://github.com/DanielXMoore/Civet/commit/4de40724ee0ab3f3d7c8551eeae56677935f6001))

## 0.3.5 (2022-09-13, [diff](https://github.com/DanielXMoore/Civet/compare/cd07674bf5e57bc0c2798a3098b073ce67bf20f0...728d416d133652863923119c81a2af80d02e6560), [commit](https://github.com/DanielXMoore/Civet/commit/728d416d133652863923119c81a2af80d02e6560))

## 0.3.4 (2022-09-13, [diff](https://github.com/DanielXMoore/Civet/compare/acac81005f88dde51eb7d329741c495d13be26ce...cd07674bf5e57bc0c2798a3098b073ce67bf20f0), [commit](https://github.com/DanielXMoore/Civet/commit/cd07674bf5e57bc0c2798a3098b073ce67bf20f0))

## 0.3.3 (2022-09-13, [diff](https://github.com/DanielXMoore/Civet/compare/0ea857825c4ab3e5ab85080e92ed94f601a6c9ad...acac81005f88dde51eb7d329741c495d13be26ce), [commit](https://github.com/DanielXMoore/Civet/commit/acac81005f88dde51eb7d329741c495d13be26ce))

## 0.3.2 (2022-09-13, [diff](https://github.com/DanielXMoore/Civet/compare/182f5707d3e9bd9150632073602027362d4d0edc...0ea857825c4ab3e5ab85080e92ed94f601a6c9ad), [commit](https://github.com/DanielXMoore/Civet/commit/0ea857825c4ab3e5ab85080e92ed94f601a6c9ad))

## 0.3.1 (2022-09-11, [diff](https://github.com/DanielXMoore/Civet/compare/93d7ba129a06aeee78bf342f42bc30c9ef4cc8e3...182f5707d3e9bd9150632073602027362d4d0edc), [commit](https://github.com/DanielXMoore/Civet/commit/182f5707d3e9bd9150632073602027362d4d0edc))

## 0.3.0 (2022-09-09, [diff](https://github.com/DanielXMoore/Civet/compare/2f0b5b1d8b3ef81988b4168c15e150665a94380c...93d7ba129a06aeee78bf342f42bc30c9ef4cc8e3), [commit](https://github.com/DanielXMoore/Civet/commit/93d7ba129a06aeee78bf342f42bc30c9ef4cc8e3))

## 0.2.16 (2022-09-07, [diff](https://github.com/DanielXMoore/Civet/compare/e513500f19d5ed5781af237e54da709975030675...2f0b5b1d8b3ef81988b4168c15e150665a94380c), [commit](https://github.com/DanielXMoore/Civet/commit/2f0b5b1d8b3ef81988b4168c15e150665a94380c))

## 0.2.15 (2022-09-05, [diff](https://github.com/DanielXMoore/Civet/compare/3ad90bc5f528b58f3228af173d14a427f2f98045...e513500f19d5ed5781af237e54da709975030675), [commit](https://github.com/DanielXMoore/Civet/commit/e513500f19d5ed5781af237e54da709975030675))

## 0.2.14 (2022-09-04, [diff](https://github.com/DanielXMoore/Civet/compare/69826a67a7c2bdfa87beb61f32fca54cc7528809...3ad90bc5f528b58f3228af173d14a427f2f98045), [commit](https://github.com/DanielXMoore/Civet/commit/3ad90bc5f528b58f3228af173d14a427f2f98045))

## 0.2.13 (2022-08-27, [diff](https://github.com/DanielXMoore/Civet/compare/b3b649b74a265a61a1083c4d6558230d3ee3dc10...69826a67a7c2bdfa87beb61f32fca54cc7528809), [commit](https://github.com/DanielXMoore/Civet/commit/69826a67a7c2bdfa87beb61f32fca54cc7528809))

## 0.2.12 (2022-08-26, [diff](https://github.com/DanielXMoore/Civet/compare/ad754dc4782c7af724748d2b1c73c5163dd63aa9...b3b649b74a265a61a1083c4d6558230d3ee3dc10), [commit](https://github.com/DanielXMoore/Civet/commit/b3b649b74a265a61a1083c4d6558230d3ee3dc10))

## 0.2.11 (2022-08-26, [diff](https://github.com/DanielXMoore/Civet/compare/7e7a7bebe9fa3ea687536b31ea4cb0e82e3eb350...ad754dc4782c7af724748d2b1c73c5163dd63aa9), [commit](https://github.com/DanielXMoore/Civet/commit/ad754dc4782c7af724748d2b1c73c5163dd63aa9))

## 0.2.9 (2022-08-25, [diff](https://github.com/DanielXMoore/Civet/compare/1af9c3aaef7b6d3dc8c54bdb167c30540d40b4d0...7e7a7bebe9fa3ea687536b31ea4cb0e82e3eb350), [commit](https://github.com/DanielXMoore/Civet/commit/7e7a7bebe9fa3ea687536b31ea4cb0e82e3eb350))

## 0.2.8 (2022-08-25, [diff](https://github.com/DanielXMoore/Civet/compare/6b03531413668486beb43e25a5f227bc8a412f12...1af9c3aaef7b6d3dc8c54bdb167c30540d40b4d0), [commit](https://github.com/DanielXMoore/Civet/commit/1af9c3aaef7b6d3dc8c54bdb167c30540d40b4d0))

## 0.2.7 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/b30ebdd28e7430f2076bead7e0014cb76e4fe3bd...6b03531413668486beb43e25a5f227bc8a412f12), [commit](https://github.com/DanielXMoore/Civet/commit/6b03531413668486beb43e25a5f227bc8a412f12))

## 0.2.6 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/e930db26f031698302373459b92749f585da7f81...b30ebdd28e7430f2076bead7e0014cb76e4fe3bd), [commit](https://github.com/DanielXMoore/Civet/commit/b30ebdd28e7430f2076bead7e0014cb76e4fe3bd))

## 0.2.5 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/c3b164f6377631abdd48104120cd06307bd52f0c...e930db26f031698302373459b92749f585da7f81), [commit](https://github.com/DanielXMoore/Civet/commit/e930db26f031698302373459b92749f585da7f81))

## 0.2.4 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/0a0628cdc691396530dbb80ce9affbb1ac5415b8...c3b164f6377631abdd48104120cd06307bd52f0c), [commit](https://github.com/DanielXMoore/Civet/commit/c3b164f6377631abdd48104120cd06307bd52f0c))

## 0.2.3 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/a6fe0838d0198e65dd331dcec61092f048fdbc3e...0a0628cdc691396530dbb80ce9affbb1ac5415b8), [commit](https://github.com/DanielXMoore/Civet/commit/0a0628cdc691396530dbb80ce9affbb1ac5415b8))

## 0.2.2 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/570be10a179c8f348a7f776991b2e2033684d141...a6fe0838d0198e65dd331dcec61092f048fdbc3e), [commit](https://github.com/DanielXMoore/Civet/commit/a6fe0838d0198e65dd331dcec61092f048fdbc3e))

## 0.2.0 (2022-08-24, [diff](https://github.com/DanielXMoore/Civet/compare/63f0e43ab17b9c1f54b52ffafd015d621e3bfd6f...570be10a179c8f348a7f776991b2e2033684d141), [commit](https://github.com/DanielXMoore/Civet/commit/570be10a179c8f348a7f776991b2e2033684d141))

## 0.1.1 (2022-08-23, [diff](https://github.com/DanielXMoore/Civet/compare/5f2c466ea03360efa6461784e57a7702a1dfbbf9...63f0e43ab17b9c1f54b52ffafd015d621e3bfd6f), [commit](https://github.com/DanielXMoore/Civet/commit/63f0e43ab17b9c1f54b52ffafd015d621e3bfd6f))

## 0.1.0 (2022-08-07, [commit](https://github.com/DanielXMoore/Civet/commit/5f2c466ea03360efa6461784e57a7702a1dfbbf9))

