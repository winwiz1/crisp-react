import * as fs from "fs";
import { promisify } from "util";
import { webpack } from "webpack";
import { postProcess as postProcessSSR } from "./postProcessSSR";
import { postProcess as postProcessCSS } from "./postProcessCSS";

export async function postProcess(): Promise<void> {
  const ssrSpaName = require("../../../config/spa.config").getSsrName();

  if (ssrSpaName) {

    type SSRTuple = [string, string];
    let tp: SSRTuple|undefined;

    console.log("Starting SSR post-processing");

    const getEntrypoints = require("../../../config/spa.config").getEntrypoints;

    for (const [key, value] of Object.entries(getEntrypoints())) {
      if (key === ssrSpaName) {
        const ssrFileName = `${key}-SSR.txt`;
        tp = [ssrFileName, value as string];
        break;
      }
    }

    if (!tp) {
      console.error("Internal SSR processing error");
      process.exit(1);
    }

    const webpackConfig = require("../../../webpack.config.ssr.js");
    const compiler = webpack({...webpackConfig, entry: tp[1]});

    type PromiseCallback = () => void;

    class CallbackWrapper {
      constructor(readonly callback: PromiseCallback) {
      }
      readonly invoke = (): void => {
        this.callback();
      }
    }

    let cbWrapper: CallbackWrapper|undefined;
    const waitForCompiler = new Promise<void>((resolve) => { cbWrapper = new CallbackWrapper(resolve)});

    compiler.run((err, stats) => {
      if (err) {
        console.error(`Library compilation failed, error: ${err}`);
        process.exit(1);
      }
      if (stats?.hasErrors()) {
        console.error(`Library compilation failed, error: ${stats?.toString() ?? "no description"}`);
        process.exit(1);
      }
      cbWrapper?.invoke();
    });

    await waitForCompiler;

    const { ssrLibrary }  = require("../../../dist-ssr/ssr-library");
    const { default: asString } = ssrLibrary;
    const writeFile = promisify(fs.writeFile);

    try {
      await writeFile('./dist/' + tp[0], asString());
      await postProcessSSR();
    } catch (e) {
      console.error(`Failed to create pre-built SSR file, exception: ${e}`);
      process.exit(1);
    }
  } //if (ssrSpaName)

  try {
    await postProcessCSS();
  } catch (e) {
    console.error(`Failed to post-process CSS, exception: ${e}`);
    process.exit(1);
  }
}

postProcess().catch((e: Error) => {
  console.error(`SSR/CSS processing failed, error: ${e}`);
  process.exit(2);
});
