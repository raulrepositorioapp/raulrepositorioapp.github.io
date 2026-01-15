import React from "react";
import { Link } from "react-router-dom";

export default function CommonButton({
  children,
  className = "",
  onClick,
  type = "button",
  disabled,
  to,
  variant = "light",
  state,
  ...props
}) {
  const baseClasses = `
    ${className}
    ${variant === "fill" ? "bg-black text-white" : "bg-primary text-white"}
    inline-flex items-center gap-3 px-7 py-3 rounded-xl 
    text-lg hover:scale-101 transition-all cursor-pointer
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `;

  if (to) {
    return (
      <Link to={to} state={{ data: state }} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
