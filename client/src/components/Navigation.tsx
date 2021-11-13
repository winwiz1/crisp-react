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
import { isServer } from "../utils/postprocess/misc";
import { perfStart } from "../utils/misc";

const cssStyle: Record<string, string> = {
  menu: styles["menu"],
};

const pathArray = ["/", "/a", "/lighthouse", "/namelookup"];

const getIndex = () => {
  if (isServer()) {
    return -1;
  }
  const path = window.location.pathname;
  return pathArray.findIndex((item) => item === path);
}

export const Navigation: React.FC = _props => {
  React.useEffect(() => {
    const idx = getIndex();
    const menuItem = document.querySelector(`div.menu>a:nth-child(${idx + 1})`);
    menuItem?.classList.add("active");
    if (idx > 0) {
      const menuItem = document.querySelector("div.menu>a:nth-child(1)");
      menuItem?.classList.remove("active");
    }
  }, []);  // run once upon initial rendering

  const onClickHandler = () => perfStart("click");

  return (
    <nav className={cssStyle.menu}>
      <Menu
        vertical
        size="large"
        className="nav_menu"
        defaultActiveIndex={0}
      >
        <Menu.Item>
          <Menu.Header>First SPA</Menu.Header>
          <Menu.Menu>
            <Menu.Item
              header
              as={NavLink}
              exact to={pathArray[0]}
              onClick={onClickHandler}
            >
              Overview
              <Icon name="file alternate outline" size="large" />
            </Menu.Item>
            <Menu.Item
              header
              as={NavLink}
              to={pathArray[1]}
              onClick={onClickHandler}
            >
              ComponentA
              <Icon name="cube" size="large" />
            </Menu.Item>
            <Menu.Item
              header
              as={NavLink}
              to={pathArray[2]}
              onClick={onClickHandler}
            >
              Lighthouse
              <Icon name="tachometer alternate" size="large" />
            </Menu.Item>
            <Menu.Item
              header
              as={NavLink}
              to={pathArray[3]}
              onClick={onClickHandler}
            >
              NameLookup
              <Icon name="search" size="large" />
            </Menu.Item>
          </Menu.Menu>
        </Menu.Item>
        {SPAs.getNames().length > 1 && <Menu.Item>
          <Menu.Header>Second SPA</Menu.Header>
          <Menu.Menu>
            <Menu.Item href={`/${SPAs.getNames()[1]}`}>
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
