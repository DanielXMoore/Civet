import type { CompileOptions } from "./types.js"

export function findInDir(dirPath: string): Promise<string | undefined>
export function findConfig(path: string): Promise<string | null>
export function loadConfig(
  path: string
): Promise<CompileOptions>

declare const Config: {
  findInDir: typeof findInDir,
  findConfig: typeof findConfig,
  loadConfig: typeof loadConfig,
}
export default Config
