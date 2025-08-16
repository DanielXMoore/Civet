declare module '@danielx/civet/ts-diagnostic' {
  import type { DiagnosticMessageChain } from 'typescript'
  import type { SourceMapping } from '@danielx/civet'

  interface Position {
    line: number
    character: number
  }

  interface Range {
    start: Position
    end: Position
  }

  type SourcemapLines = SourceMapping[][]

  export type { SourcemapLines, SourceMapping }

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
