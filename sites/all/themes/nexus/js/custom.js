jQuery(window).load(function() {
    
  /* Navigation */

	jQuery('#main-menu > ul').superfish({ 
		delay:       500,								// 0.1 second delay on mouseout 
		animation:   { opacity:'show',height:'show'},	// fade-in and slide-down animation 
		dropShadows: true								// disable drop shadows 
	});	  

	jQuery('#main-menu > ul').mobileMenu({
		prependTo:'.mobilenavi'
	});

});


( function() {
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	    is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	    is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && 'undefined' !== typeof( document.getElementById ) ) {
		var eventMethod = ( window.addEventListener ) ? 'addEventListener' : 'attachEvent';
		window[ eventMethod ]( 'hashchange', function() {
			var element = document.getElementById( location.hash.substring( 1 ) );

			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) )
					element.tabIndex = -1;

				element.focus();
			}
		}, false );
	}
})();


jQuery.ajax = (function(_ajax){
    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';
    
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    
    return function(o) {
        
        var url = o.url;
        
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            
            // Manipulate options so that JSONP-x request is made to YQL
            
            o.url = YQL;
            o.dataType = 'json';
            
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };
            
            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            
            o.success = (function(_success){
                return function(data) {
                    
                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }
                    
                };
            })(o.success);
            
        }
        
        return _ajax.apply(this, arguments);
        
    };
    
})(jQuery.ajax);

(function($){
  $(function(){
    $('#edit-field-website-url-und-0-url').change(function(){
      var url = $(this).val();
      icon = "/favicon.ico";
      icon = url.match(/https?:\/\/[^\/]*/)+icon;
      $('#edit-field-image-url-und-0-value').val(icon);  
      console.log(url);
      $.ajax({
        url: url,
        type: 'GET',
        success: function(res) {
            response = res.responseText;
            arr_title = response.match(/<title[^>]*>(.+)<\/title>/);
            console.log(arr_title);
            if(arr_title){
              var title = arr_title[1];  
              $('#edit-title').val(title);
            }
            var link_word = response.match(/<link[^>]*rel="[^"]*icon[^"]*"[^>]*\/?>/)[0];
            if(link_word){
              var icon = link_word.match(/href="([^"]+)"/)[1];
              if(icon[0]=="/"){
                icon = url.match(/https?:\/\/[^\/]*/)+icon;
              }
              $('#edit-field-image-url-und-0-value').val(icon);  
            }
            
        }   
      })
    })

    $('.label.label-success').each(function(){
      if($(this).find('a').length>0){
        $(this).removeClass('label').removeClass('label-success').find('a').addClass('label').addClass('label-success');
      }
    })
    $('.label.label-info').each(function(){
      if($(this).find('a').length>0){
        $(this).removeClass('label').removeClass('label-info').find('a').addClass('label').addClass('label-info');
      }
    })

  });
})(jQuery);
