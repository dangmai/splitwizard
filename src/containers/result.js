import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { Person, Bill } from "../models";
import { calculate } from "../utils";

class Result extends Component {
  render() {
    return (
      <div>
        <ul>
        {this.props.result.map((result, index) => (
          <li key={index}>{result.name} owes {result.owedTotal}</li>
        ))}
        </ul>
      </div>
    );
  }
}

Result = connect(
  state => ({ result: state.result })
)(Result);

export default Result;