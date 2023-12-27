import { useState } from "react";

const FormInput = (props) => {
  const { label, onChange, ...inputProps } = props;
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  return (
    <div className="section-item">
      <label className="section-label">
        {label}
        {props.required ? <span className="required-icon"> *</span> : null}
      </label>
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        focused={focused.toString()}
      />
    </div>
  );
};

export default FormInput;
