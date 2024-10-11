importScripts('https://cdn.jsdelivr.net/npm/prettier@3.2.5/standalone.js');
importScripts('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/estree.js');
importScripts('https://cdn.jsdelivr.net/npm/prettier@3.2.5/plugins/typescript.js');
importScripts('https://cdn.jsdelivr.net/npm/shiki@0.14.7');
importScripts('/__civet.js');

onmessage = async (e) => {
  const { uid, code, prettierOutput, jsOutput, parseOptions } = e.data;
  const highlighter = await getHighlighter();
  const inputHtml = highlighter.codeToHtml(code, { lang: 'coffee' });

  let tsCode, ast, error
  try {
    let errors = []
    ast = await Civet.compile(code, { ast: true, parseOptions });
    tsCode = Civet.generate(ast, { errors });
    if (errors.length) {
      // Rerun with SourceMap to get error location
      errors = []
      tsCode = Civet.generate(ast, { errors, sourceMap: Civet.SourceMap(code) });
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
    // Wrap in IIFE if there's a top-level await or import
    // Use Civet's async do, so Civet does implicit return of last value
    try {
      const topLevelAwait = Civet.lib.hasAwait(ast) ||
        Civet.lib.hasImportDeclaration(ast)
      if (topLevelAwait) {
        const [prologue, rest] = Civet.parse(code,
          {startRule: 'ProloguePrefix'})
        const prefix = code.slice(0, -rest.length)
        const coffee = prologue.some((p) => p.type === "CivetPrologue" &&
          (p.config.coffeeCompat || p.config.coffeeDo))
        ast = await Civet.compile(
          prefix +
          (coffee ? '(do ->\n' : 'async do\n') +
          rest.replace(/^/gm, ' ') +
          (coffee ? ')' : ''),
          { ast: true, parseOptions }
        );
        // Hoist top-level declarations outside the IIFE wrapper
        const topBlock = coffee
          ? Civet.lib.gatherRecursive(ast.children, (p) => p.type === 'BlockStatement')[0]
          : Civet.lib.gatherRecursive(ast.children, (p) => p.type === 'DoStatement')[0].block
        topBlock.expressions.forEach(([, statement]) => {
          if (statement?.type === "Declaration") {
            statement.children.shift() // const/let/var
            if (!Array.isArray(ast)) ast = [ast]
            ast.unshift(`var ${statement.names.join(',')};`)
          }
        })
      }

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
        tsCode = Civet.generate(ast, { js: true, errors, sourceMap: Civet.SourceMap(code) });
        return postError(errors[0])
      }

      if (topLevelAwait) {
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
