/**
 * Tests for Overview using React Testing Library
 * with Jest adaptors.
 */
import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Overview } from "../components/Overview";

describe("Testing Overview", () => {
  test("Basic tests", async () => {
    const { container, getByText, getAllByText } = render(
      <Router>
        {/* <Overview> uses <Link> that requires <Router> to be present */}
        <Overview />);
      </Router>
    );

    getByText(content => content.startsWith("The First SPA"));
    expect(getAllByText("ComponentA", { exact: true, selector: "code" })[0]).toBeVisible();
    expect(getAllByText("ComponentB", { exact: true, selector: "code" })[0]).toBeVisible();

    // Testing sample to show how to find a DOM element. In this case it's the menu header.
    // Selector to find Semantic UI menu header
    const cssSelector =
      // We enclosed <Menu> inside a <nav> so start searching DOM by finding the <nav>
      "nav " +
      // SUI <Menu> is rendered as a <div> with two classes:
      //    - the signature class 'ui', as any SUI component,
      //    - unsurprisingly the class 'menu' for <Menu>
      // and additionally the three classes we explicitly added to the <Menu>
      "div.ui.vertical.menu " +
      // Finally under <Menu> we have used <Menu.Item> followed by <Menu.Header>
      "div.item div.header";

    // Now find our menu header
    const element = container.querySelector(cssSelector);
    // and test its content
    expect(element).toHaveTextContent("First SPA");
  });
});
