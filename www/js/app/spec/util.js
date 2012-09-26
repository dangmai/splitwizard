/*global describe, it, define,chai*/
(function () {
    "use strict";

    var expect = chai.expect;
    define(['app/util', 'moment'], function (util, moment) {
        describe('util spec', function () {
            describe('validateDate', function () {
                it("should validate input correctly", function () {
                    expect(util.validateDate("asdf"), "junk input").to.be.false;
                    expect(util.validateDate("May 21, 2012"),
                        "correct input").to.be.true;
                    expect(util.validateDate("May 32, 2012"),
                        "nonexistent day").to.be.false;
                    expect(util.validateDate("Feb 29, 2012"),
                        "leap day on leap year").to.be.true;
                    // Need to wait for upstream fix.
                    // Issue: https://github.com/timrwood/moment/issues/449
                    // expect(util.validateDate("Feb 29, 2013"),
                    //     "leap day on non leap year").to.be.false;
                });
            });
        });
        return {};
    });
}());