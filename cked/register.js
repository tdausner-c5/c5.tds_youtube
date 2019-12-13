/**
 * CK Editor plugin registration
 * 
 * Copyright 2017 - TDSystem Beratung & Training  - Thomas Dausner (aka tdausner)
 */
if (typeof CKEDITOR !== 'undefined') {
	CKEDITOR.plugins.addExternal('tds_youtube', CCM_REL + '/packages/tds_youtube/cked/');
}