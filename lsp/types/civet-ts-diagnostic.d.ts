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

  type SourceMap = [number] | [number, number, number, number]
  type SourcemapLines = SourceMap[][]

  export type { SourcemapLines, SourceMap }

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
