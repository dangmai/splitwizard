(function () {
	'use strict';

	define(['underscore', 'jquery', 'moment-range', 'sylvester'], function (_, $, moment, sylvester){
		var dateFormat = "MMM DD, YYYY";

		/**
		 * A class to represent a day in the billing cycle of a particular bill.
		 * @param (moment) date the date of this day.
		 * @param (int) billIndex the index of this bill in the bills array.
		 */
		function Day(date, billIndex) {
			this.date = date;
			this.billIndex = billIndex;
			this.people = [];
		}
		Day.prototype.toString = function() {
			return this.date.toString();
		}
		/**
		 * Add a person who is present on this day.
		 * @param (object) person the person object.
		 */
		Day.prototype.addPerson = function(person) {
			this.people.push(person);
		}
		/**
		 * Announces to this object how much it is worth in the billing
		 * cycle. Calling this automatically distribute this amount of
		 * money evenly towards the people who are present on this day.
		 * @param moneyAmt how much this day is worth in the billing cycle.
		 */
		Day.prototype.worths = function(moneyAmt) {
			var eachPersonOwes = moneyAmt / this.people.length;
			var that = this;
			
			$.each(this.people, function(index, person) {
				person['owes'][that.billIndex] += eachPersonOwes;
			});
		}
		/**
		 * Helper method to get the number of present people on this day.
		 * @return (int) the number of present people.
		 */
		Day.prototype.numPeople = function() {
			return this.people.length;
		}
		
		/**
		 * Calculate the bill(s) for the people.
		 * @param (List) bills a list of bills to calculate.
		 * @param (List) people a list of people to split the bill to.
		 * @return (List) the original list of people, each of which has his/her "owes" property
		 * populated with an array containing the amount of money he/she owes for the bills.
		 */
		var calculate = function(bills, people) {
			// Clone the original lists, so they are not modified by mistake. Also, necessary attributes
			// that are necessary for calculations later on are added in this step.
			// Note: Underscore clone() is shallow, so it is necessary to loop over each item in the
			// original lists and clone it.
			var results = [];
			$.each(people, function (i, person) {
				var tempPerson = _.clone(person);
				// moment-range contains() is not inclusive on both ends, so some black magic is required here.
				tempPerson["range"] = moment().range(moment(tempPerson["in"]).subtract("d", 1), moment(tempPerson["out"]).add("d", 1));
				tempPerson["owes"] = [];
				results.push(tempPerson);
			});
			var billsOutput = [];
			$.each(bills, function (i, bill) {
				billsOutput.push(_.clone(bill));
			});
			$.each(billsOutput, function (billIndex, bill) {
				bill['start'] = bill['start'].format(dateFormat);
				bill['end'] = bill['end'].format(dateFormat);
			});

			// Start the calculations!
			$.each(bills, function(billIndex, bill) {
				// In order to calculate the amount of money each person owes, it is necessary to
				// figure out how many days he/she is in the apt during the cycle. Also, it is 
				// assumed that everyone uses the same amount of utility in 1 day. With that 
				// assumption, we can build a matrix to solve a system of linear equations, in
				// which the variables are how much each day with an unique number of people is worth.
				// Then, we can simply divide those amounts to the people that are present in each
				// day to find the amount that everyone owes.
				// Be careful, all moments are mutable!
				var	iterationStep = moment().range(bill['start'], moment(bill['start']).add('days', 1)),
					range = moment().range(bill['start'], bill['end']),
					uniqueDays = {}, // Data structure that groups the days with similar # of people together
					numColumns = 0,
					personCount, day;
				
				$.each(results, function(i, person) {
					person['owes'][billIndex] = 0;
				});
				// First step: determine how many people are there in each day, and put it in some
				// data structure. We need to group the days with the same number of people into 
				// one category, in order to build the matrix later on. For this matrix, number of 
				// columns = number of unique days. Also, we keep track of the keys added to the
				// data structure using the hash "keys". This is because it's hard to traverse/count
				// the attributes in Javascript, so it's better to just manually keep track of them
				// when constructing the data structure.
				range.by(iterationStep, function(currentDay) {
					personCount = 0;
					day = new Day(currentDay, billIndex);
					$.each(results, function(index, person) {
						if (person["range"].contains(currentDay)) {
							personCount ++;
							day.addPerson(person);
						};
					});
					if (!('keys' in uniqueDays)) {
						uniqueDays['keys'] = [];
					}
					if (!(personCount in uniqueDays)) {
						uniqueDays[personCount] = [];
						uniqueDays['keys'].push(personCount.toString());
						numColumns ++;
					}
					uniqueDays[personCount].push(day);
				});
				
				// Start building the matrix. 
				var matrixArray = [],
					firstRow = [],
					resultArray = [],
					days;
				// The first row shows the relative weights given to each unique day.
				$.each(uniqueDays['keys'], function(index, key) {
					days = uniqueDays[key];
					firstRow.push(days.length);
				});
				matrixArray.push(firstRow);
				
				// Now, we use the first unique category as the anchor, and calculate the
				// relationship between the rest with respect to the anchor. We then add
				// this relationship to the necessary row in the matrix.
				var anchorDayNumPeople = uniqueDays[uniqueDays['keys'][0]][0].numPeople(),
					uniqueDayNumPeople, currentRow;
				for (var i=1; i < numColumns; i ++) {
					uniqueDayNumPeople = uniqueDays[uniqueDays['keys'][i]][0].numPeople();
					currentRow = [uniqueDayNumPeople];
					for (var j=1; j < numColumns; j ++) {
						if (i===j) {
							currentRow.push(0 - anchorDayNumPeople);
						} else {
							currentRow.push(0);
						}
					}
					matrixArray.push(currentRow);
				}
				
				// The result vector is simple: First value is the total amount of this bill,
				// and the rest is 0.
				resultArray.push(bill["total"]);
				for (var i=0; i < numColumns - 1; i ++) {
					resultArray.push(0);
				}
				
				// Making the matrix and the result arrays into actual matrices.
				var matrix = $M(matrixArray),
					result = $V(resultArray),
					solution = matrix.inv().x(result);
				
				// The solution matrix has the amount of money that each day is worth for this bill,
				// so attribute those amounts to the correct days.
				$.each(solution.elements, function(index, value) {
					$.each(uniqueDays[uniqueDays['keys'][index]], function(i, day) {
						day.worths(value);
					});
				});
				
				// In order to to make it easier for output, each person in the results list will
				// also have a 'total' attribute that is the sum of all the amount they owe in
				// every bill.
				$.each(results, function(index, person) {
					person['total'] = (_.reduce(person['owes'], function(memo, num) { 
						return memo + num; 
					})).toFixed(2);
				});
			});
			
			// In order for easier output, the "owes" attribute for each person is manipulated so that
			// it contains the whole Bill object as well.
			$.each(results, function(index, person) {
				person["owesOld"] = person["owes"];
				person["owes"] = [];
				$.each(person["owesOld"], function(billIndex, value) {
					person["owes"].push({ "bill": billsOutput[billIndex], "amount": value.toFixed(2) });
				});
				delete person["owesOld"];
			});
		
			//console.log(results);
			return results;
		};
		
		/**
		 * Method to revive the bills from a JSON object.
		 * @param k key
		 * @param v value
		 */
		var billReviver = function(k, v) {
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
		var billify = function(naiveObj) {
			var bill = _.clone(naiveObj);
			bill["start"] = moment(bill["start"], dateFormat);
			bill["end"] = moment(bill["end"], dateFormat);
			return bill;
		}
		
		/**
		 * Helper method to validate a date string.
		 * @param dateStr the date string to validate.
		 * @return whether the date string is a valid date.
		 */
		var validateDate = function(dateStr) {
			return moment(dateStr).isValid();
		};
				
		/**
		 * Method to revive the people from a JSON object.
		 * @param k key
		 * @param v value
		 */
		var peopleReviver = function(k, v) {
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
		var personify = function(naiveObj) {
			var person = _.clone(naiveObj);
			if (!person.hasOwnProperty("in") || !person["in"]) {
				person["in"] = moment("Jan 01, 1970", dateFormat);
			} else {
				person["in"] = moment(person["in"], dateFormat);
			}
			if (!person.hasOwnProperty("out") || !person["out"]) {
				person["out"] = moment("Dec 31, 3000", dateFormat);
			} else {
				person["out"] = moment(person["out"], dateFormat);
			}
			return person;
		};
		
		/**
		 * Helper Method to dump the people into a JSON object
		 * @param k key
		 * @param v value
		 */
		var peopleReplacer = function(k, v) {
			var result = v;
			if (k === "owes" || k === "range") {
				return;
			}
			if (k === "in" || k === "out") {
				result = result.format(dateFormat);
			}
			if (result === "Dec 31, 3000" || result == "Jan 01, 1970") {
				return;
			}
			return result;
		}
		
		/**
		 * Helper Method to dump the bills into a JSON object
		 * @param k key
		 * @param v value
		 */
		var billReplacer = function(k, v) {
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
			validateDate: validateDate,
		};
	});
} ());