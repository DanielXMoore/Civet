declare module "@danielx/civet" {
  export type CivetAST = unknown
  export type CompileOptions = {
    filename?: string
    js?: boolean
    updateSourceMap?: Sourcemap["updateSourceMap"]
  }

  export interface Sourcemap {
    updateSourceMap?(outputStr: string, inputPos: number): void
  }

  export function compile(source: string, options?: CompileOptions): string
  export function parse(source: string): CivetAST
  export function generate(ast: CivetAST, options?: CompileOptions): string

  const Civet: {
    compile: typeof compile
    parse: typeof parse
    generate: typeof generate
    util: {
      locationTable(input: string): number[]
      lookupLineColumn(table: number[], pos: number): [number, number]
      Sourcemap(input: string): Sourcemap
    }
  }

  export default Civet;
}
