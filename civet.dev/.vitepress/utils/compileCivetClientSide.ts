const playgroundWorker = new Worker('/playground.worker.js');

const msgMap: Record<string, any> = {};
playgroundWorker.onmessage = ({ data }) => {
  if (data.err) {
    msgMap[data.uid].reject(data.err);
  } else {
    msgMap[data.uid].resolve({
      code: data.prettierCode,
      rawCode: data.tsCode,
    });
  }

  msgMap[data.uid] = null;
};

let uid = 0;

export function compileCivet(code: string) {
  uid++;
  playgroundWorker.postMessage({ uid, code });
  return new Promise((resolve, reject) => {
    msgMap[uid] = { resolve, reject };
  });
}
