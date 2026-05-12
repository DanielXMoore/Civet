import type { SourcemapLines } from '@danielx/civet/ts-diagnostic';

let playgroundWorker: Worker;

interface WorkerResult {
  inputHtml: string;
  outputHtml?: string;
  sourceMapLines?: SourcemapLines;
  civetOutput?: string;
  prettierOutput?: string;
  errors?: unknown[];
  fatal: boolean;
  jsCode?: string;
}

const msgMap: Record<string, {
  resolve: (r: WorkerResult) => void
  restart: boolean
}> = {};

const civetGrammarUrl = new URL('../../../lsp/vscode/syntaxes/civet.json', import.meta.url)

// @ts-ignore
if (!import.meta.env.SSR) {
  function startWorker() {
    const civetUrl = new URL('@danielx/civet/browser.min', import.meta.url)
    const playgroundUrl = new URL('/playground.worker.js', window.location.href)
    const workerSource = `
self.civetGrammarUrl = ${JSON.stringify(String(civetGrammarUrl))};
importScripts(${JSON.stringify(String(civetUrl))});
importScripts(${JSON.stringify(String(playgroundUrl))});
`
    const workerUrl = URL.createObjectURL(
      new Blob([workerSource], { type: 'text/javascript' })
    )
    playgroundWorker = new Worker(workerUrl)
    setTimeout(() => URL.revokeObjectURL(workerUrl))

    playgroundWorker.onmessage = ({ data }) => {
      const { resolve, restart } = msgMap[data.uid]
      resolve(data)
      delete msgMap[data.uid]
      if (restart) {
        playgroundWorker.terminate()
        startWorker()
      }
    };
  }

  startWorker()
}

let uid = 0;

export function compileCivetToHtml({
  code = '',
  prettierOutput = true,
  jsOutput = false,
  tsOutput = true,
  parseOptions = {},
}): Promise<WorkerResult> {
  uid++;
  playgroundWorker.postMessage({ uid, code, prettierOutput, jsOutput, tsOutput, parseOptions });
  return new Promise((resolve) => {
    msgMap[uid] = {
      resolve,
      // Restart the worker whenever we run it with comptime: true
      restart: Boolean((parseOptions as any).comptime),
    };
  });
}
