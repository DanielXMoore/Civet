importScripts('https://cdn.jsdelivr.net/npm/prettier@2.8.1/standalone.js');
importScripts('https://cdn.jsdelivr.net/npm/prettier@2.8.1/parser-typescript.js');
importScripts('https://cdn.jsdelivr.net/npm/shiki');
importScripts('/__civet.js');

onmessage = async (e) => {
  const { uid, code, prettierOutput, jsOutput } = e.data;
  const highlighter = await getHighlighter();
  const inputHtml = highlighter.codeToHtml(code, { lang: 'coffee' });

  try {
    let tsCode = Civet.compile(code);
    let jsCode = '';

    if (jsOutput) {
      jsCode = Civet.compile(code, { js: true });
    }

    if (prettierOutput) {
      try {
        tsCode = prettier.format(tsCode, {
          parser: 'typescript',
          plugins: prettierPlugins,
          printWidth: 50,
        });
      } catch (err) {
        console.info('Prettier error. Fallback to raw civet output', {
          tsCode,
          err,
        });
      }
    }

    const outputHtml = highlighter.codeToHtml(tsCode, { lang: 'tsx' });

    postMessage({ uid, inputHtml, outputHtml, jsCode });
  } catch (error) {
    if (Civet.isCompileError(error)) {
      console.info('Snippet compilation error!', error);

      const linesUntilError = code.split('\n').slice(0, error.line).join('\n');
      const errorLine = `${' '.repeat(error.column - 1)}^ ${error.name}`;
      const errorCode = `${linesUntilError}\n${errorLine}`;
      const outputHtml = highlighter.codeToHtml(errorCode, { lang: 'coffee' });

      postMessage({ uid, inputHtml, outputHtml, error });
    } else {
      console.error(error)
      postMessage({ uid, inputHtml, outputHtml: error.message, error });
    }
  }
};

let highlighter;
async function getHighlighter() {
  if (!highlighter) {
    highlighter = await shiki.getHighlighter({
      theme: 'one-dark-pro',
      langs: ['coffee', 'tsx'],
    });
  }

  return highlighter;
}
