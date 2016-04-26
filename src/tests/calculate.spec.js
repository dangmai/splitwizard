import expect from "expect";
import { calculate } from "utils";
import { Person, Bill } from "models";
import deepFreeze from "deep-freeze";

describe('calculate', function() {
  it('should evenly split the bill in simple cases', function() {
    var neo = new Person("Neo", "Jan 1, 2012", "Dec 31, 3000"),
      trinity = new Person("Trinity", "Jan 1, 2012", "Dec 31, 3000"),
      morpheus = new Person("Morpheus", "Jan 1, 2012", "Dec 31, 3000"),
      bill = new Bill("Internet", 3000, "Feb 1, 2012", "Mar 1, 2012"),
      result;
    result = calculate([bill], [neo, trinity, morpheus]);
    expect(Math.floor(result[0].totalAmount)).toEqual(1000);
    expect(Math.floor(result[1].totalAmount)).toEqual(1000);
    expect(Math.floor(result[2].totalAmount)).toEqual(1000);
  });
  it('should unevenly split the bill in simple cases', function() {
    var neo = new Person("Neo", "Jan 1, 2012",
        "Dec 31, 3000"),
      trinity = new Person("Trinity", "Jan 16, 2012",
        "Dec 31, 3000"),
      bill = new Bill("Internet", 3000,
        "Jan 1, 2012", "Jan 30, 2012"),
      result;
    result = calculate([bill], [neo, trinity]);
    expect(Math.floor(result[0].totalAmount)).toEqual(2000);
    expect(Math.floor(result[1].totalAmount)).toEqual(1000);
  });
  it('should handle days with no one present gracefully', function() {
    // If there are days with no one present, and there are
    // variations in the # of days the people in the house,
    // it may lead to the situation where the matrix cannot be
    // inversed; and thus a solution cannot be found.
    var neo = new Person("Neo", "Jan 1, 2012",
        "Dec 31, 3000"),
      trinity = new Person("Trinity", "Jan 16, 2012",
        "Dec 31, 3000"),
      bill = new Bill("Internet", 3000,
        "Dec 20, 2011", "Jan 30, 2012"),
      result;
    result = calculate([bill], [neo, trinity]);
    expect(Math.floor(result[0].totalAmount)).toEqual(2000);
    expect(Math.floor(result[1].totalAmount)).toEqual(1000);
  });
});