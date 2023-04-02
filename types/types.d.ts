declare module "@danielx/civet" {
  export type CivetAST = unknown
  export type CompileOptions = {
    filename?: string
    js?: boolean
    sourceMap?: boolean
  }

  export type SourceMapping = [number] | [number, number, number, number]

  export interface SourceMap {
    updateSourceMap?(outputStr: string, inputPos: number): void
    json(srcFileName: string, outFileName: string): unknown
    data: {
      lines: SourceMapping[][]
    }
  }

  // TODO: Import ParseError class from Hera
  export type ParseError = {
    message: string
    name: string
    filename: string
    line: number
    column: number
    offset: number
  }
  export function isCompileError(err: any): err is ParseError

  export function compile<T extends CompileOptions>(source: string, options?: T): T extends { sourceMap: true } ? {
    code: string,
    sourceMap: SourceMap,
  } : string
  export function parse(source: string): CivetAST
  export function generate(ast: CivetAST, options?: CompileOptions): string

  const Civet: {
    compile: typeof compile
    isCompileError: typeof isCompileError
    parse: typeof parse
    generate: typeof generate
    util: {
      locationTable(input: string): number[]
      lookupLineColumn(table: number[], pos: number): [number, number]
      SourceMap(input: string): SourceMap
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
