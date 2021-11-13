import { isServer } from "./postprocess/misc";
import * as SPAs from "../../config/spa.config";
import logger from "./logger";

//#region SEO

const regexPath1Literal = `/${SPAs.getRedirectName()}(.html)?$`;
const regexPath1 = new RegExp(regexPath1Literal, "i");
const regexPath2 = new RegExp(/\.html$/, "i");

export const getCanonical = (pagePath?: string): string|undefined => {
  if (isServer()) {
    return undefined;
  }
  // eslint-disable-next-line no-extra-boolean-cast
  let ret = !!pagePath? (window.location.origin + pagePath) : window.location.href;
  ret = ret.replace(regexPath1, "/").replace(regexPath2, "");
  return ret;
}

export const getTitle = (pageTitle?: string): string => {
  // eslint-disable-next-line no-extra-boolean-cast
  const ret = !!pageTitle? `${SPAs.appTitle} - ${pageTitle}` : SPAs.appTitle;
  return ret + (CF_PAGES? " (Jamstack build)" : " (Full stack build)");
}

//#endregion

//#region Performance Benchmarking

const perfLiterals = ["fetch", "click", "end", "measure", "mark"];

export const perfStart = (name: "click"|"fetch") => {
  const perf = window?.performance;
  perf?.mark(name);
}

export const perfEnd = (): undefined|number => {
  if (typeof(window?.performance?.getEntriesByName) !== "function") {
    return undefined;
  }

  const perf = window.performance;
  const fetchEntries = perf.getEntriesByName(perfLiterals[0], perfLiterals[4]);
  const clickEntries = perf.getEntriesByName(perfLiterals[1], perfLiterals[4]);
  const clickEntriesLen = Math.min(...[clickEntries.length, 1]);

  if (clickEntriesLen === 0 && fetchEntries.length === 0) {
    return undefined;
  }

  perf.mark(perfLiterals[2]);
  perf.measure(perfLiterals[3], perfLiterals[clickEntriesLen], perfLiterals[2]);
  const duration = performance.getEntriesByType(perfLiterals[3])[0].duration;
  logger.info(`${clickEntriesLen === 0? "Updating" : "Transition to"} internal SPA page ${clickEntriesLen === 0? "after fetch ": ""}took ${Math.round(duration)} msec`);
  perf.clearMarks();
  perf.clearMeasures();
  return duration;
}

//#endregion
