/**
 * BaseComponent is a reusable component.
 * It uses CSS flexbox for rendering of subcomponents
 * passed by the parent component. If there is enough
 * space the subcomponents are displayed from the left
 * to the right, otherwise the subcomponents are stacked
 * up one on top of the other.
 */
import * as React from "react";
import { style, cssRaw } from "typestyle";

// CSS used by the parent component
cssRaw(`
  code {
    font-size: 0.9em;
    font-family: monospace;
    white-space: pre;
  }
`);

// CSS for flexbox
const cssStyle: Record<string, string> = {
  container: style({
    display: "flex",
    flexFlow: "row wrap"
  }),

  left: style({
    flex: "initial",
    marginBottom: "1rem",
    marginLeft: "2rem"
  }),

  right: style({
    flex: "auto"
  }),
};

interface IBaseComponent {
  leftComponent: React.ReactType;
  rightComponent: React.ReactType;
}

export const BaseComponent: React.FC<IBaseComponent> = props => {
  const LeftComponent = props.leftComponent;
  const RightComponent = props.rightComponent;

  return (
    <main className={cssStyle.container}>
      <div className={cssStyle.left}>
        <LeftComponent />
      </div>
      <div className={cssStyle.right}>
        <RightComponent />
      </div>
    </main>
  );
};
