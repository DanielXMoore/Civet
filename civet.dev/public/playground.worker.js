importScripts('https://unpkg.com/prettier@2.8.1/standalone.js');
importScripts('https://unpkg.com/prettier@2.8.1/parser-babel.js');
importScripts('/__civet.js');

onmessage = (e) => {
  const { uid, code } = e.data;

  try {
    const tsCode = Civet.compile(code);
    const prettierCode = prettier.format(tsCode, {
      parser: 'babel',
      plugins: prettierPlugins,
    });
    postMessage({ uid, tsCode, prettierCode });
  } catch (err) {
    postMessage({ uid, err });
  }
};
