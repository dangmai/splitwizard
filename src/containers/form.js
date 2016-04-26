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
            <div>
              <PureInput type="text" placeholder="Person Name" field={person.name} />
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
            <div>
              <PureInput type="text" placeholder="Bill Name" field={bill.name} />
            </div>
            <div>
              <PureInput type="text" placeholder="Amount" field={bill.amount} />
            </div>
            <div>
              <DateInput type="text" placeholder="Start Date" field={bill.startDate} />
            </div>
            <div>
              <DateInput type="text" placeholder="End Date" field={bill.endDate} />
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
  },
)(Form);

export default Form;