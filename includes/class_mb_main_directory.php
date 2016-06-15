<?php
/**
 Paypal provide by MZCHEWIIZE 
 Date Jun 15,2016
 */
if (!class_exists('main_directory')) {  
    
    class main_directory {

    static $payment_table_name = 'paypal_payment_settings';
    
    
    public function __construct() {
  
    }

    static function install() {

        global $wpdb;
       
        $charset_collate = $wpdb->get_charset_collate();
        $table_payment = $wpdb->prefix . self::$payment_table_name; 
     
        if($wpdb->get_var("show tables like '$table_payment'") != $table_payment) {

            $payment_sql = "CREATE TABLE $table_payment (
            id int(11) NOT NULL AUTO_INCREMENT,
            member_auto_id varchar(100) NOT NULL,
            transaction_id varchar(100) NOT NULL,
            checkout_status varchar(255) NOT NULL,
            checkout_timestamp varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            payer_id varchar(255) NOT NULL,
            payer_status varchar(255) NOT NULL,
            payer_firstname varchar(255) NOT NULL,
            payer_lastname varchar(255) NOT NULL,
            country_code varchar(255) NOT NULL,
            currency_code varchar(255) NOT NULL,
            amount text NOT NULL,
            item_amt text NOT NULL,
            package text NOT NULL,
            package_code text NOT NULL,     
            UNIQUE KEY id (id)
              ) $charset_collate ENGINE=MyISAM";
              require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
            dbDelta($payment_sql);

        }
        
        // move payment folder into position
        $origin_path = plugin_dir_path(__FILE__).'paypal'; 
        $destination_path = get_home_path().'paypal';
        $origin_files = scandir($origin_path);

        if(!is_dir($destination_path)) {
            mkdir($destination_path);
        }
        
        foreach ($origin_files as $move_file) {   
            if ($move_file !='.' || $move_file!='..') {
                $filename = $origin_path.'/'.$move_file;
                $des_filename = $destination_path.'/'.$move_file;
                copy($filename, $des_filename);
            }
        }
    }
  }
} 

$main_directory = new main_directory();
