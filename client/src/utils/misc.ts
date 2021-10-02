import * as SPAs from "../../config/spa.config";

export const getCanonical = (pagePath: string): string => {
  const jamStackDeploymentUrl = "https://crisp-react.pages.dev/";
  const fullStackDeploymentUrl = "https://crisp-react.winwiz1.com/";
  const metaUrl = CF_PAGES? jamStackDeploymentUrl : fullStackDeploymentUrl;

  return !!pagePath? metaUrl + pagePath : metaUrl;
}

export const getTitle = (pageTitle: string): string => {
  return !!pageTitle? `${SPAs.appTitle} - ${pageTitle}` : SPAs.appTitle;
}
