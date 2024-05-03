// TODO: Fix "any"
export function compileCivet(
  code: string,
  civetInstance: any,
  prettierInstance: any,
  parseOptions: any
) {
  // This SSR rendering code must be synchronous because of Markdown API
  let tsCode = civetInstance.compile(code, { parseOptions, sync: true });
  const tsRawCode = tsCode;

  if (prettierInstance) {
    try {
      tsCode = prettierInstance.format(tsCode, {
        parser: 'typescript',
        printWidth: 50,
      });
    } catch (err) {
      console.info('Prettier error. Fallback to raw civet output', {
        tsCode,
        err,
      });
    }
  }

  return { tsCode, tsRawCode };
}
