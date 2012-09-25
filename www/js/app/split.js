/*global define,$M,$V*/
(function () {
	'use strict';

	define(['app/day', 'underscore', 'jquery', 'moment-range', 'sylvester'], function (Day, _, $, moment, sylvester) {
		var dateFormat = "MMM DD, YYYY",
			calculate,
			billReviver,
			billify,
			billReplacer,
			peopleReviver,
			peopleReplacer,
			personify,
			validateDate;

		/**
		 * Calculate the bill(s) for the people.
		 * @param (List) bills a list of bills to calculate.
		 * @param (List) people a list of people to split the bill to.
		 * @return (List) the original list of people, each of which has his/her "owes" property
		 * populated with an array containing the amount of money he/she owes for the bills.
		 */
		calculate = function (bills, people) {
			// Clone the original lists, so they are not modified by mistake. Also, necessary attributes
			// that are necessary for calculations later on are added in this step.
			// Note: Underscore clone() is shallow, so it is necessary to loop over each item in the
			// original lists and clone it.
			var results = [],
				billsOutput = [];
			$.each(people, function (i, person) {
				var tempPerson = _.clone(person);
				// moment-range contains() is not inclusive on both ends, so some black magic is required here.
				tempPerson.range = moment().range(moment(tempPerson["in"]).subtract("d", 1), moment(tempPerson.out).add("d", 1));
				tempPerson.owes = [];
				results.push(tempPerson);
			});
			$.each(bills, function (i, bill) {
				billsOutput.push(_.clone(bill));
			});
			$.each(billsOutput, function (billIndex, bill) {
				bill.start = bill.start.format(dateFormat);
				bill.end = bill.end.format(dateFormat);
			});

			// Start the calculations!
			$.each(bills, function (billIndex, bill) {
				// In order to calculate the amount of money each person owes, it is necessary to
				// figure out how many days he/she is in the apt during the cycle. Also, it is 
				// assumed that everyone uses the same amount of utility in 1 day. With that 
				// assumption, we can build a matrix to solve a system of linear equations, in
				// which the variables are how much each day with an unique number of people is worth.
				// Then, we can simply divide those amounts to the people that are present in each
				// day to find the amount that everyone owes.
				// Be careful, all moments are mutable!
				var	iterationStep = moment().range(bill.start,
						moment(bill.start).add('days', 1)),
					range = moment().range(bill.start, bill.end),
					// Data structure that groups the days with similar # of
					// people together.
					uniqueDays = {},
					numColumns = 0,
					personCount,
					day,
					matrixArray, // the matrix in array form
					currentRow,
					resultArray,
					anchorDayNumPeople,
					uniqueDayNumPeople,
					arrayIndex1,
					arrayIndex2,
					matrix, // the actual matrix object
					resultVector,
					solution;

				$.each(results, function (i, person) {
					person.owes[billIndex] = 0;
				});
				// First step: determine how many people are there in each day, and put it in some
				// data structure. We need to group the days with the same number of people into 
				// one category, in order to build the matrix later on. For this matrix, number of 
				// columns = number of unique days. Also, we keep track of the keys added to the
				// data structure using the hash "keys". This is because it's hard to traverse/count
				// the attributes in Javascript, so it's better to just manually keep track of them
				// when constructing the data structure.
				range.by(iterationStep, function (currentDay) {
					personCount = 0;
					day = new Day(currentDay, billIndex);
					$.each(results, function (index, person) {
						if (person.range.contains(currentDay)) {
							personCount += 1;
							day.addPerson(person);
						}
					});
					if (!(uniqueDays.hasOwnProperty('keys'))) {
						uniqueDays.keys = [];
					}
					if (typeof uniqueDays[personCount] === 'undefined') {
						uniqueDays[personCount] = [];
						uniqueDays.keys.push(personCount.toString());
						numColumns += 1;
					}
					uniqueDays[personCount].push(day);
				});

				// Start building the matrix.
				matrixArray = [];
				currentRow = [];
				resultArray = [];
				// The first row shows the relative weights given to each unique
				// day.
				$.each(uniqueDays.keys, function (index, key) {
					currentRow.push(uniqueDays[key].length);
				});
				matrixArray.push(currentRow);

				// Now, we use the first unique category as the anchor, and calculate the
				// relationship between the rest with respect to the anchor. We then add
				// this relationship to the necessary row in the matrix.
				anchorDayNumPeople = uniqueDays[uniqueDays.keys[0]][0].numPeople();

				for (arrayIndex1 = 1; arrayIndex1 < numColumns; arrayIndex1 += 1) {
					uniqueDayNumPeople = uniqueDays[uniqueDays.keys[arrayIndex1]][0].numPeople();
					currentRow = [uniqueDayNumPeople];
					for (arrayIndex2 = 1; arrayIndex2 < numColumns; arrayIndex2 += 1) {
						if (arrayIndex1 === arrayIndex2) {
							currentRow.push(-anchorDayNumPeople);
						} else {
							currentRow.push(0);
						}
					}
					matrixArray.push(currentRow);
				}

				// The result vector is simple: First value is the total amount of this bill,
				// and the rest is 0.
				resultArray.push(bill.total);
				for (arrayIndex1 = 0; arrayIndex1 < numColumns - 1; arrayIndex1 += 1) {
					resultArray.push(0);
				}

				// Making the matrix and the result arrays into actual matrices.
				matrix = $M(matrixArray);
				resultVector = $V(resultArray);
				solution = matrix.inv().x(resultVector);

				// The solution matrix has the amount of money that each day is worth for this bill,
				// so attribute those amounts to the correct days.
				$.each(solution.elements, function (index, value) {
					$.each(uniqueDays[uniqueDays.keys[index]], function (i, day) {
						day.worths(value);
					});
				});

				// In order to to make it easier for output, each person in the results list will
				// also have a 'total' attribute that is the sum of all the amount they owe in
				// every bill.
				$.each(results, function (index, person) {
					person.total = (_.reduce(person.owes, function (memo, num) {
						return memo + num;
					})).toFixed(2);
				});
			});

			// In order for easier output, the "owes" attribute for each person is manipulated so that
			// it contains the whole Bill object as well.
			$.each(results, function (index, person) {
				person.owesOld = person.owes;
				person.owes = [];
				$.each(person.owesOld, function (billIndex, value) {
					person.owes.push({
						"bill": billsOutput[billIndex],
						"amount": value.toFixed(2)
					});
				});
				delete person.owesOld;
			});

			//console.log(results);
			return results;
		};

		/**
		 * Method to revive the bills from a JSON object.
		 * @param k key
		 * @param v value
		 */
		billReviver = function (k, v) {
			if (v.hasOwnProperty("start") && v.hasOwnProperty("end")) {
				return billify(v);
			}
			return v;
		};

		/**
		 * Objectify a naive bill object into one that can be more easily
		 * processed later on.
		 * @param (Object) naiveObj the original naive object.
		 * @return (Object) the finished object.
		 */
		billify = function (naiveObj) {
			var bill = _.clone(naiveObj);
			bill.start = moment(bill.start, dateFormat);
			bill.end = moment(bill.end, dateFormat);
			return bill;
		};

		/**
		 * Helper method to validate a date string.
		 * @param dateStr the date string to validate.
		 * @return whether the date string is a valid date.
		 */
		validateDate = function (dateStr) {
			return moment(dateStr).isValid();
		};

		/**
		 * Method to revive the people from a JSON object.
		 * @param k key
		 * @param v value
		 */
		peopleReviver = function (k, v) {
			if (v.hasOwnProperty("name")) {
				return personify(v);
			}
			return v;
		};

		/**
		 * Objectify a naive person object so that it can be more easily used
		 * later on.
		 * @param (Object) naiveObj the naive person object.
		 * @return (Object) the finish person object.
		 */
		personify = function (naiveObj) {
			var person = _.clone(naiveObj);
			if (!person.hasOwnProperty("in") || !person["in"]) {
				person["in"] = moment("Jan 01, 1970", dateFormat);
			} else {
				person["in"] = moment(person["in"], dateFormat);
			}
			if (!person.hasOwnProperty("out") || !person.out) {
				person.out = moment("Dec 31, 3000", dateFormat);
			} else {
				person.out = moment(person.out, dateFormat);
			}
			return person;
		};

		/**
		 * Helper Method to dump the people into a JSON object
		 * @param k key
		 * @param v value
		 */
		peopleReplacer = function (k, v) {
			var result = v;
			if (k === "owes" || k === "range") {
				return;
			}
			if (k === "in" || k === "out") {
				result = result.format(dateFormat);
			}
			if (result === "Dec 31, 3000" || result === "Jan 01, 1970") {
				return;
			}
			return result;
		};

		/**
		 * Helper Method to dump the bills into a JSON object
		 * @param k key
		 * @param v value
		 */
		billReplacer = function (k, v) {
			if (k === "start" || k === "end") {
				return v.format(dateFormat);
			}
			return v;
		};

		return {
			calculate: calculate,
			billReviver: billReviver,
			peopleReviver: peopleReviver,
			billReplacer: billReplacer,
			peopleReplacer: peopleReplacer,
			billify: billify,
			personify: personify,
			validateDate: validateDate
		};
	});
}());