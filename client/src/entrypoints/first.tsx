/**
 * The 'entry point' (in webpack terminology)
 * of the First SPA.
 * 
 * SSR has been disabled for this entry point.
 * To enable SSR:
 *  - uncomment import of renderToString
 *  - replace ReactDOM.render with ReactDOM.hydrate (see comments below),
 *  - uncomment the SSR block at the bottom.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import { Router, Route, Switch } from "react-router-dom";
import { ComponentA } from "../components/ComponentA";
import { ComponentB } from "../components/ComponentB";
import { Overview } from "../components/Overview";
import { NameLookup } from "../components/NameLookup";
import { ErrorBoundary } from "../components/ErrorBoundary";
// import { renderToString } from "react-dom/server";                 // used for SSR
import * as SPAs from "../../config/spa.config";
import { isServer, getHistory } from "../utils/ssr/misc";

const First: React.FC = _props => {
  return (
    <>
      <Router history={getHistory()}>
        <ErrorBoundary>
          <Helmet title={SPAs.appTitle} />
          <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "3rem" }}>
            <h2>Welcome to {SPAs.appTitle}</h2>
          </div>
          <Switch>
            <Route exact path="/" component={Overview} />
            <Route path="/a" component={ComponentA} />
            <Route path="/b" component={ComponentB} />
            <Route path="/namelookup" component={NameLookup} />
            <Route component={Overview} />
          </Switch>
        </ErrorBoundary>
      </Router>
    </>
  )
};

if (!isServer()) {
   ReactDOM.render(                         // .render(...) is used without SSR
// ReactDOM.hydrate(                        // .hydrate(...) is used with SSR
    <First />,
    document.getElementById("react-root")
  );
}

/****************** SSR block start ******************/
/*
const asString = () => {
  return renderToString(<First />)
}

export default asString;
*/
/****************** SSR block end ******************/
