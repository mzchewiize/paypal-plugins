<?php
/**
 Paypal provide by MZCHEWIIZE 
 Date Jun 15,2016
 */

// require main directories
if ( ! function_exists('write_log')) {
   function write_log ( $log )  {
      if ( is_array( $log ) || is_object( $log ) ) {
         error_log( print_r( $log, true ) );
      } else {
         error_log( $log );
      }
   }
}

require_once(dirname(__file__).'/includes/class_main_settings.php');
require_once(dirname(__file__).'/includes/class_main_directory.php');
register_activation_hook( __FILE__, array( 'main_directory', 'install' ) );
require_once(dirname(__file__).'/includes/class_main_shortcode.php');

