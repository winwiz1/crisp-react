/**
 * Tests for ComponentB using React Testing Library
 * with Jest adaptors.
 */
import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ComponentB } from "../components/ComponentB";

describe("Testing ComponentB", () => {
  test("Basic tests", async () => {
    const { getByText, getAllByText, queryByText } = render(
      <Router>
        <ComponentB />);
      </Router>
    );

    expect(getByText("First", { exact: false, selector: "code" })).toBeVisible();
    getAllByText("ComponentB", { exact: true, selector: "code" }).forEach(element =>
      expect(element).toBeVisible());
    expect(queryByText("ComponentA", { exact: true, selector: "code" })).toBeNull();
  });
});
