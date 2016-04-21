"use strict";

import moment from "moment";

export const validateDate = (date) => {
  return moment(date).isValid();
}

export const dateFormat = "MMM DD, YYYY";

export const calculate = (bills, people) => {
  const result = people.map(person => person.clone());
  bills.forEach(bill => {
    const billRange = moment().range(bill.start, bill.end);
    const unitsOfConsumption = people.map(
      person => billRange.intersect(person.range).toArray("days").length
    );
    const totalUnitsOfConsumption = unitsOfConsumption.reduce(
      (total, units) => total + units,
      0
    );
    unitsOfConsumption.forEach((units, index) => {
      result[index].addAmountLineItem(bill, (units/totalUnitsOfConsumption) * bill.total);
    });
  });
  return result;
};