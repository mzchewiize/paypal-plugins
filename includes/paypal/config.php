<?php
require_once('../wp-blog-header.php');

$this->mb_option_setting = get_option('mb_option_name');
$this->PPL_API_USER = $this->mb_option_setting['PPL_API_USER'];
$this->PPL_API_PASSWORD = $this->mb_option_setting['PPL_API_PASSWORD'];
$this->PPL_API_SIGNATURE = $this->mb_option_setting['PPL_API_SIGNATURE'];
$this->PPL_RETURN_URL = $this->mb_option_setting['PPL_RETURN_URL'];
$this->PPL_CANCEL_URL = $this->mb_option_setting['PPL_CANCEL_URL'];
$this->PPL_CURRENCY_CODE = $this->mb_option_setting['PPL_CURRENCY_CODE'];
	
  if (session_status() == PHP_SESSION_NONE) { session_start(); } 
	// sandbox or live
	define('PPL_MODE', 'sandbox');

	if(PPL_MODE=='sandbox'){
		
		define('PPL_API_USER', $this->PPL_API_USER);
		define('PPL_API_PASSWORD', $this->PPL_API_PASSWORD);
		define('PPL_API_SIGNATURE', $this->PPL_API_SIGNATURE);
	}
	else{
		define('PPL_API_USER', $this->PPL_API_USER);
		define('PPL_API_PASSWORD', $this->PPL_API_PASSWORD);
		define('PPL_API_SIGNATURE', $this->PPL_API_SIGNATURE);
	}
	
	define('PPL_LANG', 'EN');
	define('PPL_RETURN_URL', $this->PPL_RETURN_URL);
	define('PPL_CANCEL_URL', $this->PPL_CANCEL_URL);
	define('PPL_CURRENCY_CODE', $this->PPL_CURRENCY_CODE);
