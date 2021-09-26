import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

export async function postProcess(workDir: string, filePattern: string): Promise<void> {
  const readdir = promisify(fs.readdir);
  const files = await readdir(workDir);
  const txtFiles = files.filter(file =>
    path.extname(file) === ".txt" && path.basename(file).startsWith(filePattern));
  const htmlFiles = files.filter(file =>
    path.extname(file) === ".html" && path.basename(file).startsWith(filePattern));

  if (txtFiles.length !== 1 || htmlFiles.length !== 1) {
    throw new Error("Unexpected count of SSR related files");
  }

  await postProcessFile(workDir, htmlFiles[0], txtFiles[0]);
}

async function postProcessFile(workDir: string, htmlFile: string, ssrFile: string): Promise<void> {
  const readFile = promisify(fs.readFile);
  const htmlFilePath = path.join(workDir, htmlFile);
  const ssrFilePath = path.join(workDir, ssrFile);

  const dataHtml = await readFile(htmlFilePath);
  const dataSsr = (await readFile(ssrFilePath)).toString();
  const reReact = /^\s*<div\s+id="app-root">/;
  const ar: string[] = dataHtml.toString().replace(/\r\n?/g, "\n").split("\n");

  const out = ar.map(str => {
    if (reReact.test(str)) {
      str += "\n";
      str += dataSsr;
    }
    str += "\n";
    return str;
  });

  const stream = fs.createWriteStream(htmlFilePath);
  stream.on("error", err => {
    console.error(`Failed to write to file ${htmlFilePath}, error: ${err}`)
  });
  out.forEach(str => { stream.write(str); });
  stream.end();
}
