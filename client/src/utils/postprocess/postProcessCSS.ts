import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { JSDOM } from "jsdom";

const workDir = "./dist/";

export async function postProcess(): Promise<void> {
  console.log("Started CSS post-processing");

  const readdir = promisify(fs.readdir);
  const files = await readdir(workDir);

  const htmlFiles = files.filter(file => path.extname(file) === ".html");

  if (htmlFiles.length === 0) {
    throw "No .html files found"
  }

  const cssFiles = files.filter(file => path.extname(file) === ".css");

  if (cssFiles.length > 0) {
    await Promise.all(htmlFiles.map(async (file) => {
      await postProcessFile(file, cssFiles);
    }));
  }

  console.log("Finished CSS post-processing")
}

async function postProcessFile(htmlFile: string, cssFiles: string[]): Promise<void> {
  const htmlFilePath = path.join(workDir, htmlFile);

  const jsdom = await JSDOM.fromFile(htmlFilePath);
  if (!jsdom) {
    throw "JSDOM creation failure";
  }

  cssFiles.map(cssFile => {
    const links: NodeListOf<HTMLLinkElement> = jsdom.window.document.querySelectorAll(`head>link[rel='stylesheet'][href^='/static/${cssFile}']`);
    const writeFile = fs.writeFileSync;

    if (links.length > 1) {
      const el = links[0];
      el.parentNode?.removeChild(el);
      writeFile(htmlFilePath, jsdom.serialize());
    }
  });
}
