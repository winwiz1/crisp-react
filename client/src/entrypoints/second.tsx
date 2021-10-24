/**
 * The 'entry point' (in webpack terminology)
 * of the Second SPA.
 *
 * SSR has been disabled for this entry point.
 * To enable SSR:
 *  - uncomment import { renderToString } ...
 *  - replace ReactDOM.render with ReactDOM.hydrate (see comments below)
 *  - uncomment the SSR block at the bottom
 *  - set the 'ssr' flag to true for this SPA in spa.config.js
 *
 * Note than only one SPA (and therefore one entry point) can have SSR enabled.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ComponentB } from "../components/ComponentB";
import { ErrorBoundary } from "../components/ErrorBoundary";
// import { renderToString } from "react-dom/server";
import * as SPAs from "../../config/spa.config";
import { isServer } from "../utils/postprocess/misc";
import "../css/app.css";       // import plain CSS file once in any source file.
import "../css/app.less";      // import LESS file once in any source file.

const Second: React.FC = _props => {
  return (
    <>
      <ErrorBoundary>
        <div className="welcome">
          <h2>Welcome to {SPAs.appTitle}</h2>
        </div>
        <ComponentB />
      </ErrorBoundary>
    </>
  )
};

if (!isServer()) {
   ReactDOM.render(                         // .render(...) is used without SSR
// ReactDOM.hydrate(                        // .hydrate(...) is used with SSR
    <Second />,
    document.getElementById("app-root")
  );
}

/****************** SSR block start ******************/
/*
const asString = (): string => {
 return renderToString(<Second />)
}

export default asString;
*/
/****************** SSR block end ******************/

