/**
 * CK Editor dialog for TDS Youtube
 * 
 * Copyright 2017 - TDSystem Beratung & Training  - Thomas Dausner (aka tdausner)
 */
(function($) {
	
	var validate = function(id, check, msg) {
     	var $div = $('#' + id);
     	var $input = $('input', $div);
     	if (check($input.val())) {
     		$('span.cked_error', $div).remove();
     		return true;
 		} else {
     		if ($('span.cked_error', $div).length == 0) {
         		$div.prepend('<span class="cked_error">' + msg + '</span>');
     		}
     		return false;
     	}
 	};
 	var thumbs = {
 		$width: null,
 		$height: null
 	};

	CKEDITOR.dialog.add('tdsyoutubeDialog', function(editor) {
		var yt_no_zip = '';
	    return {
	        title: yt_messages.yt_edit,
	        minWidth: 400,
	        minHeight: 200,
	        contents: [{
                id: 'data',
                label: 'Link settings',
                elements: [
                    {
                        type: 'text',
                        id: 'link',
                        label: yt_messages.yt_videourl,
                        validate: function() {
                        	yt_no_zip = '#' + this.domId + ' span';
                        	return validate(this.domId, function(value) {
	                        			return value != '';
	                        		}, yt_messages.yt_url_non_empty)
	                        	&& validate(this.domId, function(value) {
                        			return value.match(/^https?:\/\/youtu[a-z.]+\/[_a-zA-Z0-9]+$/);
                        		}, yt_messages.yt_inv_url);
                        },
                        setup: function(element) {
                        	$('span.cked_error').remove();
                        	var href = element.getAttribute('href');
                        	if (href !== null)
                        		href = href.replace(/\?.*/, '')
                            this.setValue(href);
                        	$('#' + this.domId + ' input').focus();
                        }
                    },
                    {
                        type: 'text',
                        id: 'title',
                        label: yt_messages.yt_linktitle,
                        validate: function() {
                        	return validate(this.domId, function(value) {
                    			return value != '';
                    		}, yt_messages.yt_title_non_empty);
                        },
                        setup: function(element) {
                        	$('span.cked_error').remove();
                            this.setValue(element.getText());
                        }
                    },
                    {
                        type: 'text',
                        id: 'apikey',
                        label: yt_messages.yt_apikey,
                        validate: function() {
                        	return validate(this.domId, function(value) {
                    			return value != '';
                    		}, yt_messages.yt_apikey_non_empty);
                        },
                        setup: function(element) {
                        	$('span.cked_error').remove();
                        	var apikey = element.getAttribute('data-apikey');
                            this.setValue(apikey);
                        }
                    }
                ]
	        }],
	        
	        onShow: function() {
	            var selection = editor.getSelection();
	            var element = selection.getStartElement();
	
	            if (element) {
	                element = element.getAscendant('a', true);
	            }
	            if (!element || element.getName() != 'a') {
	                element = editor.document.createElement('a');
	                element.setText(selection._.cache.selectedText);
	                this.insertMode = true;
	            }
	            else {
	                this.insertMode = false;
	            }	
	            this.element = element;
	           	this.setupContent(this.element);
	       },
	       
	       onOk: function() {
				var dialog = this;
				var link = this.element;
	            link.setAttribute('data-cke-saved-href', dialog.getValueOf('data', 'link'));
        		link.setAttribute('href',  dialog.getValueOf('data', 'link'));
	            link.setAttribute('title', dialog.getValueOf('data', 'title'));
	            link.setAttribute('data-apikey', dialog.getValueOf('data', 'apikey'));
	            link.setText(dialog.getValueOf('data', 'title'));
	            link.setAttribute('class', 'tdsyoutube');
	            if (this.insertMode) {
	                editor.insertElement(link);
				}
	
	       }
	    };
	});
})(jQuery);
