declare module '@danielx/civet/ts-diagnostic' {
  import type { DiagnosticMessageChain } from 'typescript'

  interface Position {
    line: number
    character: number
  }

  interface Range {
    start: Position
    end: Position
  }

  type SourceMapping = [number] | [number, number, number, number]
  type SourcemapLines = SourceMapping[][]

  export type { SourcemapLines }

  export function remapPosition(
    position: Position,
    sourcemapLines?: SourcemapLines
  ): Position

  export function remapRange(
    range: Range,
    sourcemapLines?: SourcemapLines
  ): Range

  export function flattenDiagnosticMessageText(
    diag: string | DiagnosticMessageChain | undefined,
    indent?: number
  ): string
}
