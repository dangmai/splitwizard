import React, { Component, PropTypes } from "react";
import moment from "moment";
import { reduxForm } from "redux-form";

import PureInput from "../components/pureInput";
import DateInput from "../components/dateInput";
import Welcome from "../components/welcome";
import Result from "./result";
import People from "./people";
import Bills from "./bills";
import { formName } from "../models"
import { calculate, clearResults } from "../actions/result";
import { dateFormat, deserializePeople } from "../utils";

const fields = [
  "people[].name",
  "people[].moveInDate",
  "people[].moveOutDate",
  "bills[].name",
  "bills[].amount",
  "bills[].startDate",
  "bills[].endDate"
];

// Return true if date is valid, false if invalid. Assuming that date is defined.
const validateDate = date => {
  if (date.isValid === undefined) {
    date = moment(date, dateFormat);
  }
  return date.isValid();
};

const validate = values => {
  const errors = {
    people: [],
    bills: []
  };
  errors.people = values.people.map(person => {
    const errs = {};
    if (!person.name) {
      errs.name = "Required";
    }
    if (person.moveInDate && !validateDate(person.moveInDate)) {
      errs.moveInDate = "Invalid Date";
    }
    if (person.moveOutDate && !validateDate(person.moveOutDate)) {
      errs.moveOutDate = "Invalid Date";
    }
    return errs;
  });

  errors.bills = values.bills.map(bill => {
    const errs = {};
    if (!bill.name) {
      errs.name = "Required";
    }
    if (!bill.amount) {
      errs.amount = "Required";
    } else if (isNaN(Number(bill.amount))) {
      errs.amount = "Invalid Number";
    }
    if (!bill.startDate) {
      errs.startDate = "Required";
    } else if (!validateDate(bill.startDate)) {
      errs.startDate = "Invalid Date";
    }
    if (!bill.endDate) {
      errs.endDate = "Required";
    } else if (!validateDate(bill.endDate)) {
      errs.endDate = "Invalid Date";
    }
    return errs;
  });
  return errors;
};

class Form extends Component {
  componentWillMount() {
    const people = deserializePeople();
    if (people) {
      people.forEach(person => {
        this.props.fields.people.addField({
          name: person.name.value,
          moveInDate: person.moveInDate.value,
          moveOutDate: person.moveOutDate.value
        });
      });
    } else {
      this.props.fields.people.addField();
      this.props.fields.people.addField();
    }
    this.props.fields.bills.addField();
  }

  render() {
    const {
      fields: { people, bills },
      handleSubmit
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Welcome />
        <Result />
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <People people={people} />
              <Bills bills={bills} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button className="btn btn-success btn-large center-block" type="submit">Thou Shall Split!</button>
          </div>
        </div>
      </form>
    );
  }
}

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

Form = reduxForm(
  {
    form: formName,
    fields,
    validate,
  },
)(Form);

export default Form;