/**
 * Tests for ComponentC using React Testing Library
 * with Jest adaptors.
 */
import * as React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ComponentC } from "../components/ComponentC";

describe("Testing ComponentC", () => {
  test("Basic tests", async () => {
    const { getByText, queryByText } = render(<ComponentC />);

    expect(getByText("Second", { exact: false, selector: "code" })).toBeVisible();
    expect(getByText("ComponentC", { exact: true, selector: "code" })).toBeInTheDocument();
    expect(queryByText("ComponentA", { exact: true, selector: "code" })).toBeNull();
  });
});
