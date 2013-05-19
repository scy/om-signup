(function ($) {
	'use strict';
	var catalogue = {
		'UBER-EB': {
			name: 'mit Übernachtung (Early Bird)',
			price: 70
		},
		'UBER': {
			name: 'mit Übernachtung',
			price: 90
		},
		'UBER-FT': {
			name: 'mit Übernachtung (meine erste openmind)',
			price: 90
		},
		'UBER-ST': {
			name: 'mit Übernachtung (Supporter-Ticket)',
			price: 100,
			priceEditable: true
		},
		'KONF': {
			name: 'ohne Übernachtung',
			price: 33
		},
		'KONF-FT': {
			name: 'ohne Übernachtung (meine erste openmind)',
			price: 33
		},
		'KONF-ST': {
			name: 'ohne Übernachtung (Supporter-Ticket)',
			price: 40,
			priceEditable: true
		},
		'SHIRT': {
			name: 'T-Shirt',
			type: 'shirt',
			price: 25
		}
	};
	var $container = null;
	var createProductDiv = function (info) {
		var $div = $('#om-signup-' + info.type).clone();
		$div.removeAttr('id');
		$div.find('h3').text(info.name);
		$div.find('.om-signup-config').hide();
		$div.removeClass('om-signup-template').appendTo($container);
	};
	$(function () {
		$container = $('#om-signup');
		var active = $container.data('products').split(' ');
		$.each(active, function (idx, product) {
			if (typeof catalogue[product] != 'undefined') {
				var info = catalogue[product];
				if (typeof info.type == 'undefined') {
					info.type = 'ticket';
				}
				if (typeof info.priceEditable == 'undefined') {
					info.priceEditable = false;
				}
				createProductDiv(info);
			}
		});
	});
})(jQuery);