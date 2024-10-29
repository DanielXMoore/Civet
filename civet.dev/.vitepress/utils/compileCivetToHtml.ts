let playgroundWorker: Worker;

interface WorkerResult {
  inputHtml: string;
  outputHtml?: string;
  error?: string;
  jsCode?: string;
}

const msgMap: Record<string, {
  resolve: (r: WorkerResult) => void
  restart: boolean
}> = {};

// @ts-ignore
if (!import.meta.env.SSR) {
  function startWorker() {
    playgroundWorker = new Worker('/playground.worker.js')

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
  parseOptions = {},
}): Promise<WorkerResult> {
  uid++;
  playgroundWorker.postMessage({ uid, code, prettierOutput, jsOutput, parseOptions });
  return new Promise((resolve) => {
    msgMap[uid] = {
      resolve,
      // Restart the worker whenever we run it with comptime: true
      restart: Boolean((parseOptions as any).comptime),
    };
  });
}
