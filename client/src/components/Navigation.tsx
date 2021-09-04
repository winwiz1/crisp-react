/**
 * Navigation is a reusable component
 * responsible for rendering the menu.
 */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import * as SPAs from "../../config/spa.config";
import styles from "../css/navigation.module.css";

const cssStyle: Record<string, string> = {
  menu: styles["menu"],
};

export const Navigation: React.FC = _props => {
  return (
    <nav css={cssStyle.menu}>
      <Menu vertical className="nav_menu">
        <Menu.Item>
          <Menu.Header>First SPA</Menu.Header>
          <Menu.Menu>
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
