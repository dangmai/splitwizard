/*global define*/
(function () {
    "use strict";

    define(['app/split', 'app/util', 'moment-range', 'underscore'],
        function (split, util, moment, _) {
            /**
             * A class that represents a Person.
             * @param name the person's name
             * @param inDate the move in date
             * @param outDate the move out date
             */
            function Person(name, inDate, outDate) {
                this.name = name;
                if (inDate && typeof inDate === 'string') {
                    this['in'] = moment(inDate, util.dateFormat);
                } else if (inDate && typeof inDate === 'object') {
                    this['in'] = inDate;
                } else {
                    this['in'] = moment("Jan 01, 1970", util.dateFormat);
                }
                if (outDate && typeof outDate === 'string') {
                    this.out = moment(outDate, util.dateFormat);
                } else if (outDate && typeof outDate === 'object') {
                    this.out = outDate;
                } else {
                    this.out = moment("Dec 31, 3000", util.dateFormat);
                }
            }

            Person.prototype.toString = function () {
                return this.name;
            };

            /**
             * An extremely simple clone for a person. Any attributes that are
             * not default to a Person object (name, in, out) will NOT be
             * cloned!
             * @return a cloned Person object
             */
            Person.prototype.clone = function () {
                return new Person(this.name, this['in'], this.out);
            };

            /**
             * A class that represents a Bill.
             * @param forVal what is this bill for?
             * @param total the amount of money due for this bill.
             * @param start the start date for the billing cycle.
             * @param end the end date for the billing cycle.
             */
            function Bill(forVal, total, start, end) {
                this["for"] = forVal;
                this.total = total;
                if (typeof start === 'string') {
                    this.start = moment(start, util.dateFormat);
                } else {
                    this.start = start;
                }
                if (typeof end === 'string') {
                    this.end = moment(end, util.dateFormat);
                } else {
                    this.end = end;
                }
            }

            Bill.prototype.toString = function () {
                var startStr = this.start.format(util.dateFormat),
                    endStr = this.end.format(util.dateFormat),
                    returnStr = "Bill for " + this["for"];
                returnStr += "between " + startStr + " and" + endStr;
                return returnStr;
            };

            /**
             * An extremely simple clone() for a Bill object; any attribute(s)
             * that are not default to a Bill (for, total, start, end) will NOT
             * be cloned.
             * @return a cloned Bill object.
             */
            Bill.prototype.clone = function () {
                return new Bill(this['for'], this.total, this.start, this.end);
            };

            /**
             * A class to represent a day in the billing cycle of a particular bill.
             * @param (moment) date the date of this day.
             * @param (int) billIndex the index of this bill in the bills array.
             */
            function Day(date, billIndex) {
                this.date = date;
                this.billIndex = billIndex;
                this.people = [];
            }

            Day.prototype.toString = function () {
                return this.date.toString();
            };

            /**
             * Add a person who is present on this day.
             * @param (object) person the person object.
             */
            Day.prototype.addPerson = function (person) {
                this.people.push(person);
            };

            /**
             * Announces to this object how much it is worth in the billing
             * cycle. Calling this automatically distribute this amount of
             * money evenly towards the people who are present on this day.
             * @param moneyAmt how much this day is worth in the billing cycle.
             */
            Day.prototype.worths = function (moneyAmt) {
                var eachPersonOwes = moneyAmt / this.people.length,
                    that = this;
                _.each(this.people, function (person, index) {
                    person.owes[that.billIndex] += eachPersonOwes;
                });
            };

            /**
             * Helper method to get the number of present people on this day.
             * @return (int) the number of present people.
             */
            Day.prototype.numPeople = function () {
                return this.people.length;
            };

            return {
                Person: Person,
                Bill: Bill,
                Day: Day
            };
        });
}());