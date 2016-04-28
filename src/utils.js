"use strict";

import moment from "moment";
import cookies from "js-cookie";
import { Result, ResultLineItem } from "./models";

export const dateFormat = "MMM DD, YYYY";

// Take in a list of people from the Form state, and save it to a cookie
export const serializePeople = (people) => {
  cookies.set("people", people, { expires: 365 });
}

export const deserializePeople = () => {
  const people = cookies.get("people");
  if (people) {
    return JSON.parse(people);
  }
};

/**
 * This function takes in a list of Bills and a list of People,
 * and calculate how much each Person owes
 * It makes the assumption that everyone consumes the same amount of utility.
 * From this assumption, the number of consumption units can be calculated for
 * each person in the bill cycle. For example: if Person 1 are in 30 days of
 * the bill cycle, and Person 2 are in 15 days; it'd stand to reason that
 * Person 1 uses 30 units of consumption, whereas Person uses 15. Based on
 * these numbers, we can calculate the ratio that Person 1 and Person 2
 * should pay for the bill - in the earlier example, Person 1 should pay
 * 30/(30+15) percent of the bill, while Person 2 should pay 15/(30+15)
 * percent of the bill.
 * In the event that no one is present for a bill period, they should not have
 * to pay anything for that bill. However, if one of them is present during
 * any period of the bill (even 1 day), they'll have to be responsible for the
 * whole bill.

 * @param bills a list of Bill objects
 * @param people a list of Person objects
 * @returns a list of People objects, with their owedTotal and owedLineItems
 * values populated
 */
export const calculate = (bills, people) => {
  const results = people.map(person => new Result(person));

  bills.forEach(bill => {
    const unitsOfConsumption = people.map(
      person => {
        const intersection = bill.range.intersect(person.range);
        return intersection ? intersection.toArray("days").length : 0;
      }
    );

    const totalUnitsOfConsumption = unitsOfConsumption.reduce(
      (total, units) => total + units,
      0
    );

    unitsOfConsumption.forEach((units, index) => {
      const ratio = totalUnitsOfConsumption != 0 ? units/totalUnitsOfConsumption : 0;
      results[index].addLineItem(
        new ResultLineItem(bill, ratio * bill.total)
      );
    });
  });

  return results;
};