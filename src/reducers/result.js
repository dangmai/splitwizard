import { Person, Bill } from "../models";
import { calculate } from "../utils";

export default function (state = [], action) {
  switch (action.type) {
    case "CALCULATE":
      return calculate(
        action.bills.map(bill => new Bill(bill.name, bill.amount, bill.startDate, bill.endDate)),
        action.people.map(person => new Person(person.name, person.moveInDate, person.moveOutDate))
      );
    case "CLEAR_RESULTS":
      return [];
    case "TOGGLE_DETAILED_RESULT": {
      const clonedResult = state[action.index].clone();
      clonedResult.toggleDetailsShown();
      return [
        ...state.slice(0, action.index),
        clonedResult,
        ...state.slice(action.index + 1),
      ];
    }
    default:
      return state;
  }
}
