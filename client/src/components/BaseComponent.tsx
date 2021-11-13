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
import styles from "../css/base-component.module.css";
import { perfEnd } from "../utils/misc";

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

  React.useEffect(() => {
    perfEnd();
  }, []);

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
