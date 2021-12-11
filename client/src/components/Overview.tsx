/**
 * Overview is a sample component that provides
 * an overview of the First SPA it belongs to.
 * Uses BaseComponent for rendering.
 */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  Header,
  Message,
  Icon,
  Container,
  Divider,
  
} from "semantic-ui-react";
import { Navigation } from "./Navigation";
import { BaseComponent } from "./BaseComponent";
import { StructuredData } from "./StructuredData";
import { getAnchorCSS } from "../css/common-styles";
import styles from "../css/overview.module.css";
import { getTitle, getCanonical } from "../utils/misc";

const cssStyle: Record<string, string> = {
  msg: styles["msg"],
};

const cssIcon = css({
  float: "left",
  marginTop: "0.2em !important"
});

const cssMessage = css(
  getAnchorCSS()
);

const Msg: React.FC = _props => {
  if (CF_PAGES) {
    return (
      <React.Fragment>
        'Jamstack' build option. It was deployed automatically
        by a CD pipeline created by <a target="_blank" rel="noopener noreferrer"
        href="https://pages.cloudflare.com/">Cloudflare&nbsp;Pages</a> in
        response to a push into the repository.
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        'Full stack' build option. It was deployed automatically
        by a CD pipeline created by <a target="_blank" rel="noopener noreferrer"
        href="https://heroku.com/">Heroku</a> in
        response to a push into the repository.
      </React.Fragment>
    );
  }

}

const Description: React.FC = _props => {
  const pageName = "Overview";
  const pageDescription = "Sample component called 'Overview'";

  return (
    <Container text textAlign="justified">
      <Helmet>
        <title>{getTitle()}</title>
        <link rel="canonical" href={getCanonical("/")} />
      </Helmet>
      <StructuredData
        name={pageName}
        description={pageDescription}
      />
      <Message
        css={cssMessage}
        className={cssStyle.msg}
      >
        <Icon
          css={cssIcon}
          name="info circle"
          color="blue"
          size="big"
        />
        This demo webapp was built from <a target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/winwiz1/crisp-react#readme">Crisp React
        </a> repository by choosing the <Msg />
      </Message>
      <Header as="h3">
        The First Single Page Application (SPA) - Overview
      </Header>
      <p>
        The First SPA is rendered by the 'first' JS bundle called <code>
        first.&lt;hash&gt;.js</code>. The SPA consists of this <code>
        Overview</code> page and the three pages rendered by <code>
        ComponentA</code>, <code>Lighthouse</code> and <code>NameLookup
        </code>. Use the menu to go to either page.
      </p>
      <p>
        Alternatively choose <code>ComponentB</code> belonging to the Second
        SPA rendered by the 'second' JS bundle. It will make the Second SPA
        load and if Redux was used then it would have caused destruction of
        any existing Redux store(s) thus allowing the next SPA to start with
        a clean plate.
      </p>
      <p>
      The <code>Lighthouse</code> menu opens a similarly named page with
      performance benchmarking suggestions. The results are meant to prove
      that innovative features this project offers do not have to come at
      the price of speed compromise.
      </p>
      <Divider />
      <p>
        The bundle and HTML produced by SSR which is enabled for this SPA can be
        seen by right-clicking on the page and choosing "View page source" menu.
        The HTML markup can be compared to that of the Second SPA which has SSR
        disabled.
      </p>
    </Container>
  );
};

export const Overview: React.FC = _props => {
  return (
    <BaseComponent
      leftComponent={Navigation}
      rightComponent={Description}
    />
  );
};
