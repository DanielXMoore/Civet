declare module "@danielx/civet" {
  export type CivetAST = unknown
  export type ParseOptions = Partial<{
    autoConst: boolean
    autoLet: boolean
    autoVar: boolean
    coffeeBinaryExistential: boolean
    coffeeBooleans: boolean
    coffeeClasses: boolean
    coffeeComment: boolean
    coffeeCompat: boolean
    coffeeDiv: boolean
    coffeeDo: boolean
    coffeeEq: boolean
    coffeeForLoops: boolean
    coffeeInterpolation: boolean
    coffeeIsnt: boolean
    coffeeJSX: boolean
    coffeeLineContinuation: boolean
    coffeeNot: boolean
    coffeeOf: boolean
    coffeePrototype: boolean
    coffeeRange: boolean
    defaultElement: string
    globals: string[]
    implicitReturns: boolean
    jsxCode: boolean
    objectIs: boolean
    /** Array of names to treat as operators, or object mapping names to
     * parsable operator behaviors such as "relational" or "same (+)" or
     * "relational same (+)", or ""/undefined for default behavior.
     * (Can also map to OperatorBehavior as defined in source/types.civet,
     * but the details are subject to change.)
     */
    operators: string[] | Record<string, string | undefined>
    react: boolean
    solid: boolean
    client: boolean
    rewriteCivetImports: string
    rewriteTsImports: boolean
    server: boolean
    strict: boolean
    symbols: string[]
    tab: number
    verbose: boolean
    comptime: boolean
    iife: boolean
    repl: boolean
  }>
  export type CompileOptions = {
    /**
     * If your Civet code comes from a file, provide it here. This gets used
     * in sourcemaps and error messages.
     */
    filename?: string
    /**
     * Whether to return a source map in addition to transpiled code.
     * If false (the default), `compile` just returns transpiled code.
     * If true (and `inlineMap` is false/unspecified),
     * `compile` returns an object `{code, sourceMap}` whose `code` property
     * is transpiled code and `sourceMap` property is a `SourceMap` object.
     */
    sourceMap?: boolean
    /**
     * Whether to inline a source map as a final comment in the transpiled code.
     * Default is false.
     */
    inlineMap?: boolean
    /**
     * Whether to return an AST of the parsed code instead of transpiled code.
     * Default is false.
     * If true, `compile` skips the `generate` step that turns the parsed AST
     * into a code string, and just returns the AST itself.
     * If "raw", `compile` also skips the `prune` step, which leaves some
     * extra properties on the AST nodes (e.g. `parent` pointers) and
     * preserves that `children` is always an array.
     */
    ast?: boolean | "raw"
    /**
     * Whether Civet should convert TypeScript syntax to JavaScript.
     * This mostly triggers the removal of type annotations, but some
     * TypeScript features such as `enum` are also supported.
     * Default is false.
     */
    js?: boolean
    /**
     * If set to true, turns off the compiler cache of compiled subexpressions.
     * This should not affect the compilation output,
     * and can make the compiler exponentially slow.
     * It is mainly for testing whether there is a bug in the compiler cache.
     */
    noCache?: boolean
    /**
     * If specified, also writes data about compiler cache performance
     * into the specified filename. Useful for debugging caching performance.
     */
    hits?: string
    /**
     * If specified, also writes data about all parse branches considered by
     * the compiler into the specified filename.
     * Useful for debugging why something parsed the way it did.
     */
    trace?: string
    /**
     * Initial parse options, e.g., read from a config file.
     * They can still be overridden in the code by "civet" pragmas.
     */
    parseOptions?: ParseOptions
    /**
     * By default, `compile` will throw a `ParseErrors` containing all
     * `ParseError`s encountered during compilation.
     * If you specify an empty array, `compile` will not throw and instead
     * will add to the array all `ParseError`s encountered.
     */
    errors?: ParseError[]
    /**
     * Number of parallel threads to compile with (Node only).
     * Default is to use the environment variable `CIVET_THREADS`, or 0.
     * If nonzero, spawns up to that many worker threads so that multiple
     * calls to `compile` will end up running in parallel.
     * If `CIVET_THREADS` is set to 0, the `threads` option is ignored.
     */
    threads?: number
    /**
     * If false (the default), runs the compiler asynchronously and returns
     * a Promise (for the transpiled string or `{code, sourceMap}` object).
     * If true, runs the compiler synchronously and returns the result directly.
     * Sync mode disables some features:
     *   - parallel computation via `threads`
     *   - comptime code can't return promises
     */
    sync?: boolean
  }
  export type GenerateOptions = Omit<CompileOptions, "sourceMap"> & {
    sourceMap?: undefined | SourceMap
  }

  export type SourceMapping = [number] | [number, number, number, number]

  export class SourceMap {
    constructor(source: string)
    updateSourceMap?(outputStr: string, inputPos: number): void
    json(srcFileName: string, outFileName: string): unknown
    source: string
    lines: SourceMapping[][]
    /** @deprecated */
    data: { lines: SourceMapping[][] }
  }

  // TODO: Import ParseError class from Hera
  export class ParseError {
    name: "ParseError"
    message: string // filename:line:column header\nbody
    header: string
    body: string
    filename: string
    line: number | string
    column: number | string
    offset: number
  }
  export class ParseErrors {
    constructor(errors: ParseError[])
    name: "ParseErrors"
    message: string
    errors: ParseError[]
  }
  export function isCompileError(err: any): err is ParseError | ParseErrors

  type CompileOutput<T extends CompileOptions> =
    T extends { ast: true } ? CivetAST :
    T extends { sourceMap: true } ? {
      code: string,
      sourceMap: SourceMap,
    } : string
  export function compile<const T extends CompileOptions>(source: string | Buffer, options?: T):
    T extends { sync: true } ? CompileOutput<T> : Promise<CompileOutput<T>>
  /** Warning: No caching */
  export function parse(source: string, options?: CompileOptions & {startRule?: string}): CivetAST
  /** Warning: No caching */
  export function parseProgram<T extends CompileOptions>(source: string, options?: T):
    T extends { comptime: true } ? Promise<CivetAST> : CivetAST
  export function generate(ast: CivetAST, options?: GenerateOptions): string
  export function decode(source: string | Buffer): string

  export const lib: {
    gatherRecursive(ast: CivetAST, predicate: (node: CivetAST) => boolean): CivetAST[]
    gatherRecursiveAll(ast: CivetAST, predicate: (node: CivetAST) => boolean): CivetAST[]
  }

  const Civet: {
    version: string
    compile: typeof compile
    isCompileError: typeof isCompileError
    parse: typeof parse
    generate: typeof generate
    decode: typeof decode
    SourceMap: typeof SourceMap
    ParseError: typeof ParseError
    ParseErrors: typeof ParseErrors
    sourcemap: {
      locationTable(input: string): number[]
      lookupLineColumn(table: number[], pos: number): [number, number]
      SourceMap: typeof SourceMap
    }
  }

  export default Civet;
}

declare module "@danielx/civet/esbuild-plugin" {
  import { Plugin } from "esbuild"

  interface Options {
    filter?: RegExp
    inlineMap?: boolean
    js?: boolean
    next?: unknown
  }

  const plugin: ((options: Options) => Plugin) & Plugin
  export default plugin
}

declare module "@danielx/civet/config" {
  export function findInDir(dirPath: string): Promise<string | undefined>
  export function findConfig(path: string): Promise<string | null>
  export function loadConfig(
    path: string
  ): Promise<import("@danielx/civet").CompileOptions>
  const Config: {
    findInDir: typeof findInDir,
    findConfig: typeof findConfig,
    loadConfig: typeof loadConfig,
  }
  export default Config
}
