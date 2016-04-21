import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import math from "mathjs";

import { Person, Bill } from "../models";

class Result extends Component {
  render() {

  }
}

const calculateResult = (people, bills) => {
  people = people.map((person) => {
    return new Person(person.name, person.moveInDate, person.moveOutDate);
  });
  bills = bills.map((bill) => {
    return new Bill(bill.name, bill.amount, bill.startDate, bill.endDate);
  });
};

Result = connect(
  state => calculateResult(state.form.appForm.people, state.form.appForm.bills)
)(Result);
export default Result;