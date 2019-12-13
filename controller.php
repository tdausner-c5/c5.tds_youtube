<?php
/**
 * TDS Youtube add-on controller.
 *
 * Copyright 2017 - TDSystem Beratung & Training - Thomas Dausner (aka tdausner)
 */
namespace Concrete\Package\TdsYoutube;

use Concrete\Core\Editor\Plugin;
use Core;
use Config;
use AssetList;
use Events;
use View;

class Controller extends \Concrete\Core\Package\Package
{

	protected $pkgHandle = 'tds_youtube';
	protected $appVersionRequired = '8.0.3';
	protected $pkgVersion = '0.9.0';
	protected $cked_plugin_key = 'site.sites.default.editor.ckeditor4.plugins.selected';

	public function getPackageDescription()
	{
		return t('Adds TDS Youtube button to the WYSIWYG editor');
	}

	public function getPackageName()
	{
		return t('TDS Youtube');
	}

	public function getMessages()
	{
		return [
			'yt_add'				=> t('Insert Youtube link'),
			'yt_edit'				=> t('Edit link to Youtube video'),
			'yt_videourl'			=> t('Link to Youtube video'),
			'yt_inv_url'			=> t('Invalid Youtube URL'),
			'yt_url_non_empty'		=> t('Link must not be empty'),
			'yt_linktitle'			=> t('Title of Youtube video link'),
			'yt_apikey'				=> t('Youtube api key'),
			'yt_title_non_empty'	=> t('Link title must not be empty'),
			'yt_apikey_non_empty'	=> t('Youtube api key must not be empty'),
			'yt_load_err'			=> t('Error loading information for video &lt;%s&gt;'),
		];
	}

 	public function install()
	{
		$pkg = parent::install();

		$cked_plugins = Config::get($this->cked_plugin_key);
		array_push($cked_plugins, 'tdsyoutube');
		Config::save($this->cked_plugin_key, $cked_plugins);
 	}

 	public function uninstall()
	{
		$pkg = parent::uninstall();

		$cked_plugins = Config::get($this->cked_plugin_key);
		$cked_plugins = array_diff($cked_plugins, ['tdsyoutube']);
		Config::save($this->cked_plugin_key, $cked_plugins);
 	}

	public function on_start()
	{
		$al = AssetList::getInstance();
		$assetGroup = 'editor/ckeditor/tdsyoutube';
		$al->register('javascript', $assetGroup, 'cked/register.js', [], $this->pkgHandle);
		$al->register('css',        $assetGroup, 'cked/plugin.css',  [], $this->pkgHandle);
		$al->registerGroup($assetGroup, [
			['javascript', $assetGroup],
			['css',        $assetGroup]
		]);
		$plugin = new Plugin();
		$plugin->setKey($this->pkgHandle);
		$plugin->setName(t('TDS Youtube Plugin'));
		$plugin->requireAsset($assetGroup);
		$editor = Core::make('editor');
		$editor->getPluginManager()->register($plugin);
		$editor->getPluginManager()->select($this->pkgHandle);

		$filetypes = Config::get('concrete.upload.extensions');
		if (strpos($filetypes, '*.zip') === false)
		{
			$filetypes .= ';*.zip';
			Config::save('concrete.upload.extensions', $filetypes);
		}

		Events::addListener('on_before_render', function($event) {
			$al = AssetList::getInstance();
			$al->register('javascript', 'tdsyoutube',    'js/tdsyoutube.js',        [], $this->pkgHandle);
			$al->register('css',        'tdsyoutube',    'css/tdsyoutube.css',      [], $this->pkgHandle);
			$al->registerGroup('tdsyoutube', [
				['javascript', 'tdsyoutube'],
				['css',        'tdsyoutube'],
			]);
			$v = View::getInstance();
			$v->requireAsset('tdsyoutube');

			$script_tag = '<script type="text/javascript">var yt_messages = ' . json_encode($this->getMessages()) . '</script>';
			$v->addFooterItem($script_tag);
			$script_tag = '<script type="text/javascript" src="https://www.youtube.com/player_api"></script>';
			$v->addFooterItem($script_tag);
		});
	}
}
