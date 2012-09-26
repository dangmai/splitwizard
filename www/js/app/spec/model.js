/*global describe, it, define,chai*/
(function () {
    "use strict";

    var expect = chai.expect;
    define(['app/model'], function (model) {
        describe('model spec', function () {
            describe('Person', function () {
                it('should create a correct Person object', function () {
                    expect(true).to.be.true;
                });
            });
        });
        return {};
    });
}());