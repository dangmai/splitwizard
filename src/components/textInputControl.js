import React from 'react';

import InputControl from "./inputControl";
import TextInput from "./textInput";

const TextInputControl = (props) => (
  <InputControl {...props}>
    <TextInput className="form-control" id={"for" + props.uniqueKey} type="text" field={props.field} />
  </InputControl>
);

export default TextInputControl;