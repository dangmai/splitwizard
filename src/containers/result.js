import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";

import { toggleDetailedResult, completeSave } from "../actions/result";
import { formName } from "../models";
import { dateFormat, serializePeople } from "../utils";

class Result extends Component {
  shouldComponentUpdate(nextProps) {
    return (this.props.result !== nextProps.result ||
      this.props.saveCompleted !== nextProps.saveCompleted);
  }

  handleSaveClick(e) {
    e.preventDefault();
    serializePeople(this.props.people);
    this.props.completeSave();
  }

  render() {
    if (this.props.result.length === 0) {
      return null;
    }
    return (
      <div className="result text-center row">
        {this.props.result.map((result, index) => (
          <div key={`result${index}`} className="result-person">
            {result.person.name} owes {result.getTotalAmountString()}{" "}
            <a
              href="#"
              className="result-details"
              onClick={
                (e) => {
                  e.preventDefault();
                  this.props.onResultClick(index);
                }
              }
            >
              <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
            </a>
            {result.detailsShown && <div>
              {result.lineItems.map((lineItem, idx) => (
                <div key={`lineItem${idx}`}>
                  {lineItem.getValueString()} for {lineItem.bill.name}{" "}
                  between {lineItem.bill.start.format(dateFormat)} and{" "}
                  {lineItem.bill.end.format(dateFormat)}
                </div>
              ))}
            </div>}
          </div>
        ))}
        <p>
          The journey doesn't end here.{" "}
          <a href="#" onClick={(e) => this.handleSaveClick(e)}>Save</a>{" "}
          the Mortal Men so you don't have to enter them next time.{" "}
          {this.props.saveCompleted &&
            <span className="save-completed glyphicon glyphicon-ok" aria-hidden="true"></span>
          }
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  result: state.result,
  saveCompleted: state.saveCompleted,
  people: state.form[formName].people,
});
const mapDispatchToProps = dispatch => ({
  onResultClick: (index) => dispatch(toggleDetailedResult(index)),
  completeSave: () => dispatch(completeSave()),
});

Result.propTypes = {
  result: PropTypes.array.isRequired,
  saveCompleted: PropTypes.bool.isRequired,
  people: PropTypes.array.isRequired,
  onResultClick: PropTypes.func.isRequired,
  completeSave: PropTypes.func.isRequired,
};

Result = connect(
  mapStateToProps,
  mapDispatchToProps
)(Result);

export default Result;
