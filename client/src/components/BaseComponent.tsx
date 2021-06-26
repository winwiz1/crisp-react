/**
 * BaseComponent uses CSS flexbox to render
 * subcomponents.
 * 
 * The subcomponents (left and right) are passed
 * as React props by the parent component.
 * 
 * If there is enough space, the subcomponents are
 * displayed from left to right, otherwise the
 * subcomponents are stacked up one on top of the
 * other.
 **/
import * as React from "react";

/**
 * If css-loader has option 'modules: false' in both
 * webpack.config.* files, then the import can be
 * done using
 *   import "../css/base-component.css";
 * in which case change the 'cssStyle' below:
 *   container: "component_container",
 * and so forth. This approach uses unmangled names
 * of CSS class selectors and comes with burden to
 * ensure the names are unique.
 **/
import styles from "../css/base-component.css";

const cssStyle: Record<string, string> = {
  container: styles["component_container"],
  left: styles["left_component"],
  right: styles["right_component"],
};

interface IBaseComponent {
  leftComponent: React.ElementType;
  rightComponent: React.ElementType;
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
