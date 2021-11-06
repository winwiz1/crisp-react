/**
 * The 'entry point' (in webpack terminology)
 * of the First SPA.
 *
 * SSR has been enabled for this entry point.
 * To disable SSR:
 *  - comment out import { renderToString } ...
 *  - replace ReactDOM.hydrate with ReactDOM.render (see comments below)
 *  - comment out the SSR block at the bottom
 *  - set the 'ssr' flag to false for this SPA in spa.config.js
 *
 * Note than only one SPA (and therefore one entry point) can have SSR enabled.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import { ComponentA } from "../components/ComponentA";
import { Lighthouse } from "../components/Lighthouse";
import { Overview } from "../components/Overview";
import { NotFound } from "../components/NotFound";
import { NameLookup } from "../components/NameLookup";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { renderToString } from "react-dom/server";                 // used for SSR
import * as SPAs from "../../config/spa.config";
import { isServer, getHistory } from "../utils/postprocess/misc";
import "../css/app.css";
import "../css/app.less";

// If the first SPA is called 'first' then the regex
// will match '/first' and '/first.html';
const regexPath = new RegExp(`^/${SPAs.getRedirectName()}(\.html)?$`);

const First: React.FC = _props => {

  const catchAll = () => {
    const path = window.location.pathname.toLowerCase();

    if (regexPath.test(path)) {
      return <Overview/>
    }

    return  <NotFound/>;
  }

  return (
    <>
      <Router history={getHistory()}>
        <ErrorBoundary>
          <div className="welcome">
            <h2>Welcome to {SPAs.appTitle}</h2>
          </div>
          <Switch>
            <Route exact path="/" component={Overview} />
            <Route path="/a" component={ComponentA} />
            <Route path="/lighthouse" component={Lighthouse} />
            <Route path="/namelookup" component={NameLookup} />
            <Route render={catchAll} />
          </Switch>
        </ErrorBoundary>
      </Router>
    </>
  )
};

if (!isServer()) {
// ReactDOM.render(                         // .render(...) is used without SSR
   ReactDOM.hydrate(                        // .hydrate(...) is used with SSR
    <First />,
    document.getElementById("app-root")
  );
}

/****************** SSR block start ******************/

const asString = (): string => {
  return renderToString(<First />)
}

export default asString;

/****************** SSR block end ******************/
