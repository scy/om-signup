(function ($) {
	'use strict';
	var UBERdesc = 'Teilnahme an der Konferenz und Übernachtung in der Jugendherberge.';
	var KONFdesc = 'Teilnahme an der Konferenz, selbst organisierte Übernachtung.';
	var FTdesc = ' Reserviertes Kontingent für Leute, die noch nie an einer openmind teilgenommen haben.';
	var STdesc = ' Von dir festlegbarer Preis ohne Obergrenze. Für Leute, die freiwillig mehr bezahlen möchten, um unser Budget für Referenten und Sozialtickets aufzustocken.';
	var catalogue = {
		'UBER-EB': {
			name: 'mit Übernachtung (Early Bird)',
			desc: UBERdesc + ' Reduzierter Preis für die ersten Buchungen.',
			price: 70
		},
		'UBER': {
			name: 'mit Übernachtung',
			desc: UBERdesc,
			price: 90
		},
		'UBER-FT': {
			name: 'mit Übernachtung (meine erste openmind)',
			desc: UBERdesc + FTdesc,
			price: 90
		},
		'UBER-ST': {
			name: 'mit Übernachtung (Supporter-Ticket)',
			desc: UBERdesc + STdesc,
			price: 100,
			priceEditable: true
		},
		'KONF': {
			name: 'ohne Übernachtung',
			desc: KONFdesc,
			price: 33
		},
		'KONF-FT': {
			name: 'ohne Übernachtung (meine erste openmind)',
			desc: KONFdesc + FTdesc,
			price: 33
		},
		'KONF-ST': {
			name: 'ohne Übernachtung (Supporter-Ticket)',
			desc: KONFdesc + STdesc,
			price: 40,
			priceEditable: true
		},
		'SHIRT': {
			name: 'T-Shirt',
			type: 'shirt',
			desc: 'Wunderschönes T-Shirt mit #om13-Logo, um deiner Peergroup zu beweisen, dass du wirklich da warst.',
			price: 25
		}
	};
	var $container = null, $catalogue = null, $cart = null;
	var createProductDiv = function (info) {
		var $div = $('#om-signup-' + info.type).clone();
		$div.removeAttr('id');
		$div.find('h3').text(info.name);
		$div.find('.om-signup-price').text(info.price + "€");
		$div.find('.om-signup-desc').text(info.desc);
		$div.find('.om-signup-config').hide();
		$div.removeClass('om-signup-template').appendTo($catalogue);
	};
	$(function () {
		$container = $('#om-signup');
		$catalogue = $('#om-signup-catalogue');
		$cart = $('#om-signup-cart');
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