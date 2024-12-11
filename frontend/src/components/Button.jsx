import React from "react";
import PropTypes from "prop-types";

const Button = ({ onClick, label, disabled = false, type = "button" }) => {
  return (
    <button onClick={onClick} disabled={disabled} type={type}>
      {label}
    </button>
  );
};

export default Button;
