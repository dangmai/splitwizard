import React, { Component, PropTypes } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import { dateFormat } from "../utils";

export default class DateInput extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.field !== nextProps.field;
  }

  render() {
    const { field, ...rest } = this.props;

    const handleChange = (param) => {
      // We do this so that in the Redux store, the date fields are always
      // represented as String, so that it's more consistent across browsers.
      // This fixes an issue in which Firefox and Chrome handle events
      // differently - Firefox doesn't fire Blue event on the Date Picker
      // while Chrome does. The bug manifests in that the Redux store would
      // have Moment objects for the date fields in Firefox, and Strings
      // for the date fields in Chrome.
      field.onChange(param ? param.format(dateFormat) : null);
    };

    return (
      <DatePicker
        selected={field.value ? moment(field.value, dateFormat) : null}
        dateFormat={dateFormat}
        {...field}
        {...rest}
        onChange={handleChange}
      />
    );
  }
}

DateInput.propTypes = {
  field: PropTypes.object.isRequired,
};
