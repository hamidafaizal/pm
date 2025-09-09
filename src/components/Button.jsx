// src/components/Button.jsx
import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SIZE_MAP = {
  sm: "btn-glass--sm",
  md: "",
  lg: "btn-glass--lg",
  icon: "btn-glass--icon",
};

export default function Button({
  children,
  icon,
  reveal = false,
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const sizeClass = SIZE_MAP[size] || "";
  const revealClass = reveal ? "btn-reveal" : "";
  const classes = cn("btn-glass", sizeClass, revealClass, className);

  const ariaLabel = props["aria-label"] || (typeof children === "string" ? children : undefined);

  return (
    <button type={type} className={classes} aria-label={ariaLabel} {...props}>
      {reveal ? (
        <>
          <span className="btn-reveal__icon text-lg leading-none">{icon ?? "+"}</span>
          <span className="btn-reveal__label">{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="text-lg leading-none">{icon}</span>}
          {children && <span className={icon ? "ml-2" : ""}>{children}</span>}
        </>
      )}
    </button>
  );
}
