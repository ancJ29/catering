import cls from "classnames";
import React, { CSSProperties } from "react";
import classes from "./DivButton.module.scss";

type DivButtonProps = {
  disabled?: boolean;
  tabIndex?: number;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};
const DivButton = ({
  style,
  disabled,
  className,
  children,
  tabIndex = 0,
  onClick,
}: DivButtonProps) => {
  return (
    <div
      style={style}
      role="button"
      tabIndex={tabIndex}
      onKeyDown={() => {
        /**/
      }}
      className={cls(className, disabled ? "" : classes.container)}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  );
};
export default DivButton;
