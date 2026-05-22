import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (p.endsWith(".civet")) out.push(p);
  }
  return out;
}

const files = await walk("src");
if (!files.length) process.exit(0);
const bin = process.platform === "win32" ? "civet.cmd" : "civet";
const result = spawnSync(join("node_modules", ".bin", bin), ["--emit-declaration", ...files], { stdio: "inherit" });
process.exit(result.status ?? 0);
