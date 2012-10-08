/*global define, moment, console, Modernizr, window, confirm*/
(function () {
	'use strict';

	define(['app/split', 'app/model', 'app/util', 'mustache',
		'text!app/templates/form.html', 'text!app/templates/bill-row.html',
		'text!app/templates/person-row.html', 'text!app/templates/result.html',
		'jquery', 'jquery.validate', 'jquery.cookie', 'json2',
		'bootstrap-datepicker', 'Modernizr'],
		function (split, model, util, Mustache, formTemplateSrc, billRowSrc,
			personRowSrc, resultSrc, $) {

			var	peopleCount = 0,
				billCount = 0,
				formTmpl = Mustache.render(formTemplateSrc),
				removable,
				calculate,
				initializeDatepicker,
				results,
				// The two array below are declared here instead of inside
				// calculate() in order to make it easy to save to cookies
				people = [],
				bills = [];

			// Check for new version of the app
			if (Modernizr.applicationcache) {
				window.applicationCache.addEventListener('updateready', function (e) {
					if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
						window.applicationCache.swapCache();
						if (confirm('A new version of this site is available. Load it?')) {
							window.location.reload();
						}
					}
				}, false);
			}

			removable = function (count) {
				return (count !== 1);
			};

			// Quick and dirty way to scroll to an element. Code from
			// http://stackoverflow.com/questions/500336/how-to-scroll-to-an-element-in-jquery
			$.fn.extend({
				scrollToMe: function () {
				    var x = $(this).offset().top - 100;
				    $('html,body').animate({scrollTop: x}, 500);
				}
			});
			// Set up the cookie expiration date
			$.cookie.defaults.expires = 365;

			/**
			 * Start the calculations!
			 */
			calculate = function () {
				var results,
					welcomeEl = $('.welcome'),
					resultEl = $('.result');
				// Because the arrays are shared with the outer function, make
				// sure that they are empty before doing anything else.
				people = [];
				bills = [];

				$.each($('#main-form .person'), function (index, el) {
					var name = $(el).find('[name^=name]').val(),
						inDate = $(el).find('[name^=in]').val(),
						outDate = $(el).find('[name^=out]').val();
					people.push(new model.Person(name, inDate, outDate));
				});
				$.each($('#main-form .bill'), function (index, el) {
					var forVal = $(el).find('[name^=for]').val(),
						start = $(el).find('[name^=start]').val(),
						end = $(el).find('[name^=end]').val(),
						total = parseFloat($(el).find('[name^=total]').val());
					bills.push(new model.Bill(forVal, total, start, end));
				});
				results = split.calculate(bills, people);
				$.each(results, function (index, result) {
					result.index = index;
				});
				resultEl.html(Mustache.render(resultSrc, { "people": results }));
				// resultEl.show('drop', {}, 'slow');
				if (welcomeEl.is(':visible')) {
					welcomeEl.fadeOut("fast", function () {
						// So that it appears smoothly after the welcome div
						// fades out
						resultEl.fadeIn("slow");
					});
				} else {
					resultEl.fadeIn("slow");
				}
				resultEl.scrollToMe();
				return results;
			};

			$('#main-form').html(formTmpl);

			$('form').on("click", ".remove", {}, function (e) {
				e.preventDefault();
				$(this).parent().remove();
			});

			/**
			 * Initialize bootstrap-datepicker on a certain element. This will 
			 * check for all alements with class moment inside the input element
			 * and initialize datepicker on them.
			 * @param (HTMLElement) el the element to initialize datepicker on.
			 */
			initializeDatepicker = function (el) {
				var dateFields = $(el).find(".moment");
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
				defContext = { personId: peopleCount, removable: removable(peopleCount) };
				$.extend(context, defContext);
				tmpl = Mustache.render(personRowSrc, context);
				initializeDatepicker($(tmpl).appendTo($('.people')));
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
				initializeDatepicker($(tmpl).appendTo($('.bills')));
			});

			$('.result').on('click', '.result-details', function (e) {
				e.preventDefault();
				$($(this).data('toggle')).toggle();
			});
			$('.result').on('click', '.save', function (e) {
				e.preventDefault();
				if (people) {
					$.cookie('people',
						JSON.stringify(people, util.peopleReplacer));
					$('.result .save-completed').show();
				}
			});
			if ($.cookie('people')) {
				$.each(JSON.parse($.cookie('people')), function (index, person) {
					$('#more-people').trigger("click", {
						"name": person.name,
						"in": person["in"],
						"out": person.out
					});
				});
			} else {
				$('#more-people').trigger("click");
				$('#more-people').trigger("click");
			}
			if ($.cookie('bills')) {
				$.each(JSON.parse($.cookie('bills')), function (index, bill) {
					$('#more-bills').trigger("click", {
						"for": bill['for'],
						"total": bill.total,
						"start": bill.start,
						"end": bill.end
					});
				});
			} else {
				$('#more-bills').trigger("click");
			}
			// Validations on the form
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
					results = calculate();
				},
				invalidHandler: function () {},
				highlight: function (label) {
					$(label).closest('.control-group').addClass('error');
				},
				unhighlight: function (label) {
					$(label).closest('.control-group').removeClass('error');
				}
			});
			return {};
		});
}());