/**
 * CK Editor plugin for ZIP gallery
 * 
 * Copyright 2017 - TDSystem Beratung & Training  - Thomas Dausner (aka tdausner)
 */
CKEDITOR.plugins.add('tds_youtube', {
    init: function( editor ) {
    	
        editor.addCommand('tdsyoutube', new CKEDITOR.dialogCommand('tdsyoutubeDialog'));
        editor.ui.addButton('TdsYoutube', {
            label:	 yt_messages.yt_add,
            command: 'tdsyoutube',
            toolbar: 'insert'
        });

        if (editor.contextMenu) {
            editor.addMenuGroup('tdsytGroup');
            editor.addMenuItem('tdsytItem', {
                label:	 yt_messages.yt_edit,
                command: 'tdsyoutube',
                group:   'tdsytGroup'
            });

            editor.contextMenu.addListener(function(element) {
                if (element.getAscendant('a', true) ) {
                    return {
                    	tdsytItem: CKEDITOR.TRISTATE_OFF
                    };
                }
            });
        }

        CKEDITOR.dialog.add('tdsyoutubeDialog', this.path + 'dialog.js');
    }
});
