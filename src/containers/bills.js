import React, { Component, PropTypes } from 'react';

import PureInput from "../components/pureInput";
import DateInput from "../components/dateInput";

class Bills extends Component {
  render() {
    const { bills } = this.props;
    return (
      <div className="col-md-6">
        <div className="category-title text-center">The Bills</div>
        <div className="bills">
          {bills.map((bill, index) => <div key={index} className="bill">
            <div className="form-group row">
              <label className="col-md-2" htmlFor={"for" + index}>What For</label>
              <div className="col-md-6">
                <PureInput className="form-control" id={"for" + index} type="text" field={bill.name} />
              </div>
              <label className="col-md-2" htmlFor={"amount" + index}>Total Due</label>
              <div className="col-md-2">
                <PureInput className="form-control" id={"amount" + index} type="text" field={bill.amount} />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-md-2" htmlFor={"start" + index}>Start Date</label>
              <div className="col-md-4">
                <DateInput className="form-control" id={"start" + index} field={bill.startDate} />
              </div>
              <label className="col-md-2" htmlFor={"end" + index}>End Date</label>
              <div className="col-md-4">
                <DateInput className="form-control" id={"end" + index} field={bill.endDate} />
              </div>
            </div>
            {index != 0 && <button className="btn btn-link btn-block btn-remove" onClick={(e) => {
              e.preventDefault();
              bills.removeField(index);
            }}>Remove</button>}
          </div>
          )}
        </div>
        <button className="btn btn-link btn-block" onClick={(e) => {
          e.preventDefault();
          bills.addField();
        }}>
          <span className="btn-icon">+</span> Add Another Bill
        </button>
      </div>
    );
  }
}

Bills.propTypes = {
  bills: PropTypes.array.isRequired,
}

export default Bills;