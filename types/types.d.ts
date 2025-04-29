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
    filename?: string
    sourceMap?: boolean
    inlineMap?: boolean
    ast?: boolean | "raw"
    js?: boolean
    noCache?: boolean
    hits?: string
    trace?: string
    parseOptions?: ParseOptions
    /** Specifying an empty array will prevent ParseErrors from being thrown */
    errors?: ParseError[]
    /** Number of parallel threads to compile with (Node only) */
    threads?: number
  }
  export type GenerateOptions = Omit<CompileOptions, "sourceMap"> & {
    sourceMap?: undefined | SourceMap
  }
  export type SyncCompileOptions = CompileOptions &
    { parseOptions?: { comptime?: false } }

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
  export type ParseError = {
    name: "ParseError"
    message: string // filename:line:column header\nbody
    header: string
    body: string
    filename: string
    line: number | string
    column: number | string
    offset: number
  }
  export type ParseErrors = {
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
  export function compile<const T extends CompileOptions>(source: string, options?: T):
    T extends { sync: true } ? CompileOutput<T> : Promise<CompileOutput<T>>
  /** Warning: No caching */
  export function parse(source: string, options?: CompileOptions & {startRule?: string}): CivetAST
  /** Warning: No caching */
  export function parseProgram<T extends CompileOptions>(source: string, options?: T):
    T extends { comptime: true } ? Promise<CivetAST> : CivetAST
  export function generate(ast: CivetAST, options?: GenerateOptions): string

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
  export default {
    findInDir,
    findConfig,
    loadConfig,
  }
}
