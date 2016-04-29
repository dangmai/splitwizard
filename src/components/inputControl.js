import React from 'react';

const InputControl = ({
  field,
  label,
  uniqueKey,
  controlClassName,
  labelClassName,
  inputClassName,
  showHelpBlock,
  children
}) => (
  <div className={controlClassName}>
    <div className={"form-group " + (field.touched && field.error ? "has-error" : "")}>
      <label className={labelClassName + " control-label"} htmlFor={"for" + uniqueKey}>{label}</label>
      <div className={inputClassName}>
        {children}
        {showHelpBlock && field.touched && field.error && <span className="help-block">{field.error}</span>}
      </div>
    </div>
  </div>
);

export default InputControl;