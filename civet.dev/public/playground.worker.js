importScripts('https://cdn.jsdelivr.net/npm/prettier@3.2.5/standalone.js');
importScripts('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/estree.js');
importScripts('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/typescript.js');
importScripts('https://cdn.jsdelivr.net/npm/shiki@0.14.7');
importScripts('/__civet.js');

onmessage = async (e) => {
  const { uid, code, prettierOutput, jsOutput, tsOutput, parseOptions } = e.data;
  const highlighter = await getHighlighter();
  const inputHtml = highlighter.codeToHtml(code, { lang: 'coffee' });

  let tsCode, ast, error
  try {
    let errors = []
    ast = await Civet.compile(code, { ast: true, parseOptions });
    tsCode = Civet.generate(ast, { js: !tsOutput, errors });
    if (errors.length) {
      // Rerun with SourceMap to get error location
      errors = []
      tsCode = Civet.generate(ast, { errors, sourceMap: new Civet.SourceMap(code) });
      error = errors[0]
    }
  } catch (e) {
    error = e
  }
  if (error) return postError(error)

  function postError(error) {
    if (Civet.isCompileError(error)) {
      console.info('Snippet compilation error!', error);

      const linesUntilError = code.split('\n').slice(0, error.line).join('\n');
      const errorLine = `${' '.repeat(error.column - 1)}^ ${error.header}`;
      const errorCode = `${linesUntilError}\n${errorLine}`;
      const outputHtml = highlighter.codeToHtml(errorCode, { lang: 'coffee' });

      postMessage({ uid, inputHtml, outputHtml, error });
    } else {
      console.error(error)
      postMessage({ uid, inputHtml, outputHtml: error.message, error });
    }
  }

  let jsCode = '';
  if (jsOutput) {
    try {
      ast = await Civet.compile(code, {
        ast: true,
        parseOptions: { ...parseOptions, repl: true }
      });

      // Convert console to civetconsole for Playground execution
      Civet.lib.gatherRecursive(ast,
        (n) => n.type === 'Identifier' && n.children?.token === "console"
      ).forEach((node) => {
        node.children.token = "civetconsole"
      })

      let errors = []
      jsCode = Civet.generate(ast, { js: true, errors })
      if (errors.length) {
        // Rerun with SourceMap to get error location
        errors = []
        jsCode = Civet.generate(ast, { js: true, errors, sourceMap: new Civet.SourceMap(code) });
        // Don't postError(errors[0]) here so that we still display TypeScript
        // transpilation; only show error when trying to Run code
        throw errors[0]
      }

      if (ast.topLevelAwait) {
        jsCode += `.catch((x)=>civetconsole.log("[THROWN] "+x))`
        jsCode += `.then((x)=>x!==undefined&&civetconsole.log("[EVAL] "+x))`
      }
    } catch (error) {
      // Parse errors specific to JS generation
      jsCode = `civetconsole.error("Civet failed to generate JavaScript code:\\n${error.message.replace(/[\\"]/g, '\\$&').replace(/\n/g, '\\n')}")`
      console.log(jsCode)
    }
  }

  if (prettierOutput) {
    try {
      tsCode = await prettier.format(tsCode, {
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
