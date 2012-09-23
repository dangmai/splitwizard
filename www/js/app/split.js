(function () {
	'use strict';

	define(['jquery', 'moment-range', 'sylvester'], function ($, moment, sylvester){
		var dateFormat = "YYYY-MM-DD";
		
		// Checks that an input string is a decimal number, with an optional +/- sign character.
		var isDecimal_re     = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;
		function isDecimal(s) {
		   return String(s).search (isDecimal_re) != -1
		}

		
		/**
		 * A class to represent a day in the billing cycle of a particular bill.
		 * @param (moment) date the date of this day.
		 * @param (int) billIndex the index of this bill in the bills array.
		 */
		function Day(date, billIndex) {
			this.date = date;
			this.billIndex = billIndex;
			this.tenants = [];
		}
		Day.prototype.toString = function() {
			return this.date.toString();
		}
		/**
		 * Add a tenant who is present on this day.
		 * @param (object) tenant the tenant object.
		 */
		Day.prototype.addTenant = function(tenant) {
			this.tenants.push(tenant);
			if (typeof(tenant['owes'][this.billIndex]==="undefined")) {
				tenant['owes'][this.billIndex] = 0;
			}
		}
		/**
		 * Announces to this object how much it is worth in the billing
		 * cycle. Calling this automatically distribute this amount of
		 * money evenly towards the tenants who are present on this day.
		 * @param moneyAmt how much this day is worth in the billing cycle.
		 */
		Day.prototype.worths = function(moneyAmt) {
			var eachTenantOwes = moneyAmt / this.tenants.length;
			var that = this;
			
			$.each(this.tenants, function(index, tenant) {
				tenant['owes'][that.billIndex] += eachTenantOwes;
			});
		}
		/**
		 * Helper method to get the number of present tenants on this day.
		 * @return (int) the number of present tenants.
		 */
		Day.prototype.numTenants = function() {
			return this.tenants.length;
		}
		
		/**
		 * Calculate the bill(s) for the tenants.
		 * @param (List) bills a list of bills to calculate.
		 * @param (List) tenants a list of tenants to split the bill to.
		 * @return (List) the original list of tenants, each of which has his/her "owes" property
		 * populated with an array containing the amount of money he/she owes for the bills.
		 */
		var calculate = function(bills, tenants) {
			$.each(bills, function(billIndex, bill) {
				// In order to calculate the amount of money each tenant owes, it is necessary to
				// figure out how many days he/she is in the apt during the cycle. Also, it is 
				// assumed that everyone uses the same amount of utility in 1 day. With that 
				// assumption, we can build a matrix to solve a system of linear equations, in
				// which the variables are how much each day with an unique number of tenants is worth.
				// Then, we can simply divide those amounts to the tenants that are present in each
				// day to find the amount that everyone owes.
				// Be careful, all moments are mutable!
				var	iterationStep = moment().range(bill['start'], moment(bill['start']).add('days', 1)),
					range = moment().range(bill['start'], bill['end']),
					uniqueDays = {}, // Data structure that groups the days with similar # of tenants together
					numColumns = 0,
					tenantCount, day;
				
				// First step: determine how many tenants are there in each day, and put it in some
				// data structure. We need to group the days with the same number of tenants into 
				// one category, in order to build the matrix later on. For this matrix, number of 
				// columns = number of unique days. Also, we keep track of the keys added to the
				// data structure using the hash "keys". This is because it's hard to traverse/count
				// the attributes in Javascript, so it's better to just manually keep track of them
				// when constructing the data structure.
				range.by(iterationStep, function(currentDay) {
					tenantCount = 0;
					day = new Day(currentDay, billIndex);
					$.each(tenants, function(index, tenant) {
						if (tenant["range"].contains(currentDay)) {
							tenantCount ++;
							day.addTenant(tenant);
						};
					});
					if (!('keys' in uniqueDays)) {
						uniqueDays['keys'] = [];
					}
					if (!(tenantCount in uniqueDays)) {
						uniqueDays[tenantCount] = [];
						uniqueDays['keys'].push(tenantCount.toString());
						numColumns ++;
					}
					uniqueDays[tenantCount].push(day);
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
				var anchorDayNumTenants = uniqueDays[uniqueDays['keys'][0]][0].numTenants(),
					uniqueDayNumTenants, currentRow;
				for (var i=1; i < numColumns; i ++) {
					uniqueDayNumTenants = uniqueDays[uniqueDays['keys'][i]][0].numTenants();
					currentRow = [uniqueDayNumTenants];
					for (var j=1; j < numColumns; j ++) {
						if (i===j) {
							currentRow.push(0 - anchorDayNumTenants);
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
					result = $V(resultArray);
				console.log(matrix);
				console.log(result);
				var solution = matrix.inv().x(result);
				console.log(solution);
				
				$.each(solution.elements, function(index, value) {
					$.each(uniqueDays[uniqueDays['keys'][index]], function(i, day) {
						day.worths(value);
					});
				});
			});
			console.log(tenants);
			
		};
		
		/**
		 * Method to revive the bills from a JSON object.
		 * @param k key
		 * @param v value
		 */
		var billReviver = function(k, v) {
			if (k === "start" || k === "end") {
				return moment(v, dateFormat);
			}
			return v;
		};
		
		/**
		 * Method to validate whether the input for a bill is valid or not.
		 *
		 * @param (String) what is this bill about?
		 * @param (String) total the total amount of money due in this bill.
		 * @param (String) the start date of the billing cycle.
		 * @param (String) the end date of the billing cycle.
		 * @return undefined if there's no error, otherwise returns a hashtable containing the error(s).
		 */
		var billValidator = function(forStr, total, start, end) {
			if (!isDecimal(total)) {
			
			}
			var startMoment = moment(start, dateFormat),
				endMoment = moment(end, dateFormat);
			if (!startMoment.isValid()) {
			
			}
			if (!endMoment.isValid()) {
			
			}
			if (startMoment.diff(endMoment) > 0) {
			
			}
			return true;
		}
		
		var peopleValidator = function(name, inDate, outDate) {
			var inMoment = moment(inDate, dateFormat),
				outMoment = moment(outDate, dateFormat);
			if (!inMoment.isValid()) {
			
			}
			if (!outMoment.isValid()) {
			
			}
			if (inMoment.diff(outMoment) > 0) {
			
			}
			return true;
		}
		
		/**
		 * Method to revive the tenants from a JSON object.
		 * @param k key
		 * @param v value
		 */
		var tenantReviver = function(k, v) {
			if (k === "in" || k === "out" && v) {
				return moment(v, dateFormat);
			}
			else if (v.hasOwnProperty("name")) {
				// The whole tenant object here
				if (!v.hasOwnProperty("in")) {
					v["in"] = moment("1970-01-01", dateFormat);
				}
				if (!v.hasOwnProperty("out")) {
					v["out"] = moment("3000-01-01", dateFormat);
				}
				// moment-range contains() is not inclusive on both ends, so some black magic is required here.
				v["range"] = moment().range(moment(v["in"]).subtract("d", 1), moment(v["out"]).add("d", 1));
				v["owes"] = [];
				return v;
			}
			return v;
		}
		
		/**
		 * Helper Method to dump the tenants into a JSON object
		 * @param k key
		 * @param v value
		 */
		var tenantReplacer = function(k, v) {
			var result = v;
			if (k === "owes" || k === "range") {
				return;
			}
			if (k === "in" || k === "out") {
				result = result.format(dateFormat);
			}
			if (result === "3000-01-01" || result == "1970-01-01") {
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
			tenantReviver: tenantReviver,
			billReplacer: billReplacer,
			tenantReplacer: tenantReplacer,
			billValidator: billValidator,
			peopleValidator: peopleValidator,
		};
	});
} ());