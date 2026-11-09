<?php
/**
 * Pedalwise block theme: loads the stylesheet and the small dark mode / current page script.
 * Everything else (colors, fonts, header, footer, templates) is in theme.json, parts/ and templates/.
 */

add_action( 'after_setup_theme', function () {
	add_theme_support( 'wp-block-styles' );
	add_editor_style( 'style.css' );
} );

add_action( 'wp_enqueue_scripts', function () {
	$ver = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'pedalwise-style', get_stylesheet_uri(), array(), $ver );
	wp_enqueue_script( 'pedalwise-theme', get_theme_file_uri( 'assets/theme.js' ), array(), $ver, array( 'in_footer' => true, 'strategy' => 'defer' ) );
} );

// Set the saved (or system) color mode before the page paints, so there is no light flash in dark mode.
add_action( 'wp_head', function () {
	echo "<script>(function(){try{var t=localStorage.getItem('pw-theme');if(!t){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>\n";
}, 1 );
