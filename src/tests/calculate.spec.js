/* eslint-disable import/no-extraneous-dependencies */
import expect from "expect";
import { calculate } from "../utils";
import { Person, Bill } from "../models";

describe("calculate", () => {
  it("should evenly split the bill in simple cases", () => {
    const neo = new Person("Neo", "Jan 1, 2012", "Dec 31, 3000");
    const trinity = new Person("Trinity", "Jan 1, 2012", "Dec 31, 3000");
    const morpheus = new Person("Morpheus", "Jan 1, 2012", "Dec 31, 3000");
    const bill = new Bill("Internet", 3000, "Feb 1, 2012", "Mar 1, 2012");
    const result = calculate([bill], [neo, trinity, morpheus]);
    expect(Math.floor(result[0].totalAmount)).toEqual(1000);
    expect(Math.floor(result[1].totalAmount)).toEqual(1000);
    expect(Math.floor(result[2].totalAmount)).toEqual(1000);
  });
  it("should unevenly split the bill in simple cases", () => {
    const neo = new Person("Neo", "Jan 1, 2012", "Dec 31, 3000");
    const trinity = new Person("Trinity", "Jan 16, 2012", "Dec 31, 3000");
    const bill = new Bill("Internet", 3000, "Jan 1, 2012", "Jan 30, 2012");
    const result = calculate([bill], [neo, trinity]);
    expect(Math.floor(result[0].totalAmount)).toEqual(2000);
    expect(Math.floor(result[1].totalAmount)).toEqual(1000);
  });
  it("should handle periods with no present correctly", () => {
    // If there exists a bill that no one should be responsible for, the
    // calculation should return 0
    const neo = new Person("Neo", "Jan 1, 2012", "Jan 31, 2012");
    const trinity = new Person("Trinity", "Jan 1, 2012", "Jan 31, 2012");
    const bill = new Bill("Internet", 3000, "Feb 1, 2012", "Feb 28, 2012");
    const result = calculate([bill], [neo, trinity]);
    expect(Math.floor(result[0].totalAmount)).toEqual(0);
    expect(Math.floor(result[1].totalAmount)).toEqual(0);
  });
  it("should handle days with no one present gracefully", () => {
    const neo = new Person("Neo", "Jan 1, 2012",
        "Dec 31, 3000");
    const trinity = new Person("Trinity", "Jan 16, 2012",
        "Dec 31, 3000");
    const bill = new Bill("Internet", 3000,
        "Dec 20, 2011", "Jan 30, 2012");
    const result = calculate([bill], [neo, trinity]);
    expect(Math.floor(result[0].totalAmount)).toEqual(2000);
    expect(Math.floor(result[1].totalAmount)).toEqual(1000);
  });
});
