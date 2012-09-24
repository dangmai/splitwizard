(function () {
	'use strict';

	define(function (require) {
		var Mustache = require('mustache'),
			formTemplateSrc = require('text!app/templates/form.html'),
			billRowSrc = require('text!app/templates/bill-row.html'),
			peopleRowSrc = require('text!app/templates/person-row.html'),
			resultSrc = require('text!app/templates/result.html'),
			$ = require('jquery'),
			split = require('app/split');
		require("jquery.validate");
		require("domReady!");
		require("bootstrap-datepicker");
		
		var	peopleCount = 0,
			billCount = 0,
			removable = function(count) {
				return !(count === 1);
			},
			formTmpl = Mustache.render(formTemplateSrc);
			
		$('.main-form-wrapper').html(formTmpl);

		/**
		 * Start the calculations!
		 */
		var calculate = function() {
			console.log("Calculate called");
			var people = [];
			var bills = [];
			$.each($('#main-form tr[id^=person]'), function(index, el) {
				var name = $(el).find('[name^=name]').val(),
					inDate = $(el).find('[name^=in]').val(),
					outDate = $(el).find('[name^=out]').val();
				people.push(split.personify({"name": name, "in": inDate, "out": outDate}));
			});
			$.each($('#main-form tr[id^=bill]'), function(index, el) {
				var forVal = $(el).find('[name^=for]').val(),
					start = $(el).find('[name^=start]').val(),
					end = $(el).find('[name^=end]').val(),
					total = parseFloat($(el).find('[name^=total]').val());
				bills.push(split.billify({"for": forVal, "start": start, "end": end, "total": total}));
			});
			var results = split.calculate(bills, people);
			$('.result').html(Mustache.render(resultSrc, { "people": results }));
		};

		// Validationa on the form
		$.validator.addMethod("moment", function(value, element) {
			return this.optional(element) || split.validateDate(value);
		}, "Not a date");
		$.validator.addMethod("laterthan", function(value, element, startEl) {
			return this.optional(element) || this.optional($(startEl).get(0)) || (moment(value).diff(moment($(startEl).val())) > 0);
		}, "Sooner than start");
		$.validator.messages.required = $.format("Required");
		$.validator.messages.number = $.format("Not a number");
		var validator = $('#main-form').validate({
			debug: true,
			submitHandler: function(form) {
				//console.log("submithandler");
				calculate();
			},
			invalidHandler: function() {},
			highlight: function(label) {
				$(label).closest('.control-group').addClass('error');
			},
			unhighlight: function(label) {
				$(label).closest('.control-group').removeClass('error');
			},
		});

		$('form').on("click", ".remove", {}, function(e) {
			e.preventDefault();
			$(this).parent().parent().remove();
		});

		/**
		 * Initialize bootstrap-datepicker on a certain element. This will 
		 * check for all alements with class date-field inside the input element
		 * and initialize datepicker on them.
		 * @param (HTMLElement) el the element to initialize datepicker on.
		 */
		var initializeDatepicker = function(el) {
			var dateFields = $(el).find(".date-field");
			dateFields.datepicker({
				format: 'M dd, yyyy'
			});
			dateFields.datepicker().on('changeDate', function(e) {
				$('#main-form').valid();
			});
		};
		$('#more-people').click(function(e, context) {
			e.preventDefault();
			if (!context) context = {};
			peopleCount ++;
			var defContext = { peopleId: peopleCount, removable: removable(peopleCount) };
			$.extend(context, defContext);
			var tmpl = Mustache.render(peopleRowSrc, context);
			initializeDatepicker($(tmpl).appendTo($('#people-table')));		
		});
		$('#more-bills').click(function(e, context) {
			e.preventDefault();
			if (!context) context = {};
			billCount ++;
			var defContext = { billId : billCount, removable: removable(billCount) };
			$.extend(context, defContext);
			var tmpl = Mustache.render(billRowSrc, context)
			initializeDatepicker($(tmpl).appendTo($('#bills-table')));
		});
		
		
		$('#more-people').trigger("click", {"name": "Dang Mai", "in": "Aug 05, 2012", "out": "Sept 05, 2012"});
		$('#more-people').trigger("click",{"name": "Saqib", "in": "Aug 05, 2012", "out": "Sept 05, 2012"});
		
		//$('#more-people').trigger("click");
		//$('#more-people').trigger("click");
		
		$('#more-bills').trigger("click",{"for":"Electricity", "total": 30, "start": "Aug 06, 2012", "end": "Sept 03, 2012"});
		$('#more-bills').trigger("click",{"for":"Internet", "total": 60, "start": "Aug 06, 2012", "end": "Sept 03, 2012"});
		//$('#more-bills').trigger("click");
		//$('#more-bills').trigger("click");
		//$('#more-bills').trigger("click",{});
		
	});
}());