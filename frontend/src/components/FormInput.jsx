import React from "react";

const FormInput = ({ setter, ...props }) => {
  // Every time the input is changed, set the new value and call the onChange function
  const handleChange = (e) => {
    if (setter) {
      setter(e.target.value);
    }
    if (props.onChange) {
      props.onChange(e.target.value);
    }
  };

  return (
    <div className={props.className}>
      <label htmlFor={props.name}>{props.name}</label>
      <input {...props} id={props.name} onChange={handleChange} />
    </div>
  );
};

export default FormInput;
