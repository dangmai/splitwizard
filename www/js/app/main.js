(function () {
	'use strict';

	define(function (require) {
		var billsJson = require('text!app/bills0809.json'),
			tenantsJson = require('text!app/tenants.json'),
			Mustache = require('mustache'),
			formTemplateSrc = require('text!app/templates/form.html'),
			billRowSrc = require('text!app/templates/bill-row.html'),
			peopleRowSrc = require('text!app/templates/tenant-row.html'),
			$ = require('jquery'),
			split = require('app/split');
			//bills = JSON.parse(billsJson, split.billReviver),
			//tenants = JSON.parse(tenantsJson, split.tenantReviver),
			//b = JSON.stringify(bills, split.billReplacer),
			//t = JSON.stringify(tenants, split.tenantReplacer);
		//tenants = split.calculate(bills, tenants);
		
		var	peopleCount = 0,
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
			var tenantsJson = [];
			var billsJson = [];
			$.each($('.main-form tr[id^=person]'), function(index, el) {
				var name = $(el).find('.name').val(),
					inDate = $(el).find('.in').val(),
					outDate = $(el).find('.out').val();
				if (split.peopleValidator(name, inDate, outDate) === true) {
					tenantsJson.push({"name": name, "in": inDate, "out": outDate});
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
			var tenants = JSON.parse(JSON.stringify(tenantsJson), split.tenantReviver);
			split.calculate(bills, tenants);
		});
		
		$('#more-people').trigger("click", {"name": "DangMai", "in": "2012-08-05", "out": "2012-09-05"});
		$('#more-people').trigger("click",{"name": "Saqib", "in": "2012-08-05", "out": "2012-09-05"});
		
		$('#more-bills').trigger("click",{"for":"Electricity", "total": 30, "start": "2012-08-06", "end": "2012-09-03"});
		//$('#more-bills').trigger("click",{});
	});
}());