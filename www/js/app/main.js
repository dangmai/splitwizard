/*global define, moment, console*/
(function () {
	'use strict';

	define(['app/split', 'app/model', 'app/util', 'mustache',
		'text!app/templates/form.html', 'text!app/templates/bill-row.html',
		'text!app/templates/person-row.html', 'text!app/templates/result.html',
		'jquery', 'jquery.validate', 'domReady!', 'bootstrap-datepicker'],
		function (split, model, util, Mustache, formTemplateSrc, billRowSrc,
			personRowSrc, resultSrc, $) {

			var	peopleCount = 0,
				billCount = 0,
				formTmpl = Mustache.render(formTemplateSrc),
				removable,
				calculate,
				initializeDatepicker;

			removable = function (count) {
				return (count !== 1);
			};
			$('.main-form-wrapper').html(formTmpl);

			/**
			 * Start the calculations!
			 */
			calculate = function () {
				var people = [],
					bills = [],
					results;
				$.each($('#main-form tr[id^=person]'), function (index, el) {
					var name = $(el).find('[name^=name]').val(),
						inDate = $(el).find('[name^=in]').val(),
						outDate = $(el).find('[name^=out]').val();
					people.push(new model.Person(name, inDate, outDate));
				});
				$.each($('#main-form tr[id^=bill]'), function (index, el) {
					var forVal = $(el).find('[name^=for]').val(),
						start = $(el).find('[name^=start]').val(),
						end = $(el).find('[name^=end]').val(),
						total = parseFloat($(el).find('[name^=total]').val());
					bills.push(new model.Bill(forVal, total, start, end));
				});
				results = split.calculate(bills, people);
				$('.result').html(Mustache.render(resultSrc, { "people": results }));
			};

			// Validationa on the form
			$.validator.addMethod("moment", function (value, element) {
				return this.optional(element) || util.validateDate(value);
			}, "Not a date");
			$.validator.addMethod("laterthan", function (value, element, startEl) {
				return this.optional(element) || this.optional($(startEl).get(0)) || (moment(value).diff(moment($(startEl).val())) > 0);
			}, "Sooner than start");
			$.validator.messages.required = $.format("Required");
			$.validator.messages.number = $.format("Not a number");
			$('#main-form').validate({
				debug: true,
				submitHandler: function (form) {
					//console.log("submithandler");
					calculate();
				},
				invalidHandler: function () {},
				highlight: function (label) {
					$(label).closest('.control-group').addClass('error');
				},
				unhighlight: function (label) {
					$(label).closest('.control-group').removeClass('error');
				}
			});

			$('form').on("click", ".remove", {}, function (e) {
				e.preventDefault();
				$(this).parent().parent().remove();
			});

			/**
			 * Initialize bootstrap-datepicker on a certain element. This will 
			 * check for all alements with class date-field inside the input element
			 * and initialize datepicker on them.
			 * @param (HTMLElement) el the element to initialize datepicker on.
			 */
			initializeDatepicker = function (el) {
				var dateFields = $(el).find(".date-field");
				dateFields.datepicker({
					format: 'M dd, yyyy'
				});
				dateFields.datepicker().on('changeDate', function (e) {
					$('#main-form').valid();
				});
			};
			$('#more-people').click(function (e, context) {
				e.preventDefault();
				var defContext,
					tmpl;
				if (!context) {
					context = {};
				}
				peopleCount += 1;
				defContext = { peopleId: peopleCount, removable: removable(peopleCount) };
				$.extend(context, defContext);
				tmpl = Mustache.render(personRowSrc, context);
				initializeDatepicker($(tmpl).appendTo($('#people-table')));
			});
			$('#more-bills').click(function (e, context) {
				e.preventDefault();
				var defContext,
					tmpl;
				if (!context) {
					context = {};
				}
				billCount += 1;
				defContext = { billId : billCount, removable: removable(billCount) };
				$.extend(context, defContext);
				tmpl = Mustache.render(billRowSrc, context);
				initializeDatepicker($(tmpl).appendTo($('#bills-table')));
			});

			$('#more-people').trigger("click", {
				"name": "Dang Mai",
				"in": "Aug 05, 2012",
				"out": "Sept 05, 2012"
			});
			$('#more-people').trigger("click", {
				"name": "Saqib",
				"in": "Aug 09, 2012",
				"out": "Sept 05, 2012"
			});

			$('#more-bills').trigger("click", {
				"for": "Electricity",
				"total": 30,
				"start": "Aug 06, 2012",
				"end": "Sept 03, 2012"
			});
			$('#more-bills').trigger("click", {
				"for": "Internet",
				"total": 60,
				"start": "Aug 06, 2012",
				"end": "Sept 03, 2012"
			});
		});
}());