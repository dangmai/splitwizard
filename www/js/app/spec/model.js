/*global describe, it, define,chai*/
(function () {
    "use strict";

    var expect = chai.expect;
    define(['app/model', 'moment'], function (model, moment) {
        describe('model spec', function () {
            describe('Person', function () {
                it('should create a correct Person object', function () {
                    var person = new model.Person("Humphrey", "Dec 25, 1899",
                        "Jan 14, 1957");
                    expect(person.name).to.equal("Humphrey");
                    expect(moment.isMoment(person['in'])).to.be.true;
                    expect(person['in'].year()).to.equal(1899);
                    expect(moment.isMoment(person.out)).to.be.true;
                    expect(person.out.year()).to.equal(1957);
                });
                it('should put in placeholder dates when necessary', function () {
                    var noin = new model.Person("No in", null, "Jan 14, 2012"),
                        noout = new model.Person("No in", "Jan 14, 1957", null);
                    expect(noin['in'].year()).to.equal(1970);
                    expect(noout.out.year()).to.equal(3000);
                })
                it('should be cloned correctly', function () {
                    var person = new model.Person("Humphrey", "Dec 25, 1899",
                        "Jan 14, 1957"),
                        rick = person.clone();
                    expect(rick.name).to.equal(person.name);
                    expect(rick['in']).to.equal(person['in']);
                    expect(rick.out).to.equal(person.out);
                });
                it('should not modify original object after cloned', function () {
                    var person = new model.Person("Humphrey", "Dec 25, 1899",
                        "Jan 14, 1957"),
                        rick = person.clone();
                    rick.name = "Rick";
                    rick["in"] = moment("Jan 1, 2012");
                    rick.out = moment("Jan 1, 2082");
                    expect(person.name).to.equal("Humphrey");
                    expect(person['in'].year()).to.equal(1899);
                    expect(person.out.year()).to.equal(1957);
                });
            });
            describe('Bill', function () {
                it('should create a correct Bill object', function () {
                    var bill = new model.Bill("Electricity", 3500,
                        "Jan 1, 1779", "Jan 1, 2012");
                    expect(bill['for']).to.equal("Electricity");
                    expect(bill.total).to.equal(3500);
                    expect(moment.isMoment(bill.start)).to.be.true;
                    expect(bill.start.year()).to.equal(1779);
                    expect(moment.isMoment(bill.end)).to.be.true;
                    expect(bill.end.year()).to.equal(2012);
                });
                it('should be cloned correctly', function () {
                    var bill = new model.Bill("Electricity", 3500,
                        "Jan 1, 1779", "Jan 1, 2012"),
                        volt = bill.clone();
                    expect(volt['for']).to.equal(bill['for']);
                    expect(volt.total).to.equal(bill.total);
                    expect(volt.start).to.equal(bill.start);
                    expect(volt.end).to.equal(bill.end);
                });
                it('should not modify original object after cloned', function () {
                    var bill = new model.Bill("Electricity", 3500,
                        "Jan 1, 1779", "Jan 1, 2012"),
                        internet = bill.clone();
                    internet['for'] = "Internet";
                    internet.total = 9001;
                    internet.start = moment("Aug 6, 1981");
                    internet.end = moment("Dec 31, 3000");
                    expect(bill['for']).to.equal("Electricity");
                    expect(bill.total).to.equal(3500);
                    expect(bill.start.year()).to.equal(1779);
                    expect(bill.end.year()).to.equal(2012);
                });
            });
            describe('Day', function () {
                it("should be constructed correctly", function () {
                    var day = new model.Day(moment("Jun 25, 1989"), 1);
                    expect(day.date.year()).to.equal(1989);
                    expect(day.billIndex).to.equal(1);
                });
                it("should add people correctly", function () {
                    var humphrey = new model.Person("Humphrey", "Dec 25, 1899",
                        "Jan 14, 1957"),
                        james = new model.Person("James", "Feb 8, 1931",
                            "Sep 30, 1955"),
                        gene = new model.Person("Gene", "Aug 23, 1912",
                            "Feb 2, 1996"),
                        day = new model.Day(moment("Jan 1, 1935"), 0);
                    day.addPerson(humphrey);
                    day.addPerson(james);
                    day.addPerson(gene);
                    expect(day.numPeople()).to.equal(3);
                });
                it("should divide the money to the people correctly", function () {
                    var humphrey = new model.Person("Humphrey", "Dec 25, 1899",
                        "Jan 14, 1957"),
                        james = new model.Person("James", "Feb 8, 1931",
                            "Sep 30, 1955"),
                        gene = new model.Person("Gene", "Aug 23, 1912",
                            "Feb 2, 1996"),
                        day = new model.Day(moment("Jan 1, 1935"), 0);
                    humphrey.owes = [0];
                    james.owes = [0];
                    gene.owes = [0];
                    day.addPerson(humphrey);
                    day.addPerson(james);
                    day.addPerson(gene);
                    day.worths(30);
                    expect(humphrey.owes[0]).to.equal(10);
                    expect(james.owes[0]).to.equal(10);
                    expect(gene.owes[0]).to.equal(10);
                });
            });
        });
        return {};
    });
}());