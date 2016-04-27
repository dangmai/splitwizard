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
            <div className="row">
              <div className="col-md-8 form-inline">
                <div className="control-group">
                  <label htmlFor={"for" + index} className="col-md-2">What For</label>
                  <div className="controls">
                    <PureInput className="col-md-6 required" id={"for" + index} type="text" field={bill.name} />
                  </div>
                </div>
              </div>
              <div className="col-md-4 form-inline">
                <div className="control-group">
                  <label htmlFor={"amount" + index} className="col-md-2">Total Due</label>
                  <div className="controls">
                    <PureInput className="col-md-3 required" id={"amount" + index} type="text" field={bill.amount} />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-inline">
                <div className="control-group">
                  <label htmlFor={"start" + index} className="col-md-4">Start Date</label>
                  <div className="controls">
                    <DateInput className="col-md-8 required" id={"start" + index} field={bill.startDate} />
                  </div>
                </div>
              </div>
              <div className="col-md-6 form-inline">
                <div className="control-group">
                  <label htmlFor={"end" + index} className="col-md-4">End Date</label>
                  <div className="controls">
                    <DateInput className="col-md-8 required" id={"end" + index} field={bill.endDate} />
                  </div>
                </div>
              </div>
            </div>
            {index != 0 && <a className="remove text-center" onClick={(e) => {
              e.preventDefault();
              bills.removeField(index);
            }}>Remove</a>}
          </div>
          )}
        </div>
        <a href="#" id="more-bills" onClick={(e) => {
          e.preventDefault();
          bills.addField();
        }}>
          <i className="icon-plus"></i> Add Another Bill
        </a>
      </div>
    );
  }
}

Bills.propTypes = {
  bills: PropTypes.array.isRequired,
}

export default Bills;