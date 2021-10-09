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
import { getTitle } from "../utils/misc";

const Description: React.FC = _props => {
  return (
    <section>
      <Helmet>
        <title>{getTitle("Page Not Found")}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Container text textAlign="justified">
        <Header as="h3">Hello from Not Found</Header>
        <p>
          The page you have requested could not be found.
        </p>
      </Container>
    </section>
  );
};

export const NotFound: React.FC = _props => {
  return (
      <BaseComponent leftComponent={Navigation} rightComponent={Description} />
  );
};
