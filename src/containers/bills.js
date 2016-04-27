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
            <div className="form-horizontal">
              <div className="col-md-8">
                <div className={"form-group " + (bill.name.touched && bill.name.error ? "has-error" : "")}>
                  <label className="col-md-3 control-label" htmlFor={"for" + index}>What For</label>
                  <div className="col-md-9">
                    <PureInput className="form-control" id={"for" + index} type="text" field={bill.name} />
                    {bill.name.touched && bill.name.error && <span className="help-block">{bill.name.error}</span>}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className={"form-group " + (bill.amount.touched && bill.amount.error ? "has-error" : "")}>
                  <label className="col-md-6 control-label" htmlFor={"amount" + index}>Total Due</label>
                  <div className="col-md-6">
                    <PureInput className="form-control" id={"amount" + index} type="text" field={bill.amount} />
                    {bill.amount.touched && bill.amount.error && <span className="help-block">{bill.amount.error}</span>}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={"form-group " + (bill.startDate.touched && bill.startDate.error ? "has-error" : "")}>
                  <label className="col-md-4 control-label" htmlFor={"start" + index}>Start Date</label>
                  <div className="col-md-8">
                    <DateInput className="form-control" id={"start" + index} field={bill.startDate} />
                    {bill.startDate.touched && bill.startDate.error && <span className="help-block">{bill.startDate.error}</span>}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className={"form-group " + (bill.endDate.touched && bill.endDate.error ? "has-error" : "")}>
                  <label className="col-md-4 control-label" htmlFor={"end" + index}>End Date</label>
                  <div className="col-md-8">
                    <DateInput className="form-control" id={"end" + index} field={bill.endDate} />
                    {bill.endDate.touched && bill.endDate.error && <span className="help-block">{bill.endDate.error}</span>}
                  </div>
                </div>
              </div>
            </div>
            {index != 0 && <button className="btn btn-link btn-block btn-remove" onClick={(e) => {
              e.preventDefault();
              bills.removeField(index);
            }}>Remove</button>}
            <div className="clearfix"></div>
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