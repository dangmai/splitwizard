/*global define*/
(function () {
    "use strict";

    define(['moment'], function (moment) {
        return {
            dateFormat: "MMM DD, YYYY",
            validateDate: function (dateStr) {
                return moment(dateStr).isValid();
            }
        };
    });
}());