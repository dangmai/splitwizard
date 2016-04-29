import React from 'react';

import InputControl from "./inputControl";
import DateInput from "./dateInput";

const DateInputControl = (props) => (
  <InputControl {...props}>
    <DateInput className="form-control" id={"for" + props.uniqueKey} type="text" field={props.field} />
  </InputControl>
);

export default DateInputControl;