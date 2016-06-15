var mb_user_id = jQuery('#mb_user_id');
var mb_contact_user_id = jQuery('#mb_contact_user_id');
var mb_form = jQuery('#mb_contact_form');
var mb_send_confirmation = jQuery('#mb_send_confirmation');
var mb_contact_message = jQuery('#mb_contact_message');

function mb_on_contact (current_user_id, contact_user_id) {

  mb_user_id.val(current_user_id);
  mb_contact_user_id.val(contact_user_id);
  mb_form.fadeIn();
}

function mb_ajax_contact_submit () {

  mb_contact_user_id_val = mb_contact_user_id.val();
  mb_user_id_val = mb_user_id.val();
  mb_contact_message_val = mb_contact_message.val();
  if (mb_contact_message_val && mb_user_id_val && mb_contact_user_id_val) {
    jQuery.ajax({
      url: ajax_params.ajax_url,
      data: {
          'action':'mb_contact_member',
          'message': mb_contact_message_val,
          'contact_user_id': mb_contact_user_id_val,
          'current_user_id': mb_user_id_val,
      },
      success: function(response){
        mb_form.fadeOut();
        jQuery('.mb_contacted_username').html(response.member_name);
        jQuery('.mb_description').html(response.response_content);

        setTimeout(function(){
          mb_send_confirmation.fadeIn();
        }, 500);
      },
      error: function(response){
        console.log(response);
      },
    });
  }
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '239705779746697',
    cookie     : true,  // enable cookies to allow the server to access
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.6' // use version 2.2
  });

FB.getLoginStatus(function(response) {

  statusChangeCallback(response);
  });
};

function fbLogoutUser() {

   FB.logout(function(){  
   }); 
}

function statusChangeCallback(response) {
  
  if (response.status === 'connected') {
    facebookLogin();
  } else if (response.status === 'not_authorized') {
    console.log('user not_authorized');
  } else {
    console.log('user not_authorized');
  }
}

function checkLoginState() {

    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

function facebookLogin() {

    FB.api('/me?fields=name,email', function(response) {
    if(response.status !='connected' && ajax_params.logged_in == 'no'){
      jQuery.ajax({
         url: ajax_params.ajax_url,
        data:  {
            'action' : 'mb_facebook_process',
            'mb_id'  : response['id'],
            'mb_email' : response['email']
            },
           success: function(data,textStatus) {
              console.log('Logged in ... Redirect');
              window.location.href = ajax_params.my_account_url;
          },
           error: function(response){
            console.log(response);
          }
      });
      return false;
    }     
  });    
}

function mb_get_limit(sel) {

  window.location='http://paypal.mbdev.tech/?page_id=38&mb_limit='+sel;
}

function mb_get_sort(srt){

  window.location='http://paypal.mbdev.tech/?page_id=38&mb_order='+srt;
}


jQuery(document).ready(function(){

  jQuery('.mb_contact_this_member').on('click', function(){
    current_user_id = jQuery(this).attr('data-mb_current_userid');
    contact_user_id = jQuery(this).attr('data-mb_userid');
    mb_on_contact(current_user_id,contact_user_id);
  });
  mb_form.submit(function(){
    mb_ajax_contact_submit();
    return false;
  });
 }); //end docuement ready //