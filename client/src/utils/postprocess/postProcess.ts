import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { webpack } from "webpack";
import { postProcess as postProcessSSR } from "./postProcessSSR";
import { postProcess as postProcessCSS } from "./postProcessCSS";

const workDir = "./dist/";

// stackoverflow.com/a/16060619
function requireUncached(module: string) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

export async function postProcess(): Promise<void> {
  const ssrSpaNames = require("../../../config/spa.config").getSsrNames();

  if (ssrSpaNames.length > 0) {
    const getEntrypoints = require("../../../config/spa.config").getEntrypoints;

    const performSsr = async (ssrSpaName: any) => {
      type SSRTuple = [string, string];
      let tp: SSRTuple|undefined;

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

      const { ssrLibrary }  = requireUncached("../../../dist-ssr/ssr-library");
      const { default: asString } = ssrLibrary;

      if (!asString) {
        console.error("Error: Any SPA with SSR enabled must have 'asString' function exported as default in its entrypoint .tsx file. \
Please check the 4-step sequence (provided in the comments at the top of each entrypoints/xxx.tsx file) has been followed.");
        process.exit(1);
      }

      const writeFile = promisify(fs.writeFile);

      try {
        await writeFile(path.join(workDir, tp[0]), asString());
        await postProcessSSR(workDir, ssrSpaName);
      } catch (e) {
        console.error(`Failed to create pre-built SSR file, exception: ${e}`);
        process.exit(1);
      }
    };

    console.log("Starting SSR post-processing");

    for (const spa of ssrSpaNames) {
      await performSsr(spa);
    }

    console.log("Finished SSR post-processing")
  }

  if (process.env.CF_PAGES) {
    const writeFile = promisify(fs.writeFile);
    const redirectName = require("../../../config/spa.config").getRedirectName();
    const stapleName = "index";
    const redirectFile = path.join(workDir, "_redirects");

    if (redirectName.toLowerCase() !== stapleName) {
      try {
        await writeFile(redirectFile, `/ ${redirectName} 301`);
      } catch (e) {
        console.error(`Failed to create redirect file, exception: ${e}`);
        process.exit(1);
      }
    }
  }

  try {
    await postProcessCSS();
  } catch (e) {
    console.error(`Failed to post-process CSS, exception: ${e}`);
    process.exit(2);
  }
}

postProcess().catch((e: Error) => {
  console.error(`SSR/CSS processing failed, error: ${e}`);
  process.exit(3);
});
