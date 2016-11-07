var fs = require("fs");
var Utils = require('./utils');

function loadConfig() {
	var config = {}, pkg;
	try {
		pkg = require('pkgcfg')();
	}
	catch(e) {
		try {
			pkg = JSON.parse(fs.readFileSync('package.json').toString());
		}
		catch(e) {
			log.error(log.name + ': ERROR: ' + e.message, e);
		}
	}

	if (pkg && pkg.i18n) {
		config = Utils.extend({}, config, pkg.i18n);
		log.debug(log.name + ': loaded config from package.json', pkg.i18n);
	}

	if (fs.existsSync(".i18nrc")) {
		try {
			var rc = JSON.parse(fs.readFileSync(".i18nrc").toString())
			config = Utils.extend({}, config, rc);
			log.debug(log.name + ': loaded config from .i8nrc', rc);
		} catch (e) {
			log.error(log.name + ': ERROR: ' + e.message, e);
		}
	}

	if (config.plugins && config.plugins.length) {
		for (var i=0,pluginName; pluginName=config.plugins[i]; i++) {
			log.debug(log.name + ': loading plugin ' + pluginName);
			config.plugins[i] = require(pluginName);
		}
	}

	return config;
};

module.exports = loadConfig;