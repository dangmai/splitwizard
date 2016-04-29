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
    return (
      <DatePicker
        selected={field.value ? moment(field.value, dateFormat) : null}
        dateFormat={dateFormat}
        {...field}
        {...rest}
      />
    );
  }
}

DateInput.propTypes = {
  field: PropTypes.object.isRequired,
};
