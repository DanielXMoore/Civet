let playgroundWorker: Worker = {} as Worker;

// @ts-ignore
if (!import.meta.env.SSR) {
  playgroundWorker = new Worker('/playground.worker.js');
}

const msgMap: Record<string, any> = {};
playgroundWorker.onmessage = ({ data }) => {
  msgMap[data.uid].resolve(data);
  msgMap[data.uid] = null;
};

let uid = 0;

export function compileCivetToHtml({
  code = '',
  prettierOutput = true,
  jsOutput = false,
  parseOptions = {},
}): Promise<{
  inputHtml: string;
  outputHtml?: string;
  error?: string;
  jsCode?: string;
}> {
  uid++;
  playgroundWorker.postMessage({ uid, code, prettierOutput, jsOutput, parseOptions });
  return new Promise((resolve) => {
    msgMap[uid] = { resolve };
  });
}
