/**
 * Overview is a sample component that provides
 * an overview of the First SPA it belongs to.
 * Uses BaseComponent for rendering.
 */
import * as React from "react";
import { Header, Container } from "semantic-ui-react";
import { Navigation } from "./Navigation";
import { BaseComponent } from "./BaseComponent";

const Description: React.FC = _props => {
  return (
    <>
      <Container text textAlign="justified">
        <Header as="h4">
          The First Single Page Application (SPA) - Overview
        </Header>
        <p>
          The First SPA is rendered by the 'first' JS bundle called <code>
          first.&lt;hash&gt;.js</code>. The SPA consists of this overview
          page and the two pages rendered by <code>ComponentA</code> and <code>
          ComponentB</code>. Please use the menu to go to either page.
        </p>
        <p>
          Alternatively choose <code>ComponentC</code> belonging to the Second
          SPA rendered by the 'second' JS bundle. It will make the Second SPA
          load and if Redux was used then it would have caused destruction of
          any existing Redux store(s) thus allowing the next SPA to start with
          a clean plate.
        </p>
      </Container>
    </>
  );
};

export const Overview: React.FC = _props => {
  return (
    <BaseComponent leftComponent={Navigation} rightComponent={Description} />
  );
};
