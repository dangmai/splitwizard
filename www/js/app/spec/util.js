/*global describe, it, define,chai*/
(function () {
    "use strict";

    var expect = chai.expect;
    define(['app/util', 'app/model', 'moment', 'underscore'],
        function (util, model, moment, _) {
            describe('util spec', function () {
                describe('validateDate', function () {
                    it("should validate input correctly", function () {
                        expect(util.validateDate("asdf"),
                            "junk input").to.be.false;
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
                describe('peopleReviver', function () {
                    it("should correctly revives people from JSON", function (done) {
                        requirejs(['text!app/test/people.json'], function (peopleJSON) {
                            var people = JSON.parse(peopleJSON, util.peopleReviver);
                            _.each(people, function (person) {
                                expect(person).to.be.an.instanceof(model.Person);
                            });
                            done();
                        })
                    })
                })
            });
            return {};
        });
}());