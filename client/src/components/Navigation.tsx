/**
 * Navigation is a reusable component
 * responsible for rendering the menu.
 */
import * as React from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import * as SPAs from "../../config/spa.config";

export const Navigation: React.FC = _props => {
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
            <Menu.Item href={`/${SPAs.getNames()[1]}.html`}>ComponentC</Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    </nav>
  );
};
