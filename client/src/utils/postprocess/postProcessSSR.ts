import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { JSDOM } from "jsdom";
import * as SPAs from "../../../config/spa.config";

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

  await postProcessBody(workDir, htmlFiles[0], txtFiles[0]);
  await postProcessHeader(workDir, htmlFiles[0]);
}

async function postProcessBody(workDir: string, htmlFile: string, ssrFile: string): Promise<void> {
  const readFile = promisify(fs.readFile);
  const writeFile = promisify(fs.writeFile);

  const htmlFilePath = path.join(workDir, htmlFile);
  const ssrFilePath = path.join(workDir, ssrFile);

  const jsdom = await JSDOM.fromFile(htmlFilePath);

  if (!jsdom) {
    throw "JSDOM creation failure";
  }

  const dataSsr = (await readFile(ssrFilePath)).toString();
  const fragment = JSDOM.fragment(dataSsr);
  const appRoot = jsdom.window.document.querySelector("div[id='app-root']");

  if (!appRoot) {
    throw "JSDOM - 'app-root' not found";
  }

  appRoot.appendChild(fragment);
  await writeFile(htmlFilePath, jsdom.serialize());
}

async function postProcessHeader(workDir: string, htmlFile: string): Promise<void> {
  const htmlFilePath = path.join(workDir, htmlFile);
  const jsdom = await JSDOM.fromFile(htmlFilePath);

  if (!jsdom) {
    throw "JSDOM creation failure";
  }

  const writeFile = promisify(fs.writeFile);
  const hdr: HTMLHeadElement = jsdom.window.document.head;
  const script = jsdom.window.document.createElement("script");
  // Replace with data specific to your site, then test using
  // https://validator.schema.org/ and
  // https://search.google.com/test/rich-results. The second
  // test will effectively fail because 'WebSite' is not
  // specific enough for Google. And so is 'WebPage'.
  // See https://developers.google.com/search/docs/advanced/structured-data/sd-policies#specificity
  const structuredData = `{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "${SPAs.appTitle}",
    "datePublished": "${new Date().toISOString().split("T")[0]}",
  }`;

  script.setAttribute("type", "application/ld+json");
  script.textContent = structuredData;
  hdr.appendChild(script);
  await writeFile(htmlFilePath, jsdom.serialize());
}


