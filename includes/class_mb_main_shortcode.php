<?php
if (!class_exists('search_shortcode')) { 
 
  class search_shortcode {

    public function __construct() {   
      add_shortcode( 'payment_box', array($this,'payment_form' )); 
    }
    
    public function payment_form() {
  
        $silver_item_name = 'Silver Membership';
        $silver_item_number= '001';
        $silver_itemdesc = 'Two regular theatre tickets to highlisht perfomance during the International Dance Festival';
        $silver_item_price = 1.00;
        //$silver_item_price = 999.00;
        $silver_item_qty = 1;
        
        $gold_item_name = 'Gold Membership';
        $gold_item_number= '002';
        $gold_itemdesc = '6 V.I.P tickets to GALA Per perfomance during the International Dance Festival';
        //$gold_item_price = 9999.00;
        $gold_item_price = 1.00;    
        $gold_item_qty = 1;

        $platinum_item_name = 'Platinum Membership';
        $platinum_item_number= '003';
        $platinum_itemdesc = '20 V.I.P tickets to GALA Per perfomance during the International Dance Festival';
        $platinum_item_price = 1.00;
        //$platinum_item_price = 99999.00;
        
        $platinum_item_qty = 1;
        $tb_header = ' <a name="upgrade_package"><h3>Upgrade package </h3></a><table><tr>';      
        $silver =' 
            <td>
               <label>Silver Membership </label><br/>
               Subscribe for 1 month membership<br/>
               Only 990.00
               <form method="post"   action="../paypal/process.php?paypal=checkout">
                <input type="hidden" name="itemname"    value="'.$silver_item_name.'"/> 
                <input type="hidden" name="itemnumber"  value="'.$silver_item_number.'"/> 
                <input type="hidden" name="itemdesc"    value="'.$silver_itemdesc.'"/> 
                <input type="hidden" name="itemprice"   value="'.$silver_item_price.'"/>
                <input type="hidden" name="itemQty" value="'.$silver_item_qty.'"><br/>
                <input type="hidden" name="member_id" value="'.$_SESSION['session_code'].'"/>
                <input class="dw_button" type="submit" name="submitbutt" value="Upgrade" />
              </form>
              </td>';
         $gold = ' <td>  
               <label>Gold Membership </label><br/>
               Subscribe for 1 month membership<br/>
              Only 9,999.00
              <form method="post" action="../paypal/process.php?paypal=checkout">
                <input type="hidden" name="itemname"    value="'.$gold_item_name.'"/> 
                <input type="hidden" name="itemnumber"  value="'.$gold_item_number.'"/> 
                <input type="hidden" name="itemdesc"    value="'.$gold_itemdesc.'"/> 
                <input type="hidden" name="itemprice"   value="'.$gold_item_price.'"/>
                <input type="hidden" name="itemQty" value="'.$gold_item_qty.'"><br/>
                <input type="hidden" name="member_id" value="'.$_SESSION['session_code'].'"/>
            
              <input class="dw_button" type="submit" name="submitbutt" value="Upgrade" />
              </form>
              </td>
              ';
          $platinum = '<td>
              <label>Platinum Membership </label><br/>
               Subscribe for 1 month membership<br/>
              Only 99,000.00
              <form method="post" action="../paypal/process.php?paypal=checkout">
                <input type="hidden" name="itemname"    value="'.$platinum_item_name.'"/> 
                <input type="hidden" name="itemnumber"  value="'.$platinum_item_number.'"/> 
                <input type="hidden" name="itemdesc"    value="'.$platinum_itemdesc.'"/> 
                <input type="hidden" name="itemprice"   value="'.$platinum_item_price.'"/>
               <input type="hidden" name="itemQty" value="'.$platinum_item_qty.'"><br/>
                 <input type="hidden" name="member_id" value="'.$_SESSION['session_code'].'"/>
            
                <input class="dw_button" type="submit" name="submitbutt" value="Upgrade" />
              </form>
              </td>
            ';
          $donate = ' <td>
            <label>Donate us</label><br/>
              <form method="post" action="../paypal/process.php?paypal=checkout">
                <input type="hidden" name="itemname"    value="donate us"/> 
                <input type="hidden" name="itemnumber"  value="004"/> 
                <input type="hidden" name="itemdesc"    value="our member want to donate us"/> 
                <input type="number" name="itemprice" />
                <input type="hidden" name="member_id" value="'.$_SESSION['session_code'].'"/>
               <input type="hidden" name="itemQty" value="1"><br/>
                <input class="dw_button" type="submit" name="submitbutt" value="Upgrade" />
              </form>
              </td>';
          $tb_footer = '</tr></table>';
        $html = $tb_header.$donate.$tb_footer;
        return $html;
    } 

  } //end class
} //end if

add_action('init','add_shortcode_in_frontend');
if (!function_exists('add_shortcode_in_frontend')) {
  function add_shortcode_in_frontend () { 
    if (!is_admin()) {
        $search_shortcode = new search_shortcode();
    }
  }
}

add_action('init', 'do_output_buffer');
if (!function_exists('do_output_buffer')) {
  function do_output_buffer() {
          ob_start();
  }
}

if (!function_exists('is_logged_in')) {
  function is_logged_in () {
     return (isset($_SESSION['session_code']) ? true : false);
   }
}

?>
