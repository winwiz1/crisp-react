/**
 * ComponentC is a sample component.
 * It is the only component of the Second SPA.
 */
import * as React from "react";
import { Header, Container, Menu } from "semantic-ui-react";
import { BaseComponent } from "./BaseComponent";
import * as SPAs from "../../config/spa.config";
import "../css/app.css";       // import plain CSS file once in any source file.

const Description: React.FC = _props => {
  return (
    <section>
      <Container text textAlign="justified">
        <Header as="h3">Hello from ComponentB</Header>
        <p>
          <code>ComponentB</code> is used by <code>second.tsx</code> which has been
          set as an 'entry point' of the 'second' script bundle responsible for the
          Second SPA rendering.
        </p>
        <p>
          SSR has been disabled for the Second SPA. As a result, the HTML &lt;body&gt;
          element of this page contains mostly references to the script bundles
          with very little HTML markup.
        </p>
        <p>
          The Second SPA doesn't have an overview page and this page is the only one
          the SPA consists of.
        </p>
      </Container>
      <span
        className="sr-only"
        id="sampleId"
      >
        This text is not visible. It could have contained a screen reader prompt.
        Which could be used by a screen reader provided there is aria-labelledby
        attribute somewhere that refers to this text e.g. aria-labelledby='sampleId'
      </span>
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

export const ComponentB: React.FC = _props => {
  return (
    <BaseComponent leftComponent={Navigation} rightComponent={Description} />
  );
};
