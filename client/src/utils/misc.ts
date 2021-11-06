import { isServer } from "./postprocess/misc";
import * as SPAs from "../../config/spa.config";

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
