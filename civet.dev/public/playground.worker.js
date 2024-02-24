importScripts('https://cdn.jsdelivr.net/npm/prettier@2.8.1/standalone.js');
importScripts('https://cdn.jsdelivr.net/npm/prettier@2.8.1/parser-typescript.js');
importScripts('https://cdn.jsdelivr.net/npm/shiki@0.14.7');
importScripts('/__civet.js');

onmessage = async (e) => {
  const { uid, code, prettierOutput, jsOutput } = e.data;
  const highlighter = await getHighlighter();
  const inputHtml = highlighter.codeToHtml(code, { lang: 'coffee' });

  let tsCode, ast, errors = []
  try {
    ast = Civet.compile(code, { ast: true });
    tsCode = Civet.generate(ast, { errors });
    if (errors.length) {
      // TODO: Better error display; copied from main.civet
      throw new Error(`Parse errors: ${errors.map($ => $.message).join("\n")}`)
    }
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
    return
  }

  let jsCode = '';
  if (jsOutput) {
    // Wrap in IIFE if there's a top-level await
    // Use Civet's async do, so Civet does implicit return of last value
    try {
      const topLevelAwait = Civet.lib.gatherRecursive(ast,
        (n) => n.type === 'Await',
        Civet.lib.isFunction
      ).length > 0
      if (topLevelAwait) {
        // Eat prologue strings and comments
        let prefix = /^(\s*|;|\'([^'\\]|\\.)*\'|\"([^"\\]|\\.)*\"|\/\/.*|\/\*[^]*?\*\/)*/.exec(code)[0]
        // Trim prologue to end at the last newline or semicolon;
        // otherwise, e.g. "x" |> console.log would eat the "x"
        prefix = /^[^]*(\n|;)/.exec(prefix)?.[0] ?? ''
        const rest = code.slice(prefix.length)
        .replace(/\/\/.*|\/\*[^]*?\*\//g, '');
        // Civet prologue must end with a newline
        const coffee = /['"]civet[^'"]*coffee(Compat|-compat|Do|-do)[^'"]*['"][;\s]*?\n/.test(prefix)
        ast = Civet.compile(
          prefix +
          (coffee ? '(do ->\n' : 'async do\n') +
          rest.replace(/^/gm, ' ') +
          (coffee ? ')' : ''),
          { ast: true }
        );
      }

      // Convert console to civetconsole for Playground execution
      Civet.lib.gatherRecursive(ast,
        (n) => n.type === 'Identifier' && n.children?.token === "console"
      ).forEach((node) => {
        node.children.token = "civetconsole"
      })

      jsCode = Civet.generate(ast, { js: true, errors })

      if (topLevelAwait) {
        jsCode += `.catch((x)=>civetconsole.log("[THROWN] "+x))`
        jsCode += `.then((x)=>x!==undefined&&civetconsole.log("[EVAL] "+x))`
      }

      if (errors.length) {
        // TODO: Better error display; copied from main.civet
        throw new Error(`Parse errors: ${errors.map($ => $.message).join("\n")}`)
      }
    } catch (error) {
      // Parse errors specific to JS generation
      jsCode = `civetconsole.error("Civet failed to generate JavaScript code:\\n${error.message.replace(/[\\"]/g, '\\$&').replace(/\n/g, '\\n')}")`
      console.log(jsCode)
    }
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
