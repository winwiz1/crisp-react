/**
 * Tests for ComponentB using React Testing Library
 * with Jest adaptors.
 */
import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Lighthouse } from "../components/Lighthouse";

describe("Testing Lighthouse component", () => {
  test("Basic tests", async () => {
    const { getByText, getAllByText, queryByText } = render(
      <Router>
        <Lighthouse />);
      </Router>
    );

    expect(getByText("Measure", { exact: false, selector: "a" })).toBeVisible();
    getAllByText("Lighthouse", { exact: true }).forEach(element =>
      expect(element).toBeVisible());
    getAllByText("Lighthouse", { exact: false, selector: "h3" }).forEach(element =>
        expect(element).toBeVisible());
    expect(queryByText("ComponentA", { exact: true, selector: "code" })).toBeNull();
  });
});
