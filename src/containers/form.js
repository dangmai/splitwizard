import React, { Component, PropTypes } from "react";
import PureInput from "../components/pureInput";
import DateInput from "../components/dateInput";
import Result from "./result";
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
    this.props.fields.bills.addField();
  }

  render() {
    const {
      fields: { people, bills },
      handleSubmit
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Result />
        <div>
          <button type="button" onClick={() => {
            people.addField();
          }}>Add Person</button>
          <button type="button" onClick={() => {
            bills.addField();
          }}>Add Bill</button>
        </div>
        {!people.length && <div>No People</div>}
        {people.map((person, index) => <div key={index}>
          <div>
            <label>Person #{index + 1}</label>
            {index != 0 && <button type="button" onClick={() => people.removeField(index)}>Remove Person</button>}
            <div>
              <PureInput type="text" placeholder="Person Name" field={person.name} />
              {person.name.touched && person.name.error && <div>{person.name.error}</div>}
            </div>
            <div>
              <DateInput placeholder="Move In Date" field={person.moveInDate} />
            </div>
            <div>
              <DateInput placeholder="Move Out Date" field={person.moveOutDate} />
            </div>
          </div>
        </div>
        )}
        {!bills.length && <div>No Bills</div>}
        {bills.map((bill, index) => <div key={index}>
          <div>
            <label>Bill #{index + 1}</label>
            {index != 0 && <button type="button" onClick={() => bills.removeField(index)}>Remove Bill</button>}
            <div>
              <PureInput type="text" placeholder="Bill Name" field={bill.name} />
              {bill.name.touched && bill.name.error && <div>{bill.name.error}</div>}
            </div>
            <div>
              <PureInput type="text" placeholder="Amount" field={bill.amount} />
              {bill.amount.touched && bill.amount.error && <div>{bill.amount.error}</div>}
            </div>
            <div>
              <DateInput placeholder="Start Date" field={bill.startDate} />
              {bill.startDate.touched && bill.startDate.error && <div>{bill.startDate.error}</div>}
            </div>
            <div>
              <DateInput placeholder="End Date" field={bill.endDate} />
              {bill.endDate.touched && bill.endDate.error && <div>{bill.endDate.error}</div>}
            </div>
          </div>
        </div>
        )}
        <button type="submit">Submit</button>
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