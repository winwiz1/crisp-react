/**
 * ComponentB is a sample component.
 * Belongs to the First SPA and uses BaseComponent
 * for rendering.
 */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  Header,
  Divider,
  Container,
  Icon
} from "semantic-ui-react";
import { Navigation } from "./Navigation";
import { BaseComponent } from "./BaseComponent";
import { StructuredData } from "./StructuredData";
import { getAnchorCSS } from "../css/common-styles";
import { getTitle, getCanonical } from "../utils/misc";

const cssContainer = css(
  getAnchorCSS()
);

const cssIcon = css({
  float: "left",
  marginTop: "0.2em !important",
  marginRight: "0.7em  !important",
  marginBottom: "0em  !important"
});

const Description: React.FC = _props => {
  const pageName = "Lighthouse";
  const pageDescription = "Sample component called 'Lighthouse'";

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
      <Container text textAlign="justified" css={cssContainer}>
        <Header as="h3">Hello from the Lighthouse component</Header>
        <p>
          <Icon
            name="tachometer alternate"
            size="big"
            color="blue"
            css={cssIcon}
          />
          The performance of this webapp can be measured using Google Lighthouse
          tool. The tool is embedded into Chrome. Open Chrome DevTools and use the
          Lighthouse tab to run a performance audit. Assuming the 'Desktop' setting is
          used, the performance score should be around 100 depending on the hardware.
        </p>
        <p>
          Alternatively use a cloud instance of Lighthouse provided by Google at the <a
          href="https://web.dev/measure/" target="_blank" rel="noopener noreferrer">
          web.dev/measure</a> page. It will emulate a smartphone so the <a
          href="https://lighthouse-dot-webdotdevsite.appspot.com//lh/html?url=https%3A%2F%2Fcrisp-react.winwiz1.com"
          target="_blank" rel="noopener noreferrer">
          score</a> could be somewhat lower.
        </p>
        <Divider />
        <p>
          The performance figures could look promising but at the same time prompting a
          question what will happen when the functionality is extended and the client
          codebase grows causing the script bundle size to increase. Crisp React addresses
          this issue by allowing a React application to be split into several SPAs each
          rendered by its own and smaller bundle. Dynamic imports with lazy loading are
          complimentary.<br/>Additionally, it's important
          to ensure a CDN caches everything except for API responses thus allowing your
          webserver to serve static assets to various CDN datacenters around the
          globe (there could be hundreds of those) rather than to the end users. The
          CDN related instructions are provided in the <a
          href="https://github.com/winwiz1/crisp-react/#readme"
          target="_blank" rel="noopener noreferrer">README</a>.
        </p>
      </Container>
    </section>
  );
};

export const Lighthouse: React.FC = _props => {
  return (
      <BaseComponent
        leftComponent={Navigation}
        rightComponent={Description}
      />
  );
};
