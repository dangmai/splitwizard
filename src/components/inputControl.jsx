import React, { PropTypes } from "react";

const InputControl = ({
  field,
  label,
  uniqueKey,
  controlClassName,
  labelClassName,
  inputClassName,
  showHelpBlock,
  children,
}) => (
  <div className={controlClassName}>
    <div className={`form-group ${(field.touched && field.error ? "has-error" : "")}`}>
      <label
        className={`${labelClassName} control-label`}
        htmlFor={`for${uniqueKey}`}
      >{label}</label>
      <div className={inputClassName}>
        {children}
        {showHelpBlock && field.touched && field.error &&
          <span className="help-block">
            {field.error}
          </span>
        }
      </div>
    </div>
  </div>
);

InputControl.propTypes = {
  field: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  uniqueKey: PropTypes.number.isRequired,
  controlClassName: PropTypes.string.isRequired,
  labelClassName: PropTypes.string.isRequired,
  inputClassName: PropTypes.string.isRequired,
  showHelpBlock: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};

export default InputControl;
