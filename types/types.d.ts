declare module "@danielx/civet" {
  export type CivetAST = unknown;
  export type CompileOptions = {
    js?: boolean
  }

  export function compile(source: string, options?: CompileOptions): string
  export function parse(source: string): CivetAST
  export function generate(ast: CivetAST, options?: CompileOptions): string

  const Civet: {
    compile: typeof compile;
    parse: typeof parse;
    generate: typeof generate;
  }

  export default Civet;
}
