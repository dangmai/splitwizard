
import moment from "moment";
// https://github.com/gf3/moment-range/issues/101
require("imports?define=>false!moment-range");
import { dateFormat } from "./utils"

/**
 * A class that represents a Person.
 * @param name the person's name
 * @param inDate the move in date
 * @param outDate the move out date
 */
export function Person(name, inDate, outDate) {
  this.name = name;
  this.owedLineItems = [];
  this.owedTotal = 0;

  if (inDate && typeof inDate === 'string') {
    this.in = moment(inDate, dateFormat);
  } else if (inDate && typeof inDate === 'object') {
    this.in = inDate;
  } else {
    this.in = moment("Jan 01, 1970", dateFormat);
  }
  if (outDate && typeof outDate === 'string') {
    this.out = moment(outDate, dateFormat);
  } else if (outDate && typeof outDate === 'object') {
    this.out = outDate;
  } else {
    this.out = moment("Dec 31, 3000", dateFormat);
  }
  this.range = moment().range(moment(this.in), moment(this.out));
}

Person.prototype.toString = function() {
  return this.name;
};

Person.prototype.addAmountLineItem = function (bill, amount) {
  this.owedLineItems.push({
    bill: bill,
    amount: amount,
  });
  this.owedTotal += amount;
}

/**
 * An extremely simple clone for a person. Any attributes that are
 * not default to a Person object (name, in, out) will NOT be
 * cloned!
 * @return a cloned Person object
 */
Person.prototype.clone = function() {
  return new Person(this.name, this.in, this.out);
};

/**
 * A class that represents a Bill.
 * @param forVal what is this bill for?
 * @param total the amount of money due for this bill.
 * @param start the start date for the billing cycle.
 * @param end the end date for the billing cycle.
 */
export function Bill(forVal, total, start, end) {
  this.for = forVal;
  this.total = total;
  if (typeof start === 'string') {
    this.start = moment(start, dateFormat);
  } else {
    this.start = start;
  }
  if (typeof end === 'string') {
    this.end = moment(end, dateFormat);
  } else {
    this.end = end;
  }
}

Bill.prototype.toString = function() {
  const startStr = this.start.format(dateFormat);
  const endStr = this.end.format(dateFormat);
  return "Bill for " + this.for + " between " + startStr + " and" + endStr;
};

/**
 * An extremely simple clone() for a Bill object; any attribute(s)
 * that are not default to a Bill (for, total, start, end) will NOT
 * be cloned.
 * @return a cloned Bill object.
 */
Bill.prototype.clone = function() {
  return new Bill(this['for'], this.total, this.start, this.end);
};