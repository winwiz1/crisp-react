/**
 * Navigation is a reusable component
 * responsible for rendering the menu.
 */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import * as SPAs from "../../config/spa.config";
import styles from "../css/navigation-style.css";

const cssStyle: Record<string, string> = {
  menu: styles["menu"],
};

const cssMenu = css({
  "div.header": {
    fontSize: "1.1em !important"
  },
  "& a": {
    fontSize: "0.9em !important",
    paddingTop: "1em !important",
    paddingBottom: "1em !important",
  },
});

export const Navigation: React.FC = _props => {
  return (
    <nav css={cssStyle.menu}>
      <Menu vertical css={cssMenu}>
        <Menu.Item>
          <Menu.Header>First SPA</Menu.Header>
          <Menu.Menu css={cssMenu}>
            <Menu.Item header as={NavLink} exact to="/" children="Overview" />
            <Menu.Item header as={NavLink} to="/a" children="ComponentA" />
            <Menu.Item header as={NavLink} to="/lighthouse" children="Lighthouse" />
            <Menu.Item header as={NavLink} to="/namelookup" children="NameLookup" />
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Second SPA</Menu.Header>
          <Menu.Menu>
            <Menu.Item href={`/${SPAs.getNames()[1]}.html`}>ComponentB</Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    </nav>
  );
};
