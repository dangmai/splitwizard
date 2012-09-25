/*global define*/
(function () {
    "use strict";
    define(['jquery'], function ($) {
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
            $.each(this.people, function (index, person) {
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

        return Day;
    });
}());