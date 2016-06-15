<?php
include_once("config.php");
include_once("functions.php");
include_once("paypal.class.php");

	$paypal= new MyPayPal();
	$amount = 10;//_POST('itemprice');
	$member_id = _POST('member_id');
	
		
	if(_GET('paypal')=='checkout'){
		
		$products = [];
		$products[0]['ItemName'] = _POST('itemname'); //Item Name
		$products[0]['ItemPrice'] = _POST('itemprice'); //Item Price
		$products[0]['ItemNumber'] = _POST('itemnumber'); //Item Number
		$products[0]['ItemDesc'] = _POST('itemdesc'); //Item Number
		$products[0]['ItemQty']	= _POST('itemQty'); // Item Quantity
		$charges = [];		
		$charges['TotalTaxAmount'] = 0;  //Sum of tax for all items in this order. 
		$charges['HandalingCost'] = 0;  //Handling cost for this order.
		$charges['InsuranceCost'] = 0;  //shipping insurance cost for this order.
		$charges['ShippinDiscount'] = 0; //Shipping discount for this order. Specify this as negative number.
		$charges['ShippinCost'] = 0; 

		$paypal->SetExpressCheckOut($products, $charges, $noshipping='1', $member_id, $amount);	
			
	} elseif(_GET('token')!=''&&_GET('PayerID')!='') {
		$paypal->SetCreateProfile();
		$paypal->DoExpressCheckoutPayment();
	
	}
	else{
		
	}
