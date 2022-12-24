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

  export function compile<T extends CompileOptions>(source: string, options?: T): T extends { sourceMap: true } ? {
    code: string,
    sourceMap: SourceMap,
  } : string
  export function parse(source: string): CivetAST
  export function generate(ast: CivetAST, options?: CompileOptions): string

  const Civet: {
    compile: typeof compile
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

  const plugin: Plugin
  export default plugin
}
