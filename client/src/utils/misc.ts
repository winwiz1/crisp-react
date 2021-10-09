import { isServer } from "./postprocess/misc";
import * as SPAs from "../../config/spa.config";

export const getCanonical = (pagePath?: string): string|undefined => {
  if (isServer()) {
    return undefined;
  }
  // eslint-disable-next-line no-extra-boolean-cast
  return !!pagePath? (window.location.origin + pagePath) : window.location.href;
}

export const getTitle = (pageTitle?: string): string => {
  // eslint-disable-next-line no-extra-boolean-cast
  return !!pageTitle? `${SPAs.appTitle} - ${pageTitle}` : SPAs.appTitle;
}
