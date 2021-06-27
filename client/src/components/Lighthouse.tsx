/**
 * ComponentB is a sample component.
 * Belongs to the First SPA and uses BaseComponent
 * for rendering.
 */
import * as React from "react";
import { style } from "typestyle";
import {
  Header,
  Container,
  Icon
} from "semantic-ui-react";
import { Navigation } from "./Navigation";
import { BaseComponent } from "./BaseComponent";

const cssIcon = style({
  float: "left",
  marginTop: "0.2em !important",
  marginRight: "0.7em  !important",
  marginBottom: "0em  !important"
});

const Description: React.FC = _props => {
  return (
    <section>
      <Container text textAlign="justified">
        <Header as="h3">Hello from the Lighthouse component</Header>
        <p>
          <Icon
            name="tachometer alternate"
            size="big"
            color="blue"
            className={cssIcon}
          />
          The performance of this website can be measured using Google Lighthouse
          tool. The tool is embedded into Chrome. Open Chrome DevTools and use the
          Lighthouse tab to run a performance audit. Assuming the 'Desktop' setting is
          used, the performance score should be around 100 depending on the hardware.
        </p>
        <p>
          Alternatively use a cloud instance of Lighthouse provided by Google at web.dev <a
          href="https://web.dev/measure/" target="_blank" rel="noopener noreferrer">
          Measure</a> page. It will emulate a smartphone so the score could be
          somewhat lower.
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
