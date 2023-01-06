import fs from 'fs';
import childProcess from 'child_process';
import prettier from 'prettier';
import {compile} from '../../dist/main.mjs';

type CompileCivet = (code: string) => Promise<{
  code: string;
  rawCode: string;
}>;

let compileCivet: CompileCivet;

// @ts-ignore
if (import.meta.env.SSR) {
  compileCivet = (code) => {
    return new Promise((resolve) => {
      const tsCode = compile(code);

      const prettierCode = prettier.format(tsCode, {
        parser: 'typescript',
        printWidth: 50,
      });

      resolve({
        code: prettierCode,
        rawCode: tsCode,
      });
    });
  };
} else {
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
  compileCivet = (code) => {
    uid++;
    playgroundWorker.postMessage({ uid, code });
    return new Promise((resolve, reject) => {
      msgMap[uid] = { resolve, reject };
    });
  };
}

export { compileCivet };
