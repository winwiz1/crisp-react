/**
 * ComponentB is a sample component.
 * Belongs to the First SPA and uses BaseComponent
 * for rendering.
 */
import * as React from "react";
import { style } from "typestyle";
import {
  Header,
  Divider,
  Container,
  Icon
} from "semantic-ui-react";
import { Navigation } from "./Navigation";
import { BaseComponent } from "./BaseComponent";
import { getAnchorCSS } from "../css/common-styles";

const cssContainer = style(
  getAnchorCSS()
);

const cssIcon = style({
  float: "left",
  marginTop: "0.2em !important",
  marginRight: "0.7em  !important",
  marginBottom: "0em  !important"
});

const Description: React.FC = _props => {
  return (
    <section>
      <Container text textAlign="justified" className={cssContainer}>
        <Header as="h3">Hello from the Lighthouse component</Header>
        <p>
          <Icon
            name="tachometer alternate"
            size="big"
            color="blue"
            className={cssIcon}
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
          question what will happen when the functionality is extended and the React
          codebase grows. Some considerations on this subject can be found <a
          href="https://winwiz1.github.io/crisp-react/docs/benchmarks/PERFORMANCE.html#future-considerations"
          target="_blank" rel="noopener noreferrer">here</a>. Additionally, it's important
          to <a href="https://winwiz1.github.io/crisp-react/#custom-domain-and-cdn"
          target="_blank" rel="noopener noreferrer">ensure</a> CDN caches everything
          except for API responses thus allowing your webserver(s) to serve static
          assets to various CDN datacenters around the globe (there could be hundreds
          of those) rather than to the end users.
        </p>
      </Container>
    </section>
  );
};

export const Lighthouse: React.FC = _props => {
  return (
      <BaseComponent leftComponent={Navigation} rightComponent={Description} />
  );
};
