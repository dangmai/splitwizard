/*global describe, it, define,chai*/
(function () {
    "use strict";

    var expect = chai.expect;
    define(['app/split', 'app/model'], function (split, model) {
        describe('split', function () {
            describe('calculate', function () {
                it('should evenly split the bill in simple cases', function () {
                    var neo = new model.Person("Neo", "Jan 1, 2012",
                        "Dec 31, 3000"),
                        trinity = new model.Person("Trinity", "Jan 1, 2012",
                            "Dec 31, 3000"),
                        morpheus =  new model.Person("Morpheus", "Jan 1, 2012",
                            "Dec 31, 3000"),
                        bill = new model.Bill("Internet", 3000,
                            "Feb 1, 2012", "Mar 1, 2012"),
                        result;
                    result = split.calculate([bill], [neo, trinity, morpheus]);
                    expect(Math.floor(result[0].owes[0].amount)).to.equal(1000);
                    expect(Math.floor(result[1].owes[0].amount)).to.equal(1000);
                    expect(Math.floor(result[2].owes[0].amount)).to.equal(1000);
                });
                it('should unevenly split the bill in simple cases', function () {
                    var neo = new model.Person("Neo", "Jan 1, 2012",
                        "Dec 31, 3000"),
                        trinity = new model.Person("Trinity", "Jan 16, 2012",
                            "Dec 31, 3000"),
                        bill = new model.Bill("Internet", 3000,
                            "Jan 1, 2012", "Jan 30, 2012"),
                        result;
                    result = split.calculate([bill], [neo, trinity]);
                    expect(Math.floor(result[0].owes[0].amount)).to.equal(2000);
                    expect(Math.floor(result[1].owes[0].amount)).to.equal(1000);
                });
                it('should handle days with no one present gracefully', function () {
                    // If there are days with no one present, and there are
                    // variations in the # of days the people in the house,
                    // it leads to the situation where the matrix cannot be
                    // inversed; and thus a solution cannot be found.
                    var neo = new model.Person("Neo", "Jan 1, 2012",
                        "Dec 31, 3000"),
                        trinity = new model.Person("Trinity", "Jan 16, 2012",
                            "Dec 31, 3000"),
                        bill = new model.Bill("Internet", 3000,
                            "Dec 20, 2011", "Jan 30, 2012"),
                        result;
                    result = split.calculate([bill], [neo, trinity]);
                    expect(Math.floor(result[0].owes[0].amount)).to.equal(1500);
                    expect(Math.floor(result[1].owes[0].amount)).to.equal(1500);
                });
            });
        });
        return {};
    });
}());