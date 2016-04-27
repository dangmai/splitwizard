import React, { Component, PropTypes } from "react";
import PureInput from "../components/pureInput";
import DateInput from "../components/dateInput";
import Result from "./result";
import People from "./people";
import Bills from "./bills";
import Welcome from "../components/welcome";
import { calculate } from "../actions/result";
import { reduxForm } from "redux-form";

export const fields = [
  "people[].name",
  "people[].moveInDate",
  "people[].moveOutDate",
  "bills[].name",
  "bills[].amount",
  "bills[].startDate",
  "bills[].endDate"
];
export const formName = "appForm";

const validate = values => {
  const errors = {
    people: [],
    bills: []
  };
  errors.people = values.people.map(person => {
    if (!person.name) {
      return { name: "Name is required" };
    }
    return {};
  });

  errors.bills = values.bills.map(bill => {
    const errs = {};
    if (!bill.name) {
      errs.name = "Name is required";
    }
    if (!bill.amount) {
      errs.amount = "Amount is required";
    }
    if (!bill.startDate) {
      errs.startDate = "Start Date is required";
    } else if (!bill.startDate.isValid()) {
      errs.startDate = "Start Date is invalid";
    }
    if (!bill.endDate) {
      errs.endDate = "End Date is required";
    } else if (!bill.endDate.isValid()) {
      errs.endDate = "End Date is invalid";
    }
    return errs;
  });
  return errors;
};

class Form extends Component {
  componentWillMount() {
    this.props.fields.people.addField();
    this.props.fields.people.addField();
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
  fields: PropTypes.object.isRequired,
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