# Civet Changelog

This changelog is generated automatically by [`build/changelog.civet`](build/changelog.civet).

## 0.7.22
* add babel cjs [#1351]
* Automatic changelog creation [#1350]

## 0.7.21
* Fix `..` slice operator precedence [#1332]
* Fix `&&` chain precedence with bitwise `&`/`|`/`^` [#1334]
* Assignment operators for div and mod [#1338]
* Nested return type annotation [#1340]
* Fix relational chains involving `!=` [#1346]
* Add missing Unicode assignment operators [#1347]
* Fix CLI for globally installed Civet [#1348]
* CLI `-e`/`--eval` option for running/compiling a string [#1349]

## 0.7.20
* Fix whitespace in snug `<?` instanceof shorthand [#1329]
* Add `%/`/`÷` integer division, fix `%%` precedence [#1331]

## 0.7.19
* Prevent BinaryOp function shorthand from shadowing arrow functions. [#1317]
* Use register to avoid experimental loaders deprecation warning [#1324]
* Support for `unique symbol` type in TS [#1323]

## 0.7.18
* Jest integration [#1313]
* Hoist array binding and rest ref declarations. Fixes #1139. Fixes #1312 [#1314]

## 0.7.17
* Move unplugin and build using Civet instead of tsup [#1306]
* CLI tests [#1308]
* Fix import looking like multiplication [#1310]
* Fix indented chained ternaries [#1311]

## 0.7.16
* Fix pipe mode in CLI [#1305]

## 0.7.15
* More CLI/typechecking fixes [#1304]

## 0.7.14
* Fix some TS errors and increase code coverage [#1283]
* Fix extension for CLI's `--typecheck` [#1297]
* Fix if types [#1298]
* Add class with A, B mixin notation [#1299]
* Allow `civetConfig` in `package.`[`json`|`yaml`] [#1300]
* Typecheck fixes [#1302]

## 0.7.13
* Binary op fixes [#1282]
* Fix argument parsing [#1293]
* Cleanup Bun loader code [#1291]
* Self-test [#1292]
* Upgrade TypeScript [#1294]
* MaybeNested expressions [#1295]

## 0.7.12
* Pipe to dynamic import [#1275]
* Added a cache based on mtime for watch/serve mode in esbuild [#1276]
* Fix async detection in a few cases [#1278]
* Replacing some instances of __ with stricter whitespace checking [#1279]

## 0.7.11
* Fix source-map-support import with new NodeJS register [#1265]
* Update Civet and use try..else feature [#1266]
* Fix empty block in pattern matching with implicit return [#1268]
* Fix empty then clause in if expressions [#1269]
* Fix hoistDec within if expression [#1270]
* Revamp automatic async and generator, operator support [#1271]
* Sourcemap fix, show diagnostics with nonfatal parse errors [#1272]

## 0.7.10
* Use {} for empty if and else blocks [#1245]
* Argument magic with `coffeeDo` [#1246]
* Fix #1250 - source mapping for AtThis identifier [#1252]
* Generous matching of --version, --help [#1259]
* Upgrade Playground to modern Prettier [#1256]
* Invalid command-line argument handling [#1257]
* Fix ASI by handling tokens [#1260]
* Fix iteration expression unwrapping in splice assignment [#1261]
* Error nodes, ParseErrors get source-mapped location [#1262]
* Fix complex negative property access [#1263]

## 0.7.9
* Fix `.#x` [#1237]
* Config [#1243]

## 0.7.8
* Allow EmptyStatement in ClassBody [#1226]
* Fix preprocessing of declaration conditions [#1227]
* try else blocks [#1229]
* Declaration inside unless/until adds declaration after block [#1228]
* Fix duplicate property merging for props not actually bound [#1232]
* Ampersand fixes [#1233]

## 0.7.7
* Avoid expressionizing statements in fat arrow functions [#1221]
* Use context's globals instead of serializing there [#1220]
* comptime else blocks, else refactor [#1222]

## 0.7.6
* Avoid implicit return when block guarantees exit [#1211]
* ESLint plugin [#1205]
* Duplicate helpers in comptime blocks [#1212]
* Better require error messages in comptime [#1214]
* CLI avoid errors when output pipe gets closed [#1213]
* Don't emit newlines before block prefixes [#1216]
* throws can specify exception; ParseErrors type; bug fixes [#1217]
* eslint: comptime for version, assert instead of with [#1218]
* More comptime [#1219]

## 0.7.5
* Use `is like` in some cases [#1208]
* Improve log feedback in VSCode plugin [#1209]
* Async compile API with comptime, support require [#1186]
* Add LSP warning about using dev Civet [#1210]

## 0.7.4
* Comptime fixes [#1204]
* Detect Error nodes in inlineMap mode [#1207]

## 0.7.3
* Fix handling of empty arrays and objects in patterns [#1202]
* (is like ...) section, document "is not like" [#1203]

## 0.7.2
* First version of comptime (synchronous, no outer scope) [#1180]
* Faster and robust config searching via `readdir` instead of `opendir` [#1183]
* Insert "function" into ES6 methods [#1184]
* Allow empty body in loops, if/else, do, comptime [#1187]
* Fix comptime negative zero [#1190]
* Serialize typed arrays and well-known symbols [#1188]
* comptime `Object.create null` [#1192]
* Comptime classes and generators [#1194]
* Comptime function properties [#1196]
* Comptime URLs [#1197]
* Handle property descriptors (incl. getters/setters) in comptime [#1198]
* "is like" pattern matching operator [#1199]
* Optional ?:: for coffeePrototype [#1193]
* Pattern matching fixes [#1200]

## 0.7.1
* Assignment operator sections [#1174]
* Fix & in applied (operator) [#1175]
* Upgrade CI to Node.js 20 [#1178]
* Limit & to return/yield; support indented yield argument [#1177]
* Brace block improvements, including `&` statements [#1179]

## 0.7.0
* New ampersand proposal (#1070) [#1159]

## 0.6.93
* Fix #1155 by consolidating trailing member access [#1163]
* remove old experimental coffee2civet and add bun-civet to ignored coverage [#1164]
* `::#` type with `coffeePrototype` [#1166]
* Infinite loop detection and no return [#1165]
* Pipe assignment to index [#1167]
* Improve ASI algorithm [#1170]
* Keep new inside partial function [#1171]

## 0.6.92
* Simplify quoteString for code coverage [#1156]
* Fix unary negated literal with unary post [#1154]
* Preserve Vite's default extensions [#1157]

## 0.6.91
* Late arrow functions like late assignments [#1142]
* Fix ASI bug caused by unstructured blockPrefix [#1143]
* Fix #1043 - Add missing unary numeric and undefined pin patterns in switch [#1144]
* Fix relational chains [#1146]
* Infinite range [x..] [#1148]
* Partial application placeholders [#1151]
* Astro integration based on Vite plugin [#1153]

## 0.6.90
* Don't treat double colon as colon [#1136]
* Optional dot before # [#1137]
* Prevent `...` as array element in right-hand side [#1138]
* Missing insert return after pattern matching statement [#1141]
* Nonnull checks in assignment conditions [#1140]

## 0.6.89
* Hoist declarations out of async wrapper and other cleanup [#1133]

## 0.6.88
* Modern NodeJS register and CLI require/import fixes [#1128]
* Dynamic import declarations and expressions [#1130]

## 0.6.87
* Signed number literal types, including dropping + [#1119]
* TS override support [#1120]
* Fix #54 - Optional chain in assignment lhs [#1117]

## 0.6.86
* Fix #1102 - negative index assignment lhs [#1109]
* Fix #1101 - reserved word object globs [#1111]

## 0.6.85
* Fix #1098 - if containing for IIFE [#1103]
* Fix #1096; Fix #1105; Special operators in assignment rhs [#1106]
* Fix #1100 - pipe inside StatementExpression [#1104]
* Fix #1107 - pipe to as in JS mode [#1108]

## 0.6.84
* Fix #1075 - Pattern matching array length type guard [#1089]
* Fix #1087 [#1088]
* Fix #1091 [#1093]
* RestoreAll within template substitution / CoffeeScript interpolation [#1095]
* Fix #1097 - for loop over character range [#1099]

## 0.6.83
* Fix #1065 - pipe to unary word ops; await ops [#1069]
* Strings at start of file followed by pipe or access are not prologues [#1068]
* Sourcemap improvement [#1067]
* Fix #1048 - semicolon before return.value when piping [#1071]
* Added comment to forwardMap [#1073]
* eliminate dead code [#1072]
* #202 - Don't wrap StatementExpressions in IIFE in declaration [#1074]
* Added support for nested statement expressions [#1076]
* Statement expressions [#1077]

## 0.6.82
* 1053 [#1059]
* Fix Playground around top-level await [#1060]
* Fix #1058 - Missed 'async' as valid start for iteration expressions in performance opt [#1063]
* Add # length shorthand #909 [#1062]
* Allow arguments to property bind [#1064]
* Add `as tuple` [#1066]

## 0.6.81
* Force emitting dts files in unplugin [#1055]
* Tell Vite virtual module during dependency scanning [#1056]

## 0.6.80
* Fix #1047 - Properly escape newlines in multi-line strings [#1049]
* Typechecking allows for extra dependencies beyond build [#1052]
* Suppress ESLint `no-cond-assign` with `if const` etc [#1051]
* Add esbuild unplugin to Vite's optimizeDeps [#1054]

## 0.6.79
* Snapshots similar to how Vue language tools does [#1042]
* log diagnostics timing [#1045]
* Non-transpiled files weren't being added to the path map causing them… [#1044]
* Don't relativize paths in unplugin [#1046]

## 0.6.78
* Avoid double semicolon in then clause [#1041]

## 0.6.77
* ignore coverage for parser/types.civet [#1032]
* Working towards discriminated union for nodes and type predicates for traversal [#1033]
* Automatic TS jsx setting in unplugin and CLI [#1039]
* More custom operator precedence [#1038]

## 0.6.76
* Split lib.civet into many files [#1026]
* Fix CLI typecheck import mapping [#1030]
* xor precedence above || [#1029]
* Custom operator precedence [#1031]

## 0.6.75
* Typechecking CLI [#1023]
* Fix #900 - Declaration condition in switch statements w/ nested binop [#1024]
* Made some more progress on internal typings [#1025]
* Cleanup non-null assertion handling [#1027]

## 0.6.74
* Pipe new [#1008]
* Fix #947 - Better const function semantics [#1009]
* Fix hasProp type [#1011]
* Unary prefix and postfix in braced literal shorthand [#1014]
* Support extends shorthand in type parameters [#1015]
* Add type assignment shorthand [#1018]
* Recognize indentation of type alias [#1019]
* Fix #1002 - Allow postfix loops, etc. in declarations [#1017]
* Fix #998 - Properly handle void async generators and iterators [#1020]
* Fix #959 - Don't duplicate comments when hoisting refs [#1022]

## 0.6.73
* Fix triple slash in pattern matching switch [#991]
* Report error nodes in LSP [#992]
* Update code around pattern matching to civet style [#993]
* Consistent arrow vs. pipe precedence [#994]
* Avoid implicit returns from fat arrows [#996]
* Allow multiple props per line in implicit object literals [#997]
* Don't create empty var decs with auto-var [#1000]
* Fix cached node mutation when removing trailing comma from rest property [#1001]

## 0.6.72
* Fix private field glob getters [#977]
* Fix spread bug extracted from lib.civet [#982]
* export default shorthand [#981]
* perf-compare improvements [#983]
* Allow enums on one line [#980]
* Fix TS infer, extends, typeof [#986]
* Support "Error" nodes in Playground [#987]

## 0.6.71
* Typed ampersand function improvements [#969]
* Fix concatAssign for arrays [#972]
* TypeScript's `import ... = require(...)` and `export = ...` [#975]
* CLI import rewriting, --civet option, cleanup [#974]
* Nested vs. implicit vs. inline object literals [#976]

## 0.6.70
* Port CLI to more modern Civet [#950]
* Fix ASI with one-argument (+) application [#960]
* Allow return.value in pipeline [#961]
* Allow return type annotation in getter shorthand [#962]
* Fix object getters with globs [#964]

## 0.6.69
* Operators as functions via parens [#948]
* Add em dash for decrement [#953]
* Cleanup Call arguments AST, fix (+) processing [#955]

## 0.6.68
* Test validity of JS/TS outputs via esbuild parsing [#932]
* Shorthand for type indexed access [#945]
* `!op` shorthand for `not op` [#946]

## 0.6.67
* Support TS instantiation expressions [#940]
* Hera ESM support [#942]
* Playground eval [#941]

## 0.6.66
* TS typeof allow for arbitrary expressions, not just types [#935]
* Fix ASI with pipes [#937]
* Fix array of objects type [#936]

## 0.6.65
* Fix optional property access shorthand [#931]

## 0.6.64
* Fail on TypeScript errors, or specified types [#928]

## 0.6.63
* Wrap thick pipes in parens [#916]
* Support TypeScript `paths` alias [#921]
* LSP support importing directories with index.civet [#923]
* LSP pass on more completion info [#924]
* Fix ts: 'tsc' behavior around sourcemaps [#926]
* Use .tsx extension for TypeScript type checking [#927]

## 0.6.62
* as! T [#896]
* ++ concat operator [#898]
* ++= concat assignment [#899]
* Optional let declarations [#902]
* Optional function return types [#904]
* Conditional types via if/unless [#905]
* `T?` → `T | undefined`; `T??` → `T | undefined | null` [#908]
* Extends shorthand `<` and negated forms [#907]
* Added (+) binary op to function shorthand [#912]
* `(foo)` for custom operators `foo` [#914]

## 0.6.61
* Fix unplugin emitDeclaration and Windows behavior [#895]

## 0.6.60
* Use .-1 notation in Civet source [#879]
* Update font; tagline [#880]
* docs: Revise tagline, opening paragraph, and purple [#882]
* Allow arbitrary unary operators before ampersand function notation [#883]
* `[a ... b]` is a range, `[a ...b]` is implicit call [#884]
* Stricter unary operators (before &) [#886]
* Fix ASI before ranges [#890]

## 0.6.59
* Update docs style [#871]
* Color tweaks to improve contrast [#874]
* Fix while(cond) without space [#875]
* Omit obviously unreachable breaks from switch [#876]
* Support x?.-1 and other optional fancy accesses [#877]
* svg backgrounds [#878]

## 0.6.58
* Fix implicit generators in assigned -> functions [#865]
* Omit return with Iterator/Generator<*, void> type [#866]
* Handle labeled loops [#867]
* Add angle brackets to surroundingPairs [#868]

## 0.6.57
* handleHotUpdate to fix Vite HMR (watch in dev mode) [#860]
* Support implicit .civet importing unless implicitExtension: false [#859]

## 0.6.56
* Fix #833: Add newline after trailing comment in implicit braced blocks [#851]
* Fix #853: catch clause with extra space [#856]
* Fix #850: Wrap parens around thick pipes with refs in declarations [#855]
* Fix sourcemap issue in unplugin (#846) [#857]

## 0.6.55
* Add bracket/comments matching to vscode plugin [#835]
* Allow multiple patterns over multiple lines with comma [#838]
* Fix #839: for each of declaration with auto-let [#841]
* Import attributes [#848]
* Fix special relational operator precedence [#843]

## 0.6.54
* Generalize pin expressions to allow x.y and ^x.y [#834]

## 0.6.53
* Fix unplugin Typescript builds and update API [#810]
* Fix snug `x<y` [#830]
* Fix #72. Reset service when tsconfig changes [#807]

## 0.6.52
* Fix Promise<void> in non-async function [#815]
* Indented function parameters [#816]
* Assignments in & functions [#817]
* Type arguments in template literals [#820]

## 0.6.51
* Check for existence of absolute path in unplugin [#797]
* Added references to lsp [#801]
* Update xor typing [#799]
* Fix #705 [#802]

## 0.6.50
* Forbid comma operator in one-line thin arrow functions [#795]
* Fix #704; better open paren whitespace handling in type declarations [#796]

## 0.6.49
* Fix #792: TryExpression in conditional declaration [#793]
* Update more parent pointers along the way [#794]

## 0.6.48
* unplugin calls addWatchFile [#780]
* Simpler implementation of comments near Civet directives [#790]
* Allow -.1 as decimal literal [#788]

## 0.6.47
* Allow comments near Civet directives [#783]
* Fix unplugin path resolution (#774) [#786]
* Transform Vite HTML imports for Civet [#785]

## 0.6.46
* unplugin transformInclude to avoid transforming unrelated files [#784]

## 0.6.45

## 0.6.44
* Perf4 [#772]
* Fix #755: ampersand blocks with coffee compat [#777]
* Default type for `return` declaration [#778]
* Fix #643 [#781]

## 0.6.43
* fixed line continuation edge case [#768]
* refactor property access patterns; 0.7% perf improvement [#770]
* Perf3 [#771]

## 0.6.42
* Allow newline before ...rest parameter [#761]
* Parenthesize if expressions, remove other excess parens [#762]
* ~10% perf boost by adding some short circuit assertions [#764]
* Make ts-diagnostic.civet independent of vscode dependencies [#766]

## 0.6.41

## 0.6.40
* Fix #715; Parens around update assignments [#748]
* Mild opt [#749]
* Fix indexOf type signature [#752]
* Support comments before directives [#754]
* Remove common indentation of triple quotes [#758]

## 0.6.39
* properly encoding js import source [#736]
* Fix #522: default to JSX preserve for ts config in LSP [#739]
* LSP Build refactor [#737]
* basic parser tracing [#721]
* Fix go to definition [#738]
* convert build to civet style [#740]
* Unbundled only works in debug mode [#741]
* Fix #733; Allow postfixed expressions in array literals [#746]
* Fix #743; Paren-less for expression with more complex increment [#747]

## 0.6.38
* Files for testing bun plugin [#725]
* Fix #714 [#724]
* Fix 'not in' after logical binop [#729]
* Fix #726: declaration condition in switch [#728]
* Fix #104: correct syntax highlight for '.=' [#730]
* Add type-checking to unplugin [#689]
* docs: Fix bun plugin link [#731]
* sourcemap fix [#734]
* Cli update [#735]

## 0.6.37
* Fix #503: TS `using` [#722]

## 0.6.36
* Unify pattern matching and declaration conditions [#717]

## 0.6.35
* Fix #629: Unary op with late assignment [#716]
* Reference [#685]
* get/set method shorthand [#637]
* Warning-free hack for ergonomic require of cjs esbuild plugin [#718]
* Fix #719: existential property glob and get/set shorthand with existential glob [#720]

## 0.6.34

## 0.6.33
* Underflowing arrays is a perf killer [#711]

## 0.6.32
* Fix #702: assignment dec in postfix if [#703]
* Fix #701 [#710]
* Fix #691: unary not with existential [#709]

## 0.6.31
* Fix #699 void arrow functions shouldn't implicitly return [#700]

## 0.6.30
* Fix #692: proper handling of re-alaised binding properties [#698]
* Fix #695; consolidate method and function returns [#696]
* Fix #504; single binding pattern parameter arrow function shorthand [#697]

## 0.6.29
* Fix #684: Add support for TypeScript /// directives [#686]

## 0.6.28
* Document unplugin [#675]
* Add nextjs unplugin example [#676]
* New try at indented application [#677]
* Convert to more Civet-y style [#683]
* Fixes #664 [#679]
* fix #655 [#680]
* Fixes #682; Fixes #653; Improved arrow function const assignment [#687]
* Fix #635: Identity function shorthand [#688]

## 0.6.27
* 🐈🐈🐈 [#657]
* Added void to improve types and opt out of implicit returns [#672]
* Fix #666 [#671]
* Fixes #669 [#673]
* Fixes #662 [#674]
* Fix #663 [#670]
* Add civet unplugin [#632]

## 0.6.26
* Fix #564 Implement basic const enums in --js mode [#654]

## 0.6.25
* Initial auto-const [#649]
* Fix #639 hoistable thick pipe ref decs [#651]
* Fix #640 implicit return of const function declarations [#652]

## 0.6.24
* Updated the Bun-related how-to [#646]

## 0.6.23
* Postfix expressions inside indented implicit object literals [#630]
* Postfix expressions inside inline object literals [#631]
* Added private this shorthand. Fixes #633 [#636]
* source/lib.js -> source/lib.ts [#638]
* for own..in [#644]

## 0.6.22
* Constructor prefix goes after super call [#626]
* Fix hoisting around IIFE [#627]

## 0.6.21
* for item, index of list [#621]
* for key, value in object [#622]
* for each..of [#623]

## 0.6.20
* Fix tuple-matching behavior [#608]
* Forbid binary op after newline within SingleLineStatements (e.g. `then`) [#612]
* Remove forbidMultiLineImplicitObjectLiteral [#613]
* Revamp braced object literals [#614]
* Revamp array literals [#617]
* `type` declaration without `=` [#611]
* Cache fix for function calls within inline objects [#618]
* Fix implicit return with switch+then [#620]
* Unify Samedent/Nested, and other indent cleanup [#619]

## 0.6.19
* Implicit returns of (last) declaration [#606]

## 0.6.18
* TypeScript named tuples [#604]
* Allow ?: with named elements in tuple types [#605]
* Possessive object access [#603]

## 0.6.17
* `switch` fixes [#594]
* Support indented RHS after binary op [#600]
* No implicit return from async function: Promise<void> [#601]
* autoVar/autoLet should treat `=>` and methods same as functions [#602]

## 0.6.16
* Fix export functions getting implicit empty blocks [#592]

## 0.6.15
* Fix inner assignments mixed with operator assignments [#585]
* Allow trailing CallExpression after ExpressionizedStatement [#584]

## 0.6.14
* Existence operator chaining and cleanup [#578]
* Arrow function types fixes: `abstract new` and `asserts`/predicates [#580]
* Fix weird custom operator behavior [#581]

## 0.6.13
* Forbid implicit calls with braced argument in extends/if/else/for/when/case [#576]
* Fix nested object with function children (caching) [#577]

## 0.6.12
* Fix empty objects in if statements [#571]
* Fix binary ops RHS in pattern matching switch [#575]
* Fix missing closing braces [#574]

## 0.6.11
* Add missing parentheses to glob assignments with refs [#567]
* Support TypeScript optional methods [#568]
* Support new arrow function types [#569]

## 0.6.10
* `not` support outside coffeeCompat mode [#557]
* Unicode operators ≤≥≠≢≡≣⩶⩵«»⋙‖⁇∈∉∋∌▷‥…≔→⇒ [#558]

## 0.6.9

## 0.6.8
* Function implicit bodies [#542]
* Fix implicit calls with bind and decorators [#545]
* Fix readonly support in interfaces  [#546]

## 0.6.7

## 0.6.6

## 0.6.5

## 0.6.4

## 0.6.3
* Small whitespace fix for trailing splat [#524]

## 0.6.2
* Support splats in type tuples [#521]

## 0.6.1

## 0.6.0

## 0.5.94
* x@y and @@x bind shorthand, plus JSX fixes [#506]
* JSX unbraced @ and @@ shorthand [#507]
* JSX braceless call/member/glob expressions [#508]

## 0.5.93
* Call splice method directly [#499]
* Fix sourcemap support from CLI [#498]
* Remove tsx after ESM transpilation [#500]
* Fix implicit async/* in functions with arguments [#501]

## 0.5.92

## 0.5.91
* Indentation after await operator [#475]
* CLI can run ESM scripts via import [#477]
* Inline implicit object literals can't end with comma [#479]

## 0.5.90

## 0.5.89

## 0.5.88

## 0.5.87
* Link to Civetman [#450]

## 0.5.86

## 0.5.85
* For loop optimizations and generalizations [#442]
* Semicolon-separated statements in blocks [#443]

## 0.5.84

## 0.5.83
* Fix regression in indented application from decorators change. Fixes #434 [#435]

## 0.5.82

## 0.5.81

## 0.5.80
* New top-level statement system [#414]

## 0.5.79

## 0.5.78
* Call with unparenthesized iteration expression argument [#411]

## 0.5.77
* async do, async for [#402]
* Improve ligature toggles [#404]
* Leave plain JSX strings alone, including newlines [#408]
* enum support [#410]

## 0.5.76
* Fix automatic async vs. pipe invocations [#401]

## 0.5.75
* Move Philosophy to civet.dev [#394]
* Prevent indented application in Coffee for loops [#396]
* Forbid indented application in first line of array literal [#397]
* Automatically await/async expressionized statements with await [#399]

## 0.5.74
* do expressions wrapping in iffe [#376]
* Write an intro to Civet for the front page [#386]
* Update Hero.vue [#392]
* TypeScript non-null declarations [#393]

## 0.5.73

## 0.5.72

## 0.5.71
* return.value and return = [#364]
* Trailing member properties in blocks [#368]
* Declare and update return.value [#366]

## 0.5.70
* Allow label argument in break and continue [#363]

## 0.5.69
*  Allow assignments and update operators within assignments and update operators ++/-- [#353]
* Support for labeling statements [#354]
* Cleanup flag stacks, re-allow stuff inside parens/brackets/braces [#356]
* Prevent `case:` from implicit object literal [#357]

## 0.5.68
* Inner assignments within assignment chains [#348]
* Test helper `throws` supports description and --- [#349]

## 0.5.67
* Switch prelude declarations from const to var [#344]
* Spreads in object globs [#343]
* Pipelines lower precedence than implicit arguments [#347]
* Support hex and other numbers in ranges [#345]

## 0.5.66
* xor/^^ and xnor/!^ operators [#340]

## 0.5.65

## 0.5.64
* Object globs, v2 [#333]
* Fix #332 [#334]

## 0.5.63
* Improve super property support [#326]

## 0.5.62
* Tagged string literals become tagged template literals [#322]
* Function fixes [#323]
* typeof shorthand [#325]

## 0.5.61

## 0.5.60
* operator= assignment [#301]

## 0.5.59

## 0.5.58

## 0.5.57

## 0.5.56
* `{x[y]}` shorthand for `{[y]: x[y]}` [#284]
* Require space in JSX after identifier or ...rest attribute [#285]
* `not instanceof`, `!<?`, reserve `not` [#286]

## 0.5.55
* Integer property access [#283]

## 0.5.54

## 0.5.53
* Fix Init being called too late [#280]
* Fix semicolon method body [#281]

## 0.5.52
* `<:` shorthand for implements [#275]
* Braced object literal shorthand [#276]
* Property access with string literals [#278]
* Insert semicolons between lines that JS would combine [#277]

## 0.5.51

## 0.5.50

## 0.5.49
* Contributing document for getting started with Civet [#255]

## 0.5.48

## 0.5.47

## 0.5.46

## 0.5.45

## 0.5.44

## 0.5.43

## 0.5.42

## 0.5.41

## 0.5.40
* New fast JSX parser [#235]

## 0.5.39
* Fix CLI behavior especially on Unix [#232]

## 0.5.38

## 0.5.37

## 0.5.36
* Gulp plugin [#206]

## 0.5.35

## 0.5.34

## 0.5.33
* Synonyous -> synonymous [#180]

## 0.5.32

## 0.5.31

## 0.5.30

## 0.5.29

## 0.5.28
* Create directory in `-o` option if it doesn't exist [#164]

## 0.5.27

## 0.5.26
* New Playground tag in docs [#125]
* Docs: fix code examples rendering [#140]

## 0.5.25
* Fix for nested JSX if else expressions [#133]

## 0.5.24

## 0.5.23

## 0.5.22

## 0.5.21

## 0.5.20

## 0.5.19

## 0.5.18

## 0.5.16

## 0.5.15

## 0.5.14

## 0.5.13

## 0.5.12

## 0.5.11

## 0.5.10

## 0.5.9

## 0.5.8

## 0.5.7

## 0.5.6

## 0.5.5

## 0.5.4

## 0.5.3

## 0.5.2

## 0.5.1

## 0.5.0

## 0.4.38

## 0.4.37

## 0.4.36

## 0.4.35

## 0.4.34

## 0.4.33

## 0.4.32

## 0.4.31

## 0.4.28

## 0.4.27

## 0.4.26

## 0.4.25

## 0.4.24

## 0.4.23
* CoffeeScript export to-do [#22]
* Add command to restart language server [#23]

## 0.4.22
* More consistent use of paths vs. file URIs [#19]
* Support for unbraced `export x, y` [#21]

## 0.4.21

## 0.4.20

## 0.4.19-pre.14
* Allow and= / or= by default (not just coffeeCompat) [#16]
* MIT license [#17]

## 0.4.19-pre.13

## 0.4.19-pre.12

## 0.4.19-pre.11
* Caching [#14]

## 0.4.19-pre.10

## 0.4.19-pre.9

## 0.4.19-pre.7

## 0.4.19-pre.6

## 0.4.19-pre.5

## 0.4.19-pre.4
* Add script for testing compatibility with CoffeeScript [#7]

## 0.4.19-pre.3

## 0.4.19-pre.2

## 0.4.19-pre.1

## 0.4.19-pre.0

## 0.4.18.3
* Rewrite cli to use readline interface [#6]

## 0.4.18.2

## 0.4.18.1

## 0.4.18
* Coffee comprehensions [#4]

## 0.4.17
* Auto var [#3]

## 0.4.16

## 0.4.15

## 0.4.14

## 0.4.13

## 0.4.12

## 0.4.10

## 0.4.9

## 0.4.8

## 0.4.7

## 0.4.6

## 0.4.5

## 0.4.4

## 0.4.3

## 0.4.2

## 0.4.0

## 0.3.16

## 0.3.15

## 0.3.14

## 0.3.13

## 0.3.12
* Transpilation overhaul [#1]

## 0.3.10

## 0.3.9

## 0.3.8

## 0.3.7

## 0.3.6

## 0.3.5

## 0.3.4

## 0.3.3

## 0.3.2

## 0.3.1

## 0.3.0

## 0.2.16

## 0.2.15

## 0.2.14

## 0.2.13

## 0.2.12

## 0.2.11

## 0.2.9

## 0.2.8

## 0.2.7

## 0.2.6

## 0.2.5

## 0.2.4

## 0.2.3

## 0.2.2

## 0.2.0

## 0.1.1

## 0.1.0

