/**
 * Tests for ComponentC using React Testing Library
 * with Jest adaptors.
 */
import * as React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ComponentB } from "../components/ComponentB";

describe("Testing ComponentB", () => {
  test("Basic tests", async () => {
    const { getByText, queryByText } = render(<ComponentB />);

    expect(getByText("Second", { exact: false, selector: "code" })).toBeVisible();
    expect(getByText("ComponentB", { exact: true, selector: "code" })).toBeInTheDocument();
    expect(queryByText("ComponentA", { exact: true, selector: "code" })).toBeNull();
  });
});
