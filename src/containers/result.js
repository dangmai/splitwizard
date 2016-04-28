import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { store } from "../reducers/index";
import { toggleDetailedResult, completeSave } from "../actions/result";
import { Person, Bill, formName } from "../models";
import { calculate, dateFormat, serializePeople } from "../utils";

class Result extends Component {
  handleSaveClick(e) {
    e.preventDefault();
    serializePeople(this.props.people);
    store.dispatch(completeSave());
  }

  shouldComponentUpdate(nextProps) {
    return this.props.result !== nextProps.result || this.props.saveCompleted !== nextProps.saveCompleted;
  }

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
        <p>
          The journey doesn't end here.{" "}
          <a href="#" onClick={(e) => this.handleSaveClick(e)}>Save</a>{" "}
          the Mortal Men so you don't have to enter them next time.{" "}
          {this.props.saveCompleted && <span className="save-completed glyphicon glyphicon-ok" aria-hidden="true"></span>}
        </p>
      </div>
    );
  }
}

Result = connect(
  state => ({ result: state.result, saveCompleted: state.saveCompleted, people: state.form[formName].people })
)(Result);

export default Result;