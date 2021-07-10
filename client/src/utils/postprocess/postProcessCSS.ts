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

  await Promise.all(htmlFiles.map(async (file) => {
    await postProcessFile(file);
  }));

  console.log("Finished CSS post-processing")
}

async function postProcessFile(htmlFile: string): Promise<void> {
  const htmlFilePath = path.join(workDir, htmlFile);

  const jsdom = await JSDOM.fromFile(htmlFilePath);
  if (!jsdom) {
    throw "JSDOM creation failure";
  }

  const links: NodeListOf<HTMLLinkElement> = jsdom.window.document.querySelectorAll("head>link[rel='stylesheet'][href^='/static']");
  const writeFile = promisify(fs.writeFile);

  if (links.length > 1) {
    // There are two identical links to the combined stylesheet.
    // One needs to be removed.
    const el = links[0];
    el.parentNode?.removeChild(el);
    await writeFile(htmlFilePath, jsdom.serialize());
  }
}
