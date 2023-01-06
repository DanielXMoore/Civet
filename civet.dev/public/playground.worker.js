importScripts('https://unpkg.com/prettier@2.8.1/standalone.js');
importScripts('https://unpkg.com/prettier@2.8.1/parser-typescript.js');
importScripts('/__civet.js');

onmessage = (e) => {
  const { uid, code } = e.data;

  try {
    const tsCode = Civet.compile(code);
    let prettierCode = '';

    try {
      prettierCode = prettier.format(tsCode, {
        parser: 'typescript',
        plugins: prettierPlugins,
        printWidth: 50,
      });
    } catch (err) {
      prettierCode = tsCode;
      console.info('Prettier error. Fallback to raw civet output', {
        tsCode,
        err,
      });
    }

    postMessage({ uid, tsCode, prettierCode });
  } catch (err) {
    postMessage({ uid, err });
  }
};
