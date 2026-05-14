importScripts('https://cdn.jsdelivr.net/npm/prettier@3.8.3/standalone.js');
importScripts('https://cdn.jsdelivr.net/npm/prettier@3.8.3/plugins/estree.js');
importScripts('https://cdn.jsdelivr.net/npm/prettier@3.8.3/plugins/typescript.js');
importScripts('https://cdn.jsdelivr.net/npm/shiki@0.14.7');

onmessage = async (e) => {
  const { uid, code, prettierOutput, jsOutput, tsOutput, parseOptions } = e.data;
  const highlighter = await getHighlighter();
  const inputHtml = highlighter.codeToHtml(code, { lang: 'civet' });

  let tsCode, ast, sourceMap
  let errors = []
  try {
    ast = await Civet.compile(code, { ast: true, parseOptions });
    sourceMap = new Civet.SourceMap(code);
    tsCode = Civet.generate(ast, { js: !tsOutput, errors, sourceMap });
    if (errors.length) {
      // Rerun with SourceMap to get error location
      errors = []
      sourceMap = new Civet.SourceMap(code);
      tsCode = Civet.generate(ast, { errors, sourceMap });
    }
  } catch (e) {
    return postError([e], true)
  }

  function postError(errors, fatal) {
    const error = errors[0]
    if (Civet.isCompileError(error)) {
      console.info('Snippet compilation error!', error);

      const linesUntilError = code.split('\n').slice(0, error.line).join('\n');
      const errorLine = `${' '.repeat(error.column - 1)}^ ${error.header}`;
      const errorCode = `${linesUntilError}\n${errorLine}`;
      const outputHtml = highlighter.codeToHtml(errorCode, { lang: 'civet' });

      postMessage({ uid, inputHtml, outputHtml, errors, fatal });
    } else {
      console.error(error)
      let outputHtml = (error.stack ?? `${error.name}: ${error.message}`)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      outputHtml = `<h3>Compiler crashed; please report as a compiler bug.</h3><pre class="shiki crash">${outputHtml}</pre>`;
      postMessage({ uid, inputHtml, outputHtml, errors, fatal });
    }
  }

  function errorHtml(error) {
    const linesUntilError = code.split('\n').slice(0, error.line).join('\n');
    const errorLine = `${' '.repeat(error.column - 1)}^ ${error.header}`;
    const errorCode = `${linesUntilError}\n${errorLine}`;
    return highlighter.codeToHtml(errorCode, { lang: 'civet' });
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

  const civetOutput = tsCode;
  const sourceMapLines = sourceMap?.lines ?? sourceMap?.data?.lines;
  let formattedOutput;
  if (prettierOutput) {
    try {
      tsCode = await prettier.format(tsCode, {
        parser: 'typescript',
        plugins: prettierPlugins,
        printWidth: 50,
      });
      formattedOutput = tsCode;
    } catch (err) {
      console.info('Prettier error. Fallback to raw civet output', {
        tsCode,
        err,
      });
    }
  }

  let outputHtml = highlighter.codeToHtml(tsCode, { lang: 'tsx' });
  if (errors.length) {
    outputHtml = `${errorHtml(errors[0])}<hr class="playground-output-separator">${outputHtml}`;
  }

  postMessage({
    uid,
    inputHtml,
    outputHtml,
    sourceMapLines,
    civetOutput,
    prettierOutput: formattedOutput,
    jsCode,
    errors,
    fatal: false
  });
};

// Load the shiki highlighter once
let highlighterPromise;
function getHighlighter() {
  return highlighterPromise ??= (async () => {
    const civetLanguage = await getCivetLanguage();
    return shiki.getHighlighter({
      theme: 'one-dark-pro',
      // The Civet grammar includes `source.js.regexp`.
      langs: [civetLanguage, 'javascript', 'tsx'],
    });
  })();
}

async function getCivetLanguage() {
  const civetGrammarUrl = self.civetGrammarUrl;
  if (!civetGrammarUrl) {
    throw new Error('Missing Civet grammar URL');
  }
  const response = await fetch(civetGrammarUrl);
  if (!response.ok) {
    throw new Error(`Failed to load Civet grammar: ${response.status} ${response.statusText}`);
  }
  const grammar = await response.json();
  return {
    id: 'civet',
    scopeName: grammar.scopeName ?? 'source.civet',
    aliases: ['civet'],
    embeddedLangs: ['javascript'],
    path: civetGrammarUrl,
    grammar,
  };
}
