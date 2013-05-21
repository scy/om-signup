if(typeof JSON!=="object"){JSON={}}(function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){escapable.lastIndex=0;return escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t==="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];if(a&&typeof a==="object"&&typeof a.toJSON==="function"){a=a.toJSON(e)}if(typeof rep==="function"){a=rep.call(t,e,a)}switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a){return"null"}gap+=indent;u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1){u[n]=str(n,a)||"null"}i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]";gap=o;return i}if(rep&&typeof rep==="object"){s=rep.length;for(n=0;n<s;n+=1){if(typeof rep[n]==="string"){r=rep[n];i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}else{for(r in a){if(Object.prototype.hasOwnProperty.call(a,r)){i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}";gap=o;return i}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;if(typeof JSON.stringify!=="function"){JSON.stringify=function(e,t,n){var r;gap="";indent="";if(typeof n==="number"){for(r=0;r<n;r+=1){indent+=" "}}else if(typeof n==="string"){indent=n}rep=t;if(t&&typeof t!=="function"&&(typeof t!=="object"||typeof t.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":e})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i==="object"){for(n in i){if(Object.prototype.hasOwnProperty.call(i,n)){r=walk(i,n);if(r!==undefined){i[n]=r}else{delete i[n]}}}}return reviver.call(e,t,i)}var j;text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})();
(function ($) {
	'use strict';
	var UBERdesc = 'Teilnahme an der Konferenz und Übernachtung in der Jugendherberge.';
	var KONFdesc = 'Teilnahme an der Konferenz, selbst organisierte Übernachtung.';
	var FTdesc = ' Reserviertes Kontingent für Leute, die noch nie an einer openmind teilgenommen haben.';
	var STdesc = ' Von dir festlegbarer Preis ohne Obergrenze. Für Leute, die freiwillig mehr bezahlen möchten, um unser Budget für Referent*innen und Sozialtickets aufzustocken.';
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
	var $container = null, $catalogue = null, $cart = null, $total = null, $ordermeta = null;
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
		if (ticketsInCart() >= 5) {
			alert('Du kannst leider nicht mehr als fünf Tickets auf einmal bestellen.');
			return;
		}
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
		if (sum === 0) {
			$ordermeta.hide();
		} else {
			$ordermeta.show();
		}
		$total.text(sum);
	};
	var ticketsInCart = function () {
		var count = 0;
		$cart.find('.om-signup-product').each(function (idx, el) {
			if ($(el).data('type') == 'ticket') {
				count++;
			}
		});
		return count;
	};
	var validator = {
		'ticket': function ($p) {
			var e = [];
			if ($p.data('priceEditable')) {
				var val = parseInt($p.find('.om-signup-price-field').val(), 10);
				if (isNaN(val) || val < $p.data('minPrice')) {
					e.push('Bitte gib einen Wunschpreis von mindestens ' + $p.data('minPrice') + '€ an.');
				}
			}
			if (!$p.find('.om-signup-name-field').val().match(/[a-zA-Z0-9]/)) {
				e.push('Bitte gib einen Namen für dein Namensschild an. Du musst es ja nicht tragen.');
			}
			if ($p.find('select').val() === '') {
				e.push('Bitte wähle ein Pronomen aus, mit dem du angesprochen werden willst.');
			}
			return e;
		},
		'shirt': function ($p) {
			var e = [];
			if ($p.find('select').val() === '') {
				e.push('Bitte wähle Schnitt und Größe aus.');
			}
			if ($p.find('input:checked').length === 0) {
				e.push('Bitte wähle die Farbe aus.');
			}
			return e;
		},
		'meta': function ($p) {
			var e = [];
			if (!$p.find('[name="om-signup-order-name"]').val().match(/[a-zA-Z0-9]/)) {
				e.push('Bitte gib uns deinen bürgerlichen Namen an, damit wir eine Rechnung erstellen können – sowohl für dich als auch für uns.');
			}
			if (!$p.find('[name="om-signup-order-street"]').val().match(/[a-zA-Z0-9]/)) {
				e.push('Bitte gib deine Straße und Hausnummer für die Rechnung an.');
			}
			if (!$p.find('[name="om-signup-order-city"]').val().match(/[a-zA-Z0-9]/)) {
				e.push('Bitte gib deine Postleitzahl und deinen Wohnort für die Rechnung an.');
			}
			if (!$p.find('[name="om-signup-order-email"]').val().match(/[a-zA-Z0-9]@[a-zA-Z0-9]/)) {
				e.push('Bitte gib unbedingt eine gültige E-Mail-Adresse an, damit wir dich erreichen und dir dein Ticket zusenden können!');
			}
			return e;
		}
	};
	var validateAll = function () {
		var errCount = 0;
		$('.om-signup-error').remove();
		$cart.find('.om-signup-product').add('#om-signup-ordermeta').each(function (idx, el) {
			var $p = $(el);
			if (typeof validator[$p.data('type')] == 'function') {
				var errors = validator[$p.data('type')]($p);
				if ($.isArray(errors) && errors.length > 0) {
					errCount += errors.length;
					var err = $('<div>').addClass('om-signup-error');
					var ul = $('<ul>').appendTo(err);
					$.each(errors, function (idx, errText) {
						$('<li>').text(errText).appendTo(ul);
					});
					err.insertAfter($p.find('.om-signup-desc'));
				}
			}
		});
		if (errCount) {
			alert('Es gibt Probleme mit deiner Eingabe. Bitte prüfe deine Bestellung nochmal.');
			return false;
		}
		return true;
	};
	$(function () {
		$container = $('#om-signup');
		$catalogue = $('#om-signup-catalogue');
		$cart = $('#om-signup-cart');
		$total = $container.find('.om-signup-total-sum');
		$ordermeta = $('#om-signup-ordermeta');
		$('.om-signup-submit').click(function () {
			if (!validateAll()) {
				return false;
			}
			var post = {positions:[]};
			post.name = $ordermeta.find('[name="om-signup-order-name"]').val();
			post.street = $ordermeta.find('[name="om-signup-order-street"]').val();
			post.city = $ordermeta.find('[name="om-signup-order-city"]').val();
			post.email = $ordermeta.find('[name="om-signup-order-email"]').val();
			post.comment = $ordermeta.find('[name="om-signup-order-comment"]').val();
			$cart.find('.om-signup-product').each(function (idx, el) {
				var $p = $(el);
				var type = $p.data('type');
				if (type == 'ticket') {
					post.positions.push({
						code: $p.data('code'),
						price: $p.data('price'),
						name: $p.find('.om-signup-name-field').val(),
						gender: $p.find('select').val(),
						twitter: $p.find('.om-signup-twitter-field').val()
					});
				}
				if (type == 'shirt') {
					post.positions.push({
						code: $p.data('code'),
						price: $p.data('price'),
						gender: $p.find('select').val().replace(/-.*$/, ''),
						size: $p.find('select').val().replace(/^.*-/, ''),
						color: $p.find('input:checked').val()
					});
				}
			});
			$container.find('[type="hidden"]').val(JSON.stringify(post));
			$container.find('form').submit();
		});
		var active = $container.data('products').split(' ');
		$.each(active, function (idx, product) {
			if (typeof catalogue[product] != 'undefined') {
				var info = catalogue[product];
				info.code = product;
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