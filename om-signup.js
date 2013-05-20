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
	var $container = null, $catalogue = null, $cart = null, $total = null;
	var tplID = 0;
	var setTplIDs = function ($prod) {
		var tplIDIncreased = false;
		$prod.find('[name], [id]').each(function (idx, el) {
			var $el = $(el);
			$.each(['name', 'id'], function (idx, attrName) {
				var attr = $el.attr(attrName);
				if (typeof attr != 'undefined' && attr.match(/-TPL[0-9]*-/)) {
					if (!tplIDIncreased) {
						tplIDIncreased = true;
						tplID++;
					}
					$el.attr(attrName, attr.replace(/-TPL[0-9]*-/g, '-TPL' + tplID + '-'));
				}
			});
		});
	};
	var createProductDiv = function (info) {
		var $div = $('#om-signup-' + info.type).clone();
		$div.removeAttr('id');
		$div.data(info);
		$div.find('h3').text(info.name);
		$div.find('.om-signup-price').text((
			info.priceEditable ? '≥ ' : ''
		) + info.price + " €");
		$div.addClass('om-signup-price-' + (
			info.priceEditable ? '' : 'not-'
		) + 'editable');
		$div.find('.om-signup-desc').text(info.desc);
		$div.find('.om-signup-price-row input').change(priceHandler);
		$div.find('.om-signup-add button').click(addHandler);
		$div.find('.om-signup-del button').click(delHandler);
		setTplIDs($div);
		$div.removeClass('om-signup-template').appendTo($catalogue);
	};
	var addHandler = function (ev) {
		var $this = $(this);
		var $product = $this.closest('.om-signup-product').clone(true);
		setTplIDs($product);
		$product.hide();
		$product.appendTo($cart);
		$product.slideDown();
		updateTotal();
		$this.text('OK, hinzugefügt!');
		setTimeout(function () {
			$this.text('hinzufügen');
		}, 3000);
	};
	var delHandler = function (ev) {
		var $product = $(this).closest('.om-signup-product');
		$product.data('price', 0);
		$product.slideUp(function () {
			$product.remove();
		});
		updateTotal();
	};
	var priceHandler = function (ev) {
		var $this = $(this);
		var $product = $this.closest('.om-signup-product');
		$this.val($this.val().replace(/[^0-9]/, ''));
		var price = parseInt($this.val(), 10);
		if (price < $product.data('minPrice')) {
			price = $product.data('minPrice');
			$this.val(price);
		}
		$product.data('price', price);
		$product.find('.om-signup-price').text(price + ' €');
		updateTotal();
	};
	var updateTotal = function () {
		var sum = 0;
		$cart.find('.om-signup-product').each(function (idx, el) {
			sum += $(el).data('price');
		});
		$total.text(sum);
	};
	$(function () {
		$container = $('#om-signup');
		$catalogue = $('#om-signup-catalogue');
		$cart = $('#om-signup-cart');
		$total = $container.find('.om-signup-total-sum')
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
				info.minPrice = info.price;
				createProductDiv(info);
			}
		});
	});
})(jQuery);