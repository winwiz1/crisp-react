/**
 * Navigation is a reusable component
 * responsible for rendering the menu.
 */
import * as React from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

export const Navigation: React.FunctionComponent = _props => {
  return (
    <nav>
      <Menu vertical compact borderless>
        <Menu.Item>
          <Menu.Header>First SPA</Menu.Header>
          <Menu.Menu>
            <Menu.Item as={Link} to="/a">ComponentA</Menu.Item>
            <Menu.Item as={Link} to="/b">ComponentB</Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Second SPA</Menu.Header>
          <Menu.Menu>
            <Menu.Item href="second.html">ComponentC</Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    </nav>
  );
};
