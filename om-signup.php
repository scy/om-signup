<?php
/*
Plugin Name: om signup
Description: Event signup for the openmind conferences.
Version: 0.2.0
Author: Tim Weber
*/

// HEY H4X0R!
// Ja, die Checks hier im Code sind suboptimal. Aber das ganze Ding ist nichts
// weiter als ein großer Form-Mailer. Wir kriegen eine Mail und bearbeiten sie
// manuell. Den Preis von irgendwas verändern ist also möglich, fällt aber auf.
// Hier gibt es nichts zu holen, investier deine Energie in was anderes. :)

function omsignup_install() {
	global $wpdb;
	$tables = array(
		'order' => "
			code char(6) NOT NULL  PRIMARY KEY,
			created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
			remote_addr varchar(39) NOT NULL,
			data blob NOT NULL
		",
	);
	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
	foreach ($tables as $table => $columns) {
		$query = "CREATE TABLE {$wpdb->prefix}omsignup_$table (\n"
			   . trim(str_replace("\t", '', $columns))
			   . "\n);";
		dbDelta($query);
	}
	add_option('omsignup_db_version', '0.1.0');
}

function omsignup_content($matches) {
	if (isset($_GET['omsignup_success']) && preg_match('/^[A-Z]{6}$/', $_GET['omsignup_success'])) {
		$id = $_GET['omsignup_success'];
		$html  = '<div class="om-signup-success">';
		$html .= '<p>Deine Bestellung wurde erfolgreich gespeichert und trägt die Kennung <strong>' . $id . '</strong>. ';
		$html .= 'Alle weiteren Informationen hast du per E-Mail zugesandt bekommen.</p>';
		$html .= '<p>Vielen Dank für deine Anmeldung. Wir sehen uns auf der openmind!</p>';
		return $html;
	}
	$html = file_get_contents(dirname(__FILE__) . '/template.html');
	$products = preg_replace('/ +/', ' ', trim($matches[1]));
	$html = str_replace('data-products=""', "data-products=\"$products\"", $html);
	$html = str_replace('"om13-shirts-website.png"', '"' . omsignup_base() . '/om13-shirts-website.png"', $html);
	return $html;
}

function omsignup_content_filter($content) {
	return preg_replace_callback('/(?:<p>)?\[om-signup([A-Za-z0-9._ -]*)\](?:<\/p>)?/', 'omsignup_content', $content);
}

function omsignup_base() {
	$base = trailingslashit(get_bloginfo('wpurl'))
	      . PLUGINDIR . '/'
	      . dirname(plugin_basename(__FILE__));
	return $base;
}

function omsignup_scripts() {
	$base = omsignup_base();
	wp_enqueue_script(
		'omsignup_form',
		"$base/om-signup.js",
		'om13-jquery',
		false,
		true
	);
	wp_enqueue_style(
		'omsignup_style',
		"$base/om-signup.css"
	);
}

function omsignup_sanitize_data($data) {
	if (!is_array($data)) {
		return false;
	}
	$meta = array(
		'name' => '[a-zA-Z0-9]',
		'street' => '[a-zA-Z0-9]',
		'city' => '[a-zA-Z0-9]',
		'email' => '.*[a-zA-Z0-9].*@.*[a-zA-Z0-9].*',
		'comment' => '.*',
	);
	$posrules = array(
		'code' => '^[A-Za-z0-9._-]+$',
		'name' => '[a-zA-Z0-9]',
		'gender' => '^(er|sie|es|kein)$',
		'color' => '^(schwarz|stein)$',
		'size' => '^(S|M|L|[2-4]?XL)$',
		'twitter' => '.*',
	);
	foreach ($meta as $key => $regex) {
		if (!isset($data[$key]) || !is_string($data[$key]) || !preg_match("/$regex/", $data[$key])) {
			return false;
		}
		$data[$key] = strtr(trim($data[$key]), "\r\n\t", '   ');
	}
	if (!isset($data['positions']) || !is_array($data['positions']) || count($data['positions']) == 0) {
		return false;
	}
	$cleanpos = array();
	foreach ($data['positions'] as $pos) {
		foreach ($posrules as $key => $regex) {
			if (!isset($pos[$key])) {
				continue;
			}
			if (!is_string($pos[$key]) || !preg_match("/$regex/", $pos[$key])) {
				return false;
			}
			$pos[$key] = strtr(trim($pos[$key]), "\r\n\t", '   ');
		}
		if (!isset($pos['price']) || !is_numeric($pos['price']) || !preg_match('/^[1-9][0-9]*$/', $pos['price'])) {
			return false;
		}
		$cleanpos[] = $pos;
	}
	$data['positions'] = $cleanpos;
	return $data;
}

function omsignup_detect_submission() {
	global $wpdb;
	if (!isset($_POST['om-signup-data'])) {
		// Don’t care.
		return false;
	}
	$chars = 'BCDFGHJKLMNPQRSTVWXYZ';
	$data = json_decode($_POST['om-signup-data'], true);
	if ($data === null) {
		$data = json_decode(stripslashes($_POST['om-signup-data']), true);
	}
	if (($data = omsignup_sanitize_data($data)) === false) {
		return false;
	}
	$row = array(
		'remote_addr' => $_SERVER['REMOTE_ADDR'],
		'data' => json_encode($data),
	);
	$success = false;
	for ($try = 0; $try < 50; $try++) {
		$id = '';
		for ($i = 0; $i < 6; $i++) {
			$id .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
		}
		$row['code'] = $id;
		if ($wpdb->insert("{$wpdb->prefix}omsignup_order", $row) !== false) {
			$success = true;
			break;
		}
	}
	omsignup_success_mail($data['email'], $id, $data, false);
	omsignup_success_mail('scy-om13-signup#scy.name', $id, $data, true);
	omsignup_success_mail('tickets#openmind-konferenz.de', $id, $data, true);
	$permalink = get_permalink();
	$permalink .= (strpos($permalink, '?') === false)
	            ? "?omsignup_success=$id"
	            : "&omsignup_success=$id";
	wp_redirect($permalink, 303);
}

function omsignup_success_mail($to, $id, $data, $raw = false) {
	$names = array(
		'UBER-EB' => 'om13 mit Übernachtung (Early Bird)',
		'UBER' => 'om13 mit Übernachtung',
		'UBER-FT' => 'om13 mit Übernachtung (meine erste openmind)',
		'UBER-ST' => 'om13 mit Übernachtung (Supporter-Ticket)',
		'KONF' => 'om13 ohne Übernachtung',
		'KONF-FT' => 'om13 ohne Übernachtung (meine erste openmind)',
		'KONF-ST' => 'om13 ohne Übernachtung (Supporter-Ticket)',
		'SHIRT' => 'om13 T-Shirt',
	);
	$sum = 0;
	$to = str_replace('#', '@', $to);
	$text  = "Hallo {$data['name']},\n\n";
	$text .= "vielen Dank für deine Anmeldung für die openmind #om13!\n\n";
	$text .= "Folgendes hast du bestellt:\n\n";
	foreach ($data['positions'] as $pos) {
		$sum += $pos['price'];
		$name = isset($names[$pos['code']])
		      ? $names[$pos['code']]
		      : $pos['code'];
		$more = ($pos['code'] == 'SHIRT')
		      ? ((($pos['gender'] == 'kein')
		         ? 'Unisex'
		         : 'Girlie'
		         ) . ' ' . $pos['color'] . ' ' . $pos['size'])
		      : $pos['name'];
		$text .= sprintf("%5d€  %s  (%s)\n",
			$pos['price'],
			$name,
			$more
		);
	}
	$text .= "\nBitte überweise den Gesamtbetrag von {$sum}€ innerhalb einer Woche auf unser Konto:\n\n";
	$text .= "   Piratenpartei Deutschland\n";
	$text .= "   Konto 7006027903\n";
	$text .= "   BLZ 43060967 (GLS-Bank)\n";
	$text .= "   Verwendungszweck: om13 $id\n\n";
	$text .= "Falls du diese Mail fälschlicherweise erhalten und gar nichts bestellt hast, musst du dich nicht weiter darum kümmern. Nicht bezahlte Tickets werden nach einer gewissen Zeit wieder storniert.\n\n";
	$text .= "Bei Fragen stehen wir dir unter tickets@openmind-konferenz.de gern zur Verfügung. Bitte gib unbedingt immer deine Bestell-ID an, sie lautet: $id\n\n";
	$text .= "Wir freuen uns auf deinen Besuch!\n\n";
	$text .= "     Dein openmind-Team\n\n";
	if ($raw) {
		$text .= "\n\n" . implode("\t", array(
			$id,
			'offen',
			$data['name'],
			$data['street'],
			$data['city'],
			$data['email'],
			$data['comment'],
		)) . "\n\n";
		$posnr = 1;
		foreach ($data['positions'] as $pos) {
			$text .= implode("\t", array(
				$id,
				$posnr++,
				$pos['code'],
				$pos['price'],
				isset($pos['name']) ? $pos['name'] : '',
				$pos['gender'],
				isset($pos['color']) ? $pos['color'] : '',
				isset($pos['size']) ? $pos['size'] : '',
				isset($pos['twitter']) ? $pos['twitter'] : '',
			)) . "\n";
		}
		$text .= "\n";
	}
	$text = str_replace("\n", "\r\n", $text);
	return wp_mail($to, "openmind #om13: Deine Anmeldung $id", $text, array(
		"From: openmind #om13 <tickets@openmind-konferenz.de>",
		"Content-Type: text/plain; charset=UTF-8",
	));
}

register_activation_hook(__FILE__, 'omsignup_install');

add_filter('the_content', 'omsignup_content_filter');
add_action('template_redirect', 'omsignup_detect_submission');
add_action('wp_print_scripts', 'omsignup_scripts');
