import React from "react";

const Button = ({ onClick, label, disabled = false, type = "button" }) => {
  return (
    <button onClick={onClick} disabled={disabled} type={type}>
      {label}
    </button>
  );
};

export default Button;
