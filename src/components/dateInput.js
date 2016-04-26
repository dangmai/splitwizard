import React, { Component, PropTypes } from "react";
import DatePicker from "react-datepicker";
require('react-datepicker/dist/react-datepicker.css');
import moment from "moment";

import { dateFormat } from "../utils";

export default class DateInput extends Component {
  shouldComponentUpdate(nextProps) {
    //return this.props.field !== nextProps.field;
    return true;
  }

  render() {
    const { field, placeholder, ...rest } = this.props;
    return (
      <DatePicker
        selected={field.value ? moment(field.value) : null}
        placeholderText={placeholder}
        dateFormat={dateFormat} {...field}
        {...rest} />)
  }
}

DateInput.propTypes = {
  field: PropTypes.object.isRequired,
}
