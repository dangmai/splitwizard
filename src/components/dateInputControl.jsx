import React, { PropTypes } from "react";

import InputControl from "./inputControl";
import DateInput from "./dateInput";

const DateInputControl = (props) => (
  <InputControl {...props}>
    <DateInput
      className="form-control"
      id={`for${props.uniqueKey}`}
      type="text"
      field={props.field}
    />
  </InputControl>
);

DateInputControl.propTypes = {
  field: PropTypes.object.isRequired,
  uniqueKey: PropTypes.number.isRequired,
};

export default DateInputControl;
