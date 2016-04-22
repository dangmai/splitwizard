import { Person, Bill } from "../models";
import { calculate } from "../utils";

export function result(state=[], action) {
  switch (action.type) {
    case "CALCULATE":
      return calculate(
        action.bills.map(bill => new Bill(bill.name, bill.amount, bill.startDate, bill.endDate)),
        action.people.map(person => new Person(person.name, person.moveInDate, person.moveOutDate))
      );
    default:
      return state;
  }
}