/*global describe, it, define,chai*/
(function () {
    "use strict";

    var expect = chai.expect;
    define(['app/split'], function (split) {
        describe('split', function () {
            describe('validateDate', function () {
                it('should return false when junk string is entered', function () {
                    var isValid = split.validateDate('asdf');
                    expect(isValid).to.be.false;
                });
            });
        });
        // Remember to test when there are days in the billing cycle with 0 ppl
        return {};
    });
}());