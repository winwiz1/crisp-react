/**
 * Tests for ComponentA using React Testing Library
 * with Jest adaptors.
 */
import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ComponentA } from "../components/ComponentA";

describe("Testing ComponentA", () => {
  test("Basic tests", async () => {
    const { getByText, getAllByText, queryByText } = render(
      <Router>
        {/* <ComponentA> uses <Link> that requires <Router> to be present */}
        <ComponentA />);
      </Router>
    );

    expect(getByText("First", { exact: false, selector: "code" })).toBeVisible();
    expect(getAllByText("ComponentA", { exact: true, selector: "code" })[0]).toBeInTheDocument();
    expect(queryByText("ComponentC", { exact: true, selector: "code" })).toBeNull();
  });
});
