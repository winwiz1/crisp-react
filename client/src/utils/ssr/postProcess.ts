import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const workDir = './dist/';

export async function postProcess(): Promise<void> {
  const readdir = promisify(fs.readdir);
  const files = await readdir(workDir);
  const txtFiles = files.filter(file => path.extname(file) === '.txt');
  const htmlFiles = files.filter(file => path.extname(file) === '.html');
  const ar = new Array<[string, string]>();

  htmlFiles.forEach(file => {
    const fileFound = txtFiles.find(txt => txt.startsWith(file.replace(/\.[^/.]+$/, "")));
    if (fileFound) {
      ar.push([file, fileFound]);
    }
  });

  await Promise.all(ar.map(([k, v]) => {
    return postProcessFile(k, v);
  }));

  // Using console at build time is acceptable.
  // tslint:disable-next-line:no-console
  console.log("Finished SSR post-processing")
}

async function postProcessFile(htmlFile: string, ssrFile: string): Promise<void> {
  const readFile = promisify(fs.readFile);
  const htmlFilePath = path.join(workDir, htmlFile);
  const ssrFilePath = path.join(workDir, ssrFile);

  const dataHtml = await readFile(htmlFilePath);
  const dataSsr = (await readFile(ssrFilePath)).toString();
  const reReact = /^\s*<div\s+id="react-root">/;
  const ar: string[] = dataHtml.toString().replace(/\r\n?/g, '\n').split('\n');

  const out = ar.map(str => {
    if (reReact.test(str)) {
      str += '\n';
      str += dataSsr;
    }
    str += '\n';
    return str;
  });

  const stream = fs.createWriteStream(htmlFilePath);
  stream.on('error', err => {
    // Using console at build time is acceptable.
    // tslint:disable-next-line:no-console
    console.error(`Failed to write to file ${htmlFilePath}, error: ${err}`)
  });
  out.forEach(str => { stream.write(str); });
  stream.end();
}