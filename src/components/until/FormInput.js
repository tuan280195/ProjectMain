// import { useState } from "react";

const FormInput = (props) => {
  const { label, onChange, children, ...inputProps } = props;
  return (
    <div className="section-item">
      <label className="section-label">
        {label}
        {props.isRequired ? <span className="required-icon"> *</span> : null}
      </label>
      <input {...inputProps} onChange={onChange} />
      {children}
    </div>
  );
};

export default FormInput;
