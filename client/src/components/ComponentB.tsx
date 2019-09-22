/**
 * ComponentB is a sample component.
 * Belongs to the First SPA and uses BaseComponent
 * for rendering.
 */
import * as React from "react";
import { Header, Container } from "semantic-ui-react";
import { Navigation } from "./Navigation";
import { BaseComponent } from "./BaseComponent";

const Description: React.FC = _props => {
  const testLog = "test log";
  // TODO Demo only, use a logger instead or remove
  console.log(testLog);

  return (
    <section>
      <Container text textAlign="justified">
      <Header as="h3">Hello from ComponentB</Header>
      <p>
        <code>ComponentB</code> is used by <code>first.tsx</code> which has been
        set as an 'entry point' of the 'first' JS bundle by <code>
        webpack.config.js</code>. Because of that the <code>ComponentB</code> and
        its dependencies (if any) are packaged into the 'first' JS bundle,
        except for components under <code>node_modules/</code> separated into the
        'vendor' bundle.
      </p>
      </Container>
    </section>
  );
};

export const ComponentB: React.FC = _props => {
  return (
      <BaseComponent leftComponent={Navigation} rightComponent={Description} />
  );
};
