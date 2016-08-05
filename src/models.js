import moment from "moment";
import { dateFormat } from "./utils";

// https://github.com/gf3/moment-range/issues/101
require("imports?define=>false!moment-range");


export const formName = "appForm";

/**
 * A class that represents a Person.
 * @param name the person's name
 * @param inDate the move in date
 * @param outDate the move out date
 */
export class Person {
  constructor(name, inDate, outDate) {
    this.name = name;

    if (inDate && typeof inDate === "string") {
      this.in = moment(inDate, dateFormat);
    } else if (inDate && typeof inDate === "object") {
      this.in = inDate;
    } else {
      this.in = moment("Jan 01, 1970", dateFormat);
    }
    if (outDate && typeof outDate === "string") {
      this.out = moment(outDate, dateFormat);
    } else if (outDate && typeof outDate === "object") {
      this.out = outDate;
    } else {
      this.out = moment("Dec 31, 3000", dateFormat);
    }
    this.range = moment().range(moment(this.in), moment(this.out));
  }

  toString() {
    return this.name;
  }
}

/**
 * A class that represents a Bill.
 * @param forVal what is this bill for?
 * @param total the amount of money due for this bill.
 * @param start the start date for the billing cycle.
 * @param end the end date for the billing cycle.
 */
export class Bill {
  constructor(forVal, total = 0, start, end) {
    this.for = forVal;
    this.total = Number(total);
    if (typeof start === "string") {
      this.start = moment(start, dateFormat);
    } else {
      this.start = start;
    }
    if (typeof end === "string") {
      this.end = moment(end, dateFormat);
    } else {
      this.end = end;
    }
    this.range = moment().range(this.start, this.end);
  }

  toString() {
    const startStr = this.start.format(dateFormat);
    const endStr = this.end.format(dateFormat);
    return `Bill for ${this.for} between ${startStr} and ${endStr}`;
  }
}

/**
 * We use this class to store a result line item, which references a bill and a
 * Num value.
 */
export class ResultLineItem {
  constructor(bill, value) {
    this.bill = bill;
    this.value = value;
  }

  getValueString() {
    return this.value.toFixed(2);
  }
}

/**
 * A Result object, containing references a Person and a list of ResultLineItem.
 */
export class Result {
  constructor(person) {
    this.person = person;
    this.lineItems = [];
    this.totalAmount = 0;
    this.detailsShown = false;
  }

  addLineItem(lineItem) {
    this.lineItems.push(lineItem);
    this.totalAmount += lineItem.value;
  }

  getTotalAmountString() {
    return this.totalAmount.toFixed(2);
  }

  toggleDetailsShown() {
    this.detailsShown = !this.detailsShown;
  }

  clone() {
    const newResult = new Result(this.person);
    newResult.detailsShown = this.detailsShown;
    this.lineItems.forEach(lineItem => {
      newResult.addLineItem(new ResultLineItem(lineItem.bill, lineItem.value));
    });
    return newResult;
  }
}
