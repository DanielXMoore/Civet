import fs from 'fs';
import childProcess from 'child_process';

type CompileCivet = (code: string) => Promise<{
  code: string;
  rawCode: string;
}>;

let compileCivet: CompileCivet;

// @ts-ignore
if (import.meta.env.SSR) {
  const inputPath = 'civet.dev/.vitepress/tmp.civet';
  const outputPath = `${inputPath}.tsx`;
  compileCivet = (code) => {
    return new Promise((resolve) => {
      fs.writeFileSync(inputPath, code);
      childProcess.execSync(`node dist/civet -c ${inputPath}`);
      const tsCode = fs.readFileSync(outputPath).toString();
      childProcess.execSync(`npx prettier --write ${outputPath}`);
      const prettierCode = fs.readFileSync(outputPath).toString();
      childProcess.execSync(`rm ${inputPath} ${outputPath}`);

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
