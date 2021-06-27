/**
 * Navigation is a reusable component
 * responsible for rendering the menu.
 */
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { style } from "typestyle";
import * as SPAs from "../../config/spa.config";

const cssMenu = style({
  $nest: {
    "&>a": {
      lineHeight: "1.4em !important",
    },
  }
});

export const Navigation: React.FC = _props => {
  return (
    <nav>
      <Menu vertical>
        <Menu.Item>
          <Menu.Header>First SPA</Menu.Header>
          <Menu.Menu className={cssMenu}>
            <Menu.Item header as={NavLink} exact to="/" children="Overview" />
            <Menu.Item header as={NavLink} to="/a" children="ComponentA" />
            <Menu.Item header as={NavLink} to="/lighthouse" children="Lighthouse" />
            <Menu.Item header as={NavLink} to="/namelookup" children="NameLookup" />
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Second SPA</Menu.Header>
          <Menu.Menu className={cssMenu}>
            <Menu.Item href={`/${SPAs.getNames()[1]}.html`}>ComponentB</Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    </nav>
  );
};
