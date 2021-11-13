/**
 * NotFound renders the "Page Not Found" response and uses
 *   <meta name="robots" content="noindex" />
 * as a replacement for HTML 404 status code.
 */
import * as React from "react";
import { Helmet } from "react-helmet";
import { Header, Container } from "semantic-ui-react";
import { Navigation } from "./Navigation";
import { BaseComponent } from "./BaseComponent";
import { StructuredData } from "./StructuredData";
import { getTitle } from "../utils/misc";

const Description: React.FC = _props => {
  const pageName = "Page Not Found";
  const pageDescription = "Renders 'Page Not Found' response \
and uses <meta name='robots' content='noindex' /> \
as a replacement for HTML 404 status code.";

  return (
    <section>
      <Helmet>
        <title>{getTitle(pageName)}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <StructuredData
        name={pageName}
        description={pageDescription}
      />
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
      <BaseComponent
        leftComponent={Navigation}
        rightComponent={Description}
      />
  );
};
