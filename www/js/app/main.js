(function () {
	'use strict';

	define(function (require) {
		var Mustache = require('mustache'),
			formTemplateSrc = require('text!app/templates/form.html'),
			billRowSrc = require('text!app/templates/bill-row.html'),
			peopleRowSrc = require('text!app/templates/person-row.html'),
			resultSrc = require('text!app/templates/result.html'),
			$ = require('jquery'),
			split = require('app/split'),
			peopleCount = 0,
			billCount = 0,
			removable = function(count) {
				return !(count === 1);
			},
			formTmpl = Mustache.render(formTemplateSrc);
			
		$('.container .main-form').html(formTmpl);
		$('form').on("click", ".remove", {}, function(e) {
			e.preventDefault();
			$(this).parent().parent().remove();
		});
		$('#more-people').click(function(e, context) {
			e.preventDefault();
			if (!context) context = {};
			peopleCount ++;
			var defContext = { peopleId: peopleCount, removable: removable(peopleCount) };
			$.extend(context, defContext);
			$('#people-table').append(Mustache.render(peopleRowSrc, context));
		});
		$('#more-bills').click(function(e, context) {
			e.preventDefault();
			if (!context) context = {};
			billCount ++;
			var defContext = { billId : billCount, removable: removable(billCount) };
			$.extend(context, defContext);
			$('#bills-table').append(Mustache.render(billRowSrc, context));
		});
		$('#calculate').click(function(e) { 
			e.preventDefault();
			var peopleJson = [];
			var billsJson = [];
			$.each($('.main-form tr[id^=person]'), function(index, el) {
				var name = $(el).find('.name').val(),
					inDate = $(el).find('.in').val(),
					outDate = $(el).find('.out').val();
				if (split.peopleValidator(name, inDate, outDate) === true) {
					peopleJson.push({"name": name, "in": inDate, "out": outDate});
				}
			});
			$.each($('.main-form tr[id^=bill]'), function(index, el) {
				var forVal = $(el).find('.for').val(),
					start = $(el).find('.start').val(),
					end = $(el).find('.end').val(),
					total = parseFloat($(el).find('.total').val());
				if (split.billValidator(forVal, total, start, end) === true) {
					billsJson.push({"for": forVal, "start": start, "end": end, "total": total});
				}
			});
			var bills = JSON.parse(JSON.stringify(billsJson), split.billReviver);
			var people = JSON.parse(JSON.stringify(peopleJson), split.peopleReviver);
			var results = split.calculate(bills, people);
			$('.result').html(Mustache.render(resultSrc, { "people": results }));
		});		
		
		$('#more-people').trigger("click", {"name": "Dang Mai", "in": "2012-08-05", "out": "2012-09-05"});
		$('#more-people').trigger("click",{"name": "Saqib", "in": "2012-08-05", "out": "2012-09-05"});
		
		$('#more-bills').trigger("click",{"for":"Electricity", "total": 30, "start": "2012-08-06", "end": "2012-09-03"});
		$('#more-bills').trigger("click",{"for":"Internet", "total": 60, "start": "2012-08-06", "end": "2012-09-03"});
		//$('#more-bills').trigger("click",{});
	});
}());