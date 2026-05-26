// TODO: Fix "any"
export function compileCivet(
  code: string,
  civetInstance: any,
  prettierInstance: any,
  parseOptions: any
) {
  // This SSR rendering code must be synchronous because of Markdown API
  const ast = civetInstance.compile(code, {
    parseOptions,
    sync: true,
    ast: true,
  });
  let tsCode = civetInstance.generate(ast, {});
  const tsRawCode = tsCode;

  if (prettierInstance) {
    try {
      // Prettier misparses top-level `yield` (it's not legal there), turning
      // `yield [a, b]` into `yield[(a, b)]`. Work around by wrapping in a
      // generator function, formatting, then stripping the wrapper.
      // https://github.com/DanielXMoore/Civet/issues/1673
      const wrapYield = ast?.topLevelYield;
      const wrapped = wrapYield
        ? `function*$civetYieldWrap(){\n${tsCode}\n}`
        : tsCode;
      let formatted = prettierInstance.format(wrapped, {
        parser: 'typescript',
        printWidth: 50,
      });
      if (wrapYield) {
        const match = formatted.match(
          /^function\* \$civetYieldWrap\(\) \{\n([\s\S]*)\n\}\s*$/
        );
        // Fall back to raw output if Prettier reshaped the wrapper
        // unexpectedly — better to ship unformatted than to leak the wrapper.
        formatted = match ? match[1].replace(/^  /gm, '') + '\n' : tsCode;
      }
      tsCode = formatted;
    } catch (err) {
      console.info('Prettier error. Fallback to raw civet output', {
        tsCode,
        err,
      });
    }
  }

  return { tsCode, tsRawCode };
}
