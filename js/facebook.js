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
      console.log(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1031688226880584',
    cookie     : true,  // enable cookies to allow the server to access
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.6' // use version 2.2
  });

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);

  	});
  };

 function fbLogoutUser() {
    if (FB.getAuthResponse()) {
		 FB.logout(function(){
			 top.location.href = 'logout.php'
		 });
	 }else{
		 top.location.href = 'logout.php'
	 }
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
    FB.api('/me', function(response) {
    	console.log(response);
  			$.ajax({
  		 		 type	: 'POST',
  				 url 	: '..',
  		 		 data:  {
  					 	'id'	: response['id'],
  						'email'	: response['email']
  					  },
  		  		 success: function(data,textStatus) {

  						FB.api('/me', function(response) {
                 			$('#status').html(
  							'<a href="index.php"><div class="img-profile"><img src="https://graph.facebook.com/'+ response['id'] +'/picture?type=normal" style="float:right"></div></a><br/><div class="text-profile" style="float:right;margin-right:5px;">Hello, ' + response['first_name'] +'</div>'
  							+ ' <br/><div style="float:right;margin-right:5px"><a href="#" onclick="loadHistory()" target="_self">View Search History</a> | <a href="#" onclick="fbLogoutUser()">logout</a></div>');
  						$('#facebook').hide();
  						$('#sessionId').val(response['id']);
              		});
        	}
  	 		});
    	});
  }

