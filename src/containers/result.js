import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { store } from "../reducers/index";
import { toggleDetailedResult } from "../actions/result";
import { Person, Bill } from "../models";
import { calculate, dateFormat } from "../utils";

class Result extends Component {
  render() {
    if (this.props.result.length === 0) {
      return null;
    }
    return (
      <div className="result text-center row">
        {this.props.result.map((result, index) => (
          <div key={"result" + index} className="result-person">
            {result.person.name} owes {result.getTotalAmountString()} <a href="#" className="result-details" onClick={(e) => {
              e.preventDefault();
              store.dispatch(toggleDetailedResult(index));
            }}>
              <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> 
            </a>
            {result.detailsShown && <div>
              {result.lineItems.map((lineItem, idx) => (
                <div key={"lineItem" + idx}>{lineItem.getValueString()} for {lineItem.bill.name} between {lineItem.bill.start.format(dateFormat)} and {lineItem.bill.end.format(dateFormat)}</div>
              ))}
            </div>}
          </div>
        ))}
      </div>
    );
  }
}

Result = connect(
  state => ({ result: state.result })
)(Result);

export default Result;