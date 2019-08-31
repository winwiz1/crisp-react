/**
 * In webpack terminology the 'entry point'
 * of the Second SPA.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import { ComponentC } from "../components/ComponentC";

ReactDOM.render(
  <>
    <Helmet title="Crisp React" />
    <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "3rem" }}>
      <h2>Welcome to Crisp React</h2>
    </div>
    <ComponentC />
  </>,
  document.getElementById("react-root")
);
