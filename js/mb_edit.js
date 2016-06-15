function mb_switch() {
	var elem = document.querySelector('.js-switch');
	if (elem) {
		var switchery = new Switchery(elem, { size: 'small' });
	}
}
jQuery(function ($) {
        $(document).ajaxComplete(function (event, xhr, settings) {
            var match;
            if (typeof settings.data === 'string'
            && /action=set-post-thumbnail/.test(settings.data)
            && xhr.responseJSON && typeof xhr.responseJSON.data === 'string') {
                mb_switch();
            }
        });
    });
jQuery(document).ready(function(){
                mb_switch();
});