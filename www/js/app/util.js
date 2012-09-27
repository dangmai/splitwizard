/*global define, requirejs*/
(function () {
    "use strict";

    define(['app/model', 'moment'], function (model, moment) {
        return {
            dateFormat: "MMM DD, YYYY",

            /**
             * Helper method to validate a date string.
             * @param dateStr the date string to validate.
             * @return whether the date string is a valid date.
             */
            validateDate: function (dateStr) {
                return moment(dateStr).isValid();
            },

            /**
             * Method to revive the bills from a JSON object.
             * @param k key
             * @param v value
             */
            billsReviver: function (k, v) {
                if (v.hasOwnProperty("start") && v.hasOwnProperty("end")) {
                    // Circular dependencies, so this is necessary
                    var Bill = requirejs('app/model').Bill;
                    return new Bill(v['for'], v.total, v.start, v.end);
                }
                return v;
            },

            /**
             * Method to revive the people from a JSON object.
             * @param k key
             * @param v value
             */
            peopleReviver: function (k, v) {
                if (v.hasOwnProperty("name")) {
                    // Circular dependencies
                    var Person = requirejs('app/model').Person;
                    return new Person(v.name, v['in'], v.out);
                }
                return v;
            },

            /**
             * Helper Method to dump the people into a JSON object
             * @param k key
             * @param v value
             */
            peopleReplacer: function (k, v) {
                var result = v;
                if (k === "owes" || k === "range") {
                    return;
                }
                if (k === "in" || k === "out") {
                    result = result.format(this.dateFormat);
                }
                if (result === "Dec 31, 3000" || result === "Jan 01, 1970") {
                    return;
                }
                return result;
            },

            /**
             * Helper Method to dump the bills into a JSON object
             * @param k key
             * @param v value
             */
            billsReplacer: function (k, v) {
                if (k === "start" || k === "end") {
                    return v.format(this.dateFormat);
                }
                return v;
            }
        };
    });
}());