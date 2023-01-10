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

export function compileCivetToHtml(
  code: string,
  prettierOutput = true
): Promise<{ inputHtml: string; outputHtml?: string; error?: string }> {
  uid++;
  playgroundWorker.postMessage({ uid, code, prettierOutput });
  return new Promise((resolve) => {
    msgMap[uid] = { resolve };
  });
}
