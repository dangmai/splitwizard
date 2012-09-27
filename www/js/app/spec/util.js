/*global describe, it, define, chai, requirejs*/
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
                                expect(moment.isMoment(person['in'])).to.be.true;
                                expect(moment.isMoment(person.out)).to.be.true;
                            });
                            done();
                        });
                    });
                });
                describe('billsReviver', function () {
                    it("should correctly revives bills from JSON", function (done) {
                        requirejs(['text!app/test/bills.json'], function (billsJSON) {
                            var bills = JSON.parse(billsJSON, util.billsReviver);
                            _.each(bills, function (bill) {
                                expect(bill).to.be.an.instanceof(model.Bill);
                            });
                            done();
                        });
                    });
                });
                describe('peopleReviver', function () {
                    it("should correctly dumps people to JSON", function () {
                        var humphrey = new model.Person("Humphrey", "Dec 25, 1899",
                            "Jan 14, 1957"),
                            james = new model.Person("James", "Feb 8, 1931",
                                "Sep 30, 1955"),
                            peopleJSON = JSON.stringify([humphrey, james],
                                util.peopleReplacer),
                            correctJSON = '[{"name":"Humphrey","in":"Dec 25, 1899","out":"Jan 14, 1957"},{"name":"James","in":"Feb 08, 1931","out":"Sep 30, 1955"}]';
                        expect(peopleJSON).to.equal(correctJSON);
                    });
                });
                describe('billsReviver', function () {
                    it("should correctly dumps bills to JSON", function () {
                        var el = new model.Bill("Electricity", 50,
                            "Dec 25, 1899", "Jan 14, 1957"),
                            internet = new model.Bill("Internet", 60,
                                "Feb 8, 1931", "Sep 30, 1955"),
                            billsJSON = JSON.stringify([el, internet],
                                util.billsReplacer),
                            correctJSON = '[{"for":"Electricity","total":50,"start":"Dec 25, 1899","end":"Jan 14, 1957"},{"for":"Internet","total":60,"start":"Feb 08, 1931","end":"Sep 30, 1955"}]';
                        console.log(billsJSON);
                        expect(billsJSON).to.equal(correctJSON);
                    });
                });
            });
            return {};
        });
}());