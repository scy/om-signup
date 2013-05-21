<?php
/*
Plugin Name: om signup
Description: Event signup for the openmind conferences.
Version: 0.1.0
Author: Tim Weber
*/

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
		$html .= '<p>Vielen Dank für deinen Einkauf. Wir sehen uns auf der openmind!</p>';
		return $html;
	}
	$html = file_get_contents(dirname(__FILE__) . '/template.html');
	$products = preg_replace('/ +/', ' ', trim($matches[1]));
	return str_replace('data-products=""', "data-products=\"$products\"", $html);
}

function omsignup_content_filter($content) {
	return preg_replace_callback('/(?:<p>)?\[om-signup([A-Za-z0-9._ -]*)\](?:<\/p>)?/', 'omsignup_content', $content);
}

function omsignup_scripts() {
	$base = trailingslashit(get_bloginfo('wpurl'))
	      . PLUGINDIR . '/'
	      . dirname(plugin_basename(__FILE__));
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

function omsignup_detect_submission() {
	global $wpdb;
	if (!isset($_POST['om-signup-data'])) {
		// Don’t care.
		return false;
	}
	$chars = 'BCDFGHJKLMNPQRSTVWXYZ';
	$postvar = get_magic_quotes_gpc()
	         ? stripslashes($_POST['om-signup-data'])
	         : $_POST['om-signup-data'];
	$data = json_decode($postvar, true);
	if (!is_array($data)) {
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
	$permalink = get_permalink();
	$permalink .= (strpos($permalink, '?') === false)
	            ? "?omsignup_success=$id"
	            : "&omsignup_success=$id";
	wp_redirect($permalink, 303);
}

register_activation_hook(__FILE__, 'omsignup_install');

add_filter('the_content', 'omsignup_content_filter');
add_action('template_redirect', 'omsignup_detect_submission');
add_action('wp_print_scripts', 'omsignup_scripts');
