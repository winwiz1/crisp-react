/**
 * Navigation is a reusable component
 * responsible for rendering the menu.
 */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";
import * as SPAs from "../../config/spa.config";
import styles from "../css/navigation.module.css";

const cssStyle: Record<string, string> = {
  menu: styles["menu"],
};

export const Navigation: React.FC = _props => {
  return (
    <nav className={cssStyle.menu}>
      <Menu
        vertical
        size="large"
        className="nav_menu"
      >
        <Menu.Item>
          <Menu.Header>First SPA</Menu.Header>
          <Menu.Menu>
            <Menu.Item header as={NavLink} exact to="/">
              Overview
              <Icon name="file alternate outline" size="large" />
            </Menu.Item>
            <Menu.Item header as={NavLink} to="/a">
              ComponentA
              <Icon name="cube" size="large" />
            </Menu.Item>
            <Menu.Item header as={NavLink} to="/lighthouse">
              Lighthouse
              <Icon name="tachometer alternate" size="large" />
            </Menu.Item>
            <Menu.Item header as={NavLink} to="/namelookup">
              NameLookup
              <Icon name="search" size="large" />
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        {SPAs.getNames().length > 1 && <Menu.Item>
          <Menu.Header>Second SPA</Menu.Header>
          <Menu.Menu>
            <Menu.Item href={`/${SPAs.getNames()[1]}.html`}>
              ComponentB
              <Icon name="cube" size="large" />
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        }
      </Menu>
    </nav>
  );
};
