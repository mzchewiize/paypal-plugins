<?php
require_once('../wp-blog-header.php');
	class MyPayPal {
		
		function GetItemTotalPrice($item){
		
			return $item['ItemPrice'] * $item['ItemQty']; 
		}
		
		function GetProductsTotalAmount($products){
		
			$ProductsTotalAmount=0;

			foreach($products as $p => $item){
				
				$ProductsTotalAmount = $ProductsTotalAmount + $this -> GetItemTotalPrice($item);	
			}
			
			return $ProductsTotalAmount;
		}
		
		function SaveBuyerInfoIntoDatabase($httpParsedResponseAr)
		{
			 $this->mb_option_setting = json_decode(json_encode(get_option('mb_option_name')), true);
      		$this->mb_account_page = $this->mb_option_setting['mb_account_page'];
			$member_auto_id = urldecode($httpParsedResponseAr["PAYMENTREQUEST_0_CUSTOM"]);
			$transaction_id =  urldecode($httpParsedResponseAr["TOKEN"]);
			$checkout_status = urldecode($httpParsedResponseAr["CHECKOUTSTATUS"]);
			$checkout_timestamp = urldecode($httpParsedResponseAr["TIMESTAMP"]);
			$email =  urldecode($httpParsedResponseAr["EMAIL"]);
			$payer_id =  urldecode($httpParsedResponseAr["PAYERID"]);
			$payer_status = urldecode($httpParsedResponseAr["PAYERSTATUS"]);
			$payer_firstname = urldecode($httpParsedResponseAr["FIRSTNAME"]);
			$payer_lastname = urldecode($httpParsedResponseAr["LASTNAME"]);
			$country_code = urldecode($httpParsedResponseAr["COUNTRYCODE"]);
			$currency_code = urldecode($httpParsedResponseAr["CURRENCYCODE"]);
			$amount = urldecode($httpParsedResponseAr["AMT"]);
			$item_amt = urldecode($httpParsedResponseAr["ITEMAMT"]);
			$package = urldecode($httpParsedResponseAr["L_NAME0"]);
			$package_code =  urldecode($httpParsedResponseAr["L_NUMBER0"]);
		
			global $wpdb;
  			
  			$payment_table_name = $wpdb->prefix.'mb_global_payments';
			$post_array = array($transaction_id, $checkout_status, $checkout_timestamp, $email,
	        $payer_id, $payer_status, $payer_firstname, $payer_lastname,
	        $country_code, $currency_code, $amount, $item_amt,
	        $package, $package_code );

	        $purchased_package = $wpdb->query($wpdb->prepare("INSERT INTO ".$payment_table_name."
	        (
	         transaction_id, checkout_status, checkout_timestamp, email,
	         payer_id, payer_status, payer_firstname, payer_lastname,
	         country_code, currency_code, amount, item_amt,
	         package, package_code

	        ) VALUES ( 
	        	%s, %s, %s, %s,
	        	%s, %s, %s, %s, 
	        	%s, %s, %s, %s, 
	        	%s, %s  )"
	        	,  $post_array ));

				// update to member profile
			$exp_date = date('Y-m-d', strtotime("+30 days"));
	        $last_active = current_time('timestamp');
			$main_table_name = $wpdb->prefix.'mb_global_directory_members';            
			$update_sql = "UPDATE $main_table_name SET level = %s, exp_date =%s, last_active =%s WHERE member_id = %s";
			$update_output = $wpdb->query($wpdb->prepare($update_sql, $package, $exp_date , $last_active, 
				$member_auto_id));

			if ($purchased_package) {
				wp_redirect($this->mb_account_page);
			}
		}

		function GetGrandTotal($products, $charges){
			
			//Grand total including all tax, insurance, shipping cost and discount
			
			$GrandTotal = $this -> GetProductsTotalAmount($products);
			
			foreach($charges as $charge){
				
				$GrandTotal = $GrandTotal + $charge;
			}
			
			return $GrandTotal;
		}
		
		function SetExpressCheckout($products, $charges, $noshipping='1', $member_id, $amount){
			
			//Parameters for SetExpressCheckout, which will be sent to PayPal
			//
			$padata  = 	'&METHOD=SetExpressCheckout';
			
			$padata .= 	'&RETURNURL='.urlencode(PPL_RETURN_URL);
			$padata .=	'&CANCELURL='.urlencode(PPL_CANCEL_URL);
			$padata .=	'&PAYMENTREQUEST_0_PAYMENTACTION='.urlencode("SALE");
			$padata .= 	'&L_BILLINGTYPE0=RecurringPayments';
			$padata .=  '&L_BILLINGAGREEMENTDESCRIPTION0=FOTAFMEMBERSHIP';
			$padata .=	'&DESC=FOTAFMEMBERSHIP'; 
			$padata .=  '&PAYMENTREQUEST_0_CUSTOM='.$member_id;
				   

			foreach($products as $p => $item){

				
				$padata .=	'&L_PAYMENTREQUEST_0_NAME'.$p.'='.urlencode($item['ItemName']);
				$padata .=	'&L_PAYMENTREQUEST_0_NUMBER'.$p.'='.urlencode($item['ItemNumber']);
				$padata .=	'&L_PAYMENTREQUEST_0_DESC'.$p.'='.urlencode($item['ItemDesc']);
				$padata .=	'&L_PAYMENTREQUEST_0_AMT'.$p.'='.urlencode($item['ItemPrice']);
				$padata .=	'&L_PAYMENTREQUEST_0_QTY'.$p.'='. urlencode($item['ItemQty']);
			}		

			$padata .=	'&NOSHIPPING='.$noshipping; //set 1 to hide buyer's shipping address, in-case products that does not require shipping
			$padata .=	'&PAYMENTREQUEST_0_ITEMAMT='.urlencode($this -> GetProductsTotalAmount($products));
			$padata .=	'&PAYMENTREQUEST_0_TAXAMT='.urlencode($charges['TotalTaxAmount']);
			$padata .=	'&PAYMENTREQUEST_0_SHIPPINGAMT='.urlencode($charges['ShippinCost']);
			$padata .=	'&PAYMENTREQUEST_0_HANDLINGAMT='.urlencode($charges['HandalingCost']);
			$padata .=	'&PAYMENTREQUEST_0_SHIPDISCAMT='.urlencode($charges['ShippinDiscount']);
			$padata .=	'&PAYMENTREQUEST_0_INSURANCEAMT='.urlencode($charges['InsuranceCost']);
			$padata .=	'&PAYMENTREQUEST_0_AMT='.urlencode($this->GetGrandTotal($products, $charges));
			$padata .=	'&PAYMENTREQUEST_0_CURRENCYCODE='.urlencode(PPL_CURRENCY_CODE);
			
			//paypal custom template
			
			$padata .=	'&LOCALECODE='.PPL_LANG; //PayPal pages to match the language on your website;
			$padata .=	'&LOGOIMG='.PPL_LOGO_IMG; //site logo
			$padata .=	'&CARTBORDERCOLOR=FFFFFF'; //border color of cart
			$padata .=	'&ALLOWNOTE=1';
						
			############# set session variable we need later for "DoExpressCheckoutPayment" #######
			
			$_SESSION['ppl_products'] =  $products;
			$_SESSION['ppl_charges'] 	=  $charges;
			$_SESSION['member_id'] = $member_id;
			$_SESSION['amount'] = $amount;
			$_SESSION['start_date'] = date('Y-m-d H:i:s');
			
			$httpParsedResponseAr = $this->PPHttpPost('SetExpressCheckout', $padata);
			
			//Respond according to message we receive from Paypal
			if("SUCCESS" == strtoupper($httpParsedResponseAr["ACK"]) || "SUCCESSWITHWARNING" == strtoupper($httpParsedResponseAr["ACK"])){

				$paypalmode = (PPL_MODE=='sandbox') ? '.sandbox' : '';
			
				//Redirect user to PayPal store with Token received.
				
				$paypalurl ='https://www'.$paypalmode.'.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token='.$httpParsedResponseAr["TOKEN"].'';
				
				header('Location: '.$paypalurl);
			}
			else{
				
				
			}	
		}		
	
	function SetCreateProfile(){
	
		$start_date =_SESSION('start_date');
		$amount =_SESSION('amount');
		$member_id =_SESSION('member_id');
		
		$padata  = 	'&TOKEN='.urlencode(_GET('token'));
		$padata .= 	'&PAYERID='.urlencode(_GET('PayerID'));
		$padata .=	'&USER='.PPL_API_USER;
		$padata .=	'&PWD='.PPL_API_PASSWORD;
		$padata .=	'&SIGNATURE='.PPL_API_SIGNATURE;
		$padata .=	'&METHOD=CreateRecurringPaymentsProfile';
		$padata .=	'&VERSION=86';
		$padata .= 	'&PAYMENTREQUEST_0_PAYMENTACTION='.urlencode("SALE");
		$padata .= 	'&L_BILLINGTYPE0=RecurringPayments';
		$padata .=  '&L_BILLINGAGREEMENTDESCRIPTION0=FOTAFMEMBERSHIP';
		$padata .=	'&PROFILESTARTDATE='.$start_date;  
		$padata .=	'&DESC=FOTAFMEMBERSHIP';    
		$padata .=	'&BILLINGPERIOD=Month';   
		$padata .=	'&BILLINGFREQUENCY=1';    
		$padata .=	'&AMT='.$amount;   
		$padata .=	'&CURRENCYCODE=THB';   
		$padata .=	'&COUNTRYCODE=TH';   
		$padata .=	'&MAXFAILEDPAYMENTS=3';  
		$padata .=  '&PAYMENTREQUEST_0_CUSTOM='.$member_id;
				  

			############# set session variable we need later for "DoExpressCheckoutPayment" #######
			
			$httpParsedResponseAr = $this->PPHttpPost('SetCreateProfile', $padata);
			
			//Respond according to message we receive from Paypal
			if("SUCCESS" == strtoupper($httpParsedResponseAr["ACK"]) || "SUCCESSWITHWARNING" == strtoupper($httpParsedResponseAr["ACK"])){

				$paypalmode = (PPL_MODE=='sandbox') ? '.sandbox' : '';
			
				//Redirect user to PayPal store with Token received.
				
				$paypalurl ='https://www'.$paypalmode.'.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token='.$httpParsedResponseAr["TOKEN"].'';
				
				header('Location: '.$paypalurl);
				
			}
			else{
				
				
			}	
		}	
			
		function DoExpressCheckoutPayment(){
			
			if(!empty(_SESSION('ppl_products'))&&!empty(_SESSION('ppl_charges'))){
				
				$products=_SESSION('ppl_products');
				
				$charges=_SESSION('ppl_charges');
				$start_date =_SESSION('start_date');
				$amount =_SESSION('amount');
				$member_id =_SESSION('member_id');

				$padata  = 	'&TOKEN='.urlencode(_GET('token'));
				$padata .= 	'&PAYERID='.urlencode(_GET('PayerID'));
				$padata .= 	'&PAYMENTREQUEST_0_PAYMENTACTION='.urlencode("SALE");
				$padata .= 	'&L_BILLINGTYPE0=RecurringPayments';
				$padata .=  '&L_BILLINGAGREEMENTDESCRIPTION0=FOTAFMEMBERSHIP';
				$padata .=  '&PROFILESTARTDATE='.$start_date;    #Billing date start, in UTC/GMT format
				$padata .=  '&DESC=FOTAFMEMBERSHIP';    #Profile description - same as billing agreement description
				$padata .=  '&BILLINGPERIOD=Month';    #Period of time between billings
				$padata .=  '&BILLINGFREQUENCY=1';    #Frequency of charges
				$padata .=  '&AMT='.$amount;    #The amount the buyer will pay in a payment period
				$padata .=  '&CURRENCYCODE=THB';    #The currency, e.g. US dollars
				$padata .=  '&COUNTRYCODE=TH';    #The country code, e.g. US
				$padata .=  '&MAXFAILEDPAYMENTS=3';
				$padata .=  '&PAYMENTREQUEST_0_CUSTOM='.$member_id;
				
				foreach($products as $p => $item){
					
					$padata .=	'&L_PAYMENTREQUEST_0_NAME'.$p.'='.urlencode($item['ItemName']);
					$padata .=	'&L_PAYMENTREQUEST_0_NUMBER'.$p.'='.urlencode($item['ItemNumber']);
					$padata .=	'&L_PAYMENTREQUEST_0_DESC'.$p.'='.urlencode($item['ItemDesc']);
					$padata .=	'&L_PAYMENTREQUEST_0_AMT'.$p.'='.urlencode($item['ItemPrice']);
					$padata .=	'&L_PAYMENTREQUEST_0_QTY'.$p.'='. urlencode($item['ItemQty']);
				}
				
				$padata .= 	'&PAYMENTREQUEST_0_ITEMAMT='.urlencode($this -> GetProductsTotalAmount($products));
				$padata .= 	'&PAYMENTREQUEST_0_TAXAMT='.urlencode($charges['TotalTaxAmount']);
				$padata .= 	'&PAYMENTREQUEST_0_SHIPPINGAMT='.urlencode($charges['ShippinCost']);
				$padata .= 	'&PAYMENTREQUEST_0_HANDLINGAMT='.urlencode($charges['HandalingCost']);
				$padata .= 	'&PAYMENTREQUEST_0_SHIPDISCAMT='.urlencode($charges['ShippinDiscount']);
				$padata .= 	'&PAYMENTREQUEST_0_INSURANCEAMT='.urlencode($charges['InsuranceCost']);
				$padata .= 	'&PAYMENTREQUEST_0_AMT='.urlencode($this->GetGrandTotal($products, $charges));
				$padata .= 	'&PAYMENTREQUEST_0_CURRENCYCODE='.urlencode(PPL_CURRENCY_CODE);
				
				//We need to execute the "DoExpressCheckoutPayment" at this point to Receive payment from user.
				
				$httpParsedResponseAr = $this->PPHttpPost('DoExpressCheckoutPayment', $padata);
			

				if("SUCCESS" == strtoupper($httpParsedResponseAr["ACK"]) || "SUCCESSWITHWARNING" == strtoupper($httpParsedResponseAr["ACK"])){
					$this->GetTransactionDetails();
				}
				else{
						
					
				}
			}
			else{
				
				// Request Transaction Details
				
				$this->GetTransactionDetails();
			}
		}
				
		function GetTransactionDetails(){
		
			$padata = 	'&TOKEN='.urlencode(_GET('token'));
			
			$httpParsedResponseAr = $this->PPHttpPost('GetExpressCheckoutDetails', $padata, PPL_API_USER, PPL_API_PASSWORD, PPL_API_SIGNATURE, PPL_MODE);

			if("SUCCESS" == strtoupper($httpParsedResponseAr["ACK"]) || "SUCCESSWITHWARNING" == strtoupper($httpParsedResponseAr["ACK"])){
				
			
				$this->SaveBuyerInfoIntoDatabase($httpParsedResponseAr);

				
			} 
			else  {
				
				
			}
		}
		
		function PPHttpPost($methodName_, $nvpStr_) {
				
				// Set up your API credentials, PayPal end point, and API version.
				$API_UserName = urlencode(PPL_API_USER);
				$API_Password = urlencode(PPL_API_PASSWORD);
				$API_Signature = urlencode(PPL_API_SIGNATURE);
				
				$paypalmode = (PPL_MODE=='sandbox') ? '.sandbox' : '';
		
				$API_Endpoint = "https://api-3t".$paypalmode.".paypal.com/nvp";
				$version = urlencode('109.0');
			
				// Set the curl parameters.
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, $API_Endpoint);
				curl_setopt($ch, CURLOPT_VERBOSE, 1);
				//curl_setopt($ch, CURLOPT_SSL_CIPHER_LIST, 'TLSv1');
				
				// Turn off the server and peer verification (TrustManager Concept).
				curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
				curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
			
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($ch, CURLOPT_POST, 1);
			
				// Set the API operation, version, and API signature in the request.
				$nvpreq = "METHOD=$methodName_&VERSION=$version&PWD=$API_Password&USER=$API_UserName&SIGNATURE=$API_Signature$nvpStr_";
			
				// Set the request as a POST FIELD for curl.
				curl_setopt($ch, CURLOPT_POSTFIELDS, $nvpreq);
			
				// Get response from the server.
				$httpResponse = curl_exec($ch);
			
				if(!$httpResponse) {
					exit("$methodName_ failed: ".curl_error($ch).'('.curl_errno($ch).')');
				}
			
					$httpResponseAr = explode("&", $httpResponse);
			
				$httpParsedResponseAr = array();
		
				foreach ($httpResponseAr as $i => $value) {
					
					$tmpAr = explode("=", $value);
					
					if(sizeof($tmpAr) > 1) {
						
						$httpParsedResponseAr[$tmpAr[0]] = $tmpAr[1];
					}
				}
			
				if((0 == sizeof($httpParsedResponseAr)) || !array_key_exists('ACK', $httpParsedResponseAr)) {
					
					exit("Invalid HTTP Response for POST request($nvpreq) to $API_Endpoint.");
				}
			
			return $httpParsedResponseAr;
		}
	}


