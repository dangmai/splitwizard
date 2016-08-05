import React, { PropTypes } from "react";

import DateInputControl from "../components/dateInputControl";
import TextInputControl from "../components/textInputControl";

const Bills = ({ bills }) => (
  <div className="col-md-6">
    <div className="category-title text-center">The Bills</div>
    <div className="bills">
      {bills.map((bill, index) => <div key={index} className="bill">
        <div className="form-horizontal">
          <TextInputControl
            field={bill.name} label="What For" uniqueKey={index}
            controlClassName="col-md-8" labelClassName="col-md-3"
            inputClassName="col-md-9" showHelpBlock
          />
          <TextInputControl
            field={bill.amount} label="Total Due" uniqueKey={index}
            controlClassName="col-md-4" labelClassName="col-md-6"
            inputClassName="col-md-6" showHelpBlock
          />
          <DateInputControl
            field={bill.startDate} label="Start Date" uniqueKey={index}
            controlClassName="col-md-6" labelClassName="col-md-4"
            inputClassName="col-md-8" showHelpBlock
          />
          <DateInputControl
            field={bill.endDate} label="End Date" uniqueKey={index}
            controlClassName="col-md-6" labelClassName="col-md-4"
            inputClassName="col-md-8" showHelpBlock
          />
        </div>
        {index !== 0 &&
          <button
            className="btn btn-link btn-block btn-remove"
            onClick={(e) => {
              e.preventDefault();
              bills.removeField(index);
            }}
          >Remove</button>
        }
        <div className="clearfix"></div>
      </div>
      )}
    </div>
    <button
      className="btn btn-link btn-block"
      onClick={(e) => {
        e.preventDefault();
        bills.addField();
      }}
    >
      <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add Another Bill
    </button>
  </div>
);

Bills.propTypes = {
  bills: PropTypes.array.isRequired,
};

export default Bills;
