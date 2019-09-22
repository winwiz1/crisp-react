/**
 * ComponentC is a sample component.
 * It is the only component of the Second SPA.
 */
import * as React from "react";
import { Header, Container, Menu } from "semantic-ui-react";
import { BaseComponent } from "./BaseComponent";
import * as SPAs from "../../config/spa.config";

const Description: React.FC = _props => {
  return (
    <section>
      <Container text textAlign="justified">
        <Header as="h3">Hello from ComponentC</Header>
        <p>
        <code>ComponentC</code> is used by <code>second.tsx</code> which has been
        set as an 'entry point' of the 'second' JS bundle responsible for the
        Second SPA rendering. The SPA doesn't have an overview page and this page
        is the only one that the Second SPA consists of.
      </p>
      </Container>
    </section>
  );
};

const Navigation: React.FC = _props => {
  return (
    <nav>
      <Menu vertical compact borderless>
        <Menu.Item>
          <Menu.Header>Go back to</Menu.Header>
          <Menu.Menu>
            <Menu.Item href={`/${SPAs.getNames()[0]}.html`}>First SPA</Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    </nav>
  );
};

export const ComponentC: React.FC = _props => {
  return (
    <BaseComponent leftComponent={Navigation} rightComponent={Description} />
  );
};
