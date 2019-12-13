/* global ConcreteAlert, YT, yt_messages */

/**
 * jQuery JavaScript Library for TDS Youtube
 *
 * Copyright 2017 - TDSystem Beratung & Training, Thomas Dausner (aka tdausner)
 * 
 */
(function($) {
    /*
     * alert function
     */
    var _alert = function(msg, stack) {
		$('body, button').css('cursor', '');
		ConcreteAlert.dialog('Error', '<div class="alert alert-danger">' + msg + '</div>'
			+	'<p class="hidden" id="alert-stack"><input type="checkbox"><span>Show stack<span><p/>'
			+	'<p class="hidden" id="alert-stack-msg">' + stack + '</p>' 
		);
		$("#dialog-confirm").dialog('close');
		$(document).ready(function() {
			$('#alert-stack')
				.removeClass('hidden')
				.children('input')
					.change(function() {
						$('#alert-stack-msg').toggleClass('hidden');
					});
		});
    };

	/*
	 * video resolution
	 */
	var videoRes = {
		height: 360,
		width: 480
	};
	/*
	 * align video window geometry
	 */
    var alignGeometry = function() {
		var vp = {
			height: document.documentElement.clientHeight,
			width:  document.documentElement.clientWidth
		};
		if (videoRes.height !== vp.height || videoRes.width !== vp.width) {
			var ratio = videoRes.width / videoRes.height;
			var ht, wd;
			if (vp.width / vp.height > ratio) {
				ht = vp.height;
				wd = vp.height * ratio;
			} else {
				ht = vp.width / ratio;
				wd = vp.width;
			}
		}
		$('#ytWrapper iframe').attr({
			height:	ht,
			width:	wd
		});
		$('#ytWrapper').css({
			top: ((vp.height - ht) / 2) + 'px'
		});
    };
	
    $(document).ready(function() {
		/*
		 * process all links identifying TDS Youtube links
		 */
		$('a.tdsyoutube').click(function(e) {
			e.preventDefault();
			var $a = $(this);
			var ytUrl = $a.attr('href');
			var apiKey = $a.data('apikey');
			var videoId = ytUrl.replace(/^http.*\//, '');
			var infoUrl = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + videoId + '&key=' + apiKey;
			$.ajax( {
				type: 'GET',
				url: infoUrl,
				dataType: 'json',
				success: function(info) {
					var resolutions = [ 'maxres', 'standard', 'high', 'medium', 'default' ];
					for (var i in resolutions) {
						videoRes = info.items[0].snippet.thumbnails[resolutions[i]];
						if (typeof videoRes !== 'undefined')
							break;
					}
					$('body').append('<div id="tdsYoutube"><div class="yt-close"/><div id="ytWrapper"><div id="ytplayer"></div></div>');
					var player = new YT.Player('ytplayer', {
						height: videoRes.height,
						width: videoRes.width,
						videoId: videoId
					});
					$(document).ready(function() {
						alignGeometry();
						/*
						 * TDS Youtube close click/escape handler
						 */
						$('#tdsYoutube div.yt-close').click(function() {
							$('#tdsYoutube').remove();
						});
						$(document).keydown(function(evt) {
							evt = evt || window.event;
							var isEscape = false;
							if ("key" in evt) {
								isEscape = (evt.key === "Escape" || evt.key === "Esc");
							} else {
								isEscape = (evt.keyCode === 27);
							}
							if (isEscape) {
								$('#tdsYoutube').remove();
							}
						});
					});
				},
				error: function(xhr, statusText, err) {
					$('body, a').css('cursor', '');
					_alert(yt_messages.yt_load_err.replace(/%s/, infoUrl) + '<br/>' + statusText + '<br/>' + err.message, err.stack);
				}
			});
		});
		/*
		 * window resize handler
		 */
		$(window).resize(alignGeometry);
	});
})(window.jQuery);