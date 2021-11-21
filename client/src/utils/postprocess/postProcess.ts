import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { webpack } from "webpack";
import { CallbackWrapper } from "./misc"
import { postProcess as postProcessSSR } from "./postProcessSSR";
import { postProcess as postProcessCSS } from "./postProcessCSS";

const workDir = "./dist/";
const workDirExists = fs.existsSync(workDir);

// stackoverflow.com/a/16060619
function requireUncached(module: string) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

export async function postProcess(): Promise<void> {
  const ssrSpaNames = require("../../../config/spa.config").getSsrNames();

  if (ssrSpaNames.length > 0) {
    const getEntrypoints = require("../../../config/spa.config").getEntrypoints;
    const { performance, PerformanceObserver} = require("perf_hooks");
    const observer = new PerformanceObserver((items: any) => {
      items.getEntries().forEach((item:any) => {
        console.log(`Build-time SSR for SPA '${item.name}' took ${Math.round(item.duration)} msec`);
      });
      performance.clearMarks();
    });
    observer.observe({entryTypes: ["measure"]});

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

      const perfLiterals = ["start", "end"];
      performance.mark(perfLiterals[0]);
      const ssrContent = asString();
      performance.mark(perfLiterals[1]);
      performance.measure(ssrSpaName, perfLiterals[0], perfLiterals[1]);

      if (workDirExists) {
        try {
          const writeFile = promisify(fs.writeFile);
          await writeFile(path.join(workDir, tp[0]), ssrContent);
          await postProcessSSR(workDir, ssrSpaName);
        } catch (e) {
          console.error(`Failed to create pre-built SSR file, exception: ${e}`);
          process.exit(1);
        }
      }
    };

    console.log(workDirExists? "Starting SSR post-processing" : "Starting 'renderAsString' benchmarking");

    for (const spa of ssrSpaNames) {
      await performSsr(spa);
    }

    console.log(workDirExists? "Finished SSR post-processing" : "Finished 'renderAsString' benchmarking");
  }

  if (workDirExists) {
    try {
      await postProcessCSS();
    } catch (e) {
      console.error(`Failed to post-process CSS, exception: ${e}`);
      process.exit(2);
    }
  } else {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

postProcess().catch((e: Error) => {
  console.error(`SSR/CSS processing failed, error: ${e}`);
  process.exit(3);
});
