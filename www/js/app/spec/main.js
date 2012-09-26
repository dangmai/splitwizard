/*global describe, it, define,chai*/
(function () {
    "use strict";

    var expect = chai.expect;
    define(['app/main'], function (main) {
        describe('main spec', function () {
            describe('First spec', function () {
                it('should display the correct thing', function () {
                    expect(true).to.be.true;
                });
            });
        });
        return {};
    });
}());