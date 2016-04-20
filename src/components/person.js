import React from "react";
import TextField from "material-ui/TextField"
import DatePicker from "material-ui/DatePicker"

export class Person extends React.Component {
  render() {
    return (
      <div>
        <TextField floatingLabelText="Name" />
        <DatePicker hintText="Move In Date" container="inline" autoOk={true} />
        <DatePicker hintText="Move Out Date" container="inline" autoOk={true} />
      </div>
    )
  }
}
