/**
 * ComponentA is a sample component. It belongs
 * to the First SPA and uses BaseComponent
 * to render self.
 */
import * as React from "react";
import { Helmet } from "react-helmet";
import { Header, Container } from "semantic-ui-react";
import { Navigation } from "./Navigation";
import { BaseComponent } from "./BaseComponent";
import { StructuredData } from "./StructuredData";
import { getTitle, getCanonical } from "../utils/misc";

const Description: React.FC = _props => {
  const pageName = "ComponentA";
  const pageDescription = "Sample component called 'ComponentA'";

  return (
    <section>
      <Helmet>
        <title>{getTitle(pageName)}</title>
        <link rel="canonical" href={getCanonical()} />
      </Helmet>
      <StructuredData
        name={pageName}
        description={pageDescription}
      />
      <Container text textAlign="justified">
        <Header as="h3">Hello from ComponentA</Header>
        <p>
          <code>ComponentA</code> is imported by <code>first.tsx</code> which has been set as an 'entry point'
          of the 'first' script bundle by <code>webpack.config.js</code>. Because of that the
          component <code>ComponentA</code> and its dependencies (if any) are packaged into
          the 'first' script bundle, except for components under <code>node_modules/</code> separated
          into the 'vendor' bundle.
        </p>
      </Container>
    </section>
  );
};

export const ComponentA: React.FC = _props => {
  return (
      <BaseComponent
        leftComponent={Navigation}
        rightComponent={Description}
      />
  );
};
