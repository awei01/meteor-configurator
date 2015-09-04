'use strict';

function Config (data) {
	this.__data = {};
	if (data) {
		this.set(data);
	}
};
Config.prototype.all = function() {
	return _.extend({}, this.__data);
};
Config.prototype.get = function(key) {
	return deep(this.__data, key);
};
Config.prototype.set = function(key, value) {
	var me = this;
	if (_.isObject(key)) {
		_.each(key, function(v, k) {
			me.set(k, v);
		});
		return;
	}
	deep(this.__data, key, value);
};

function deep(object, key, value) {
	var keys = key.split('.'), i = 0, len = keys.length,
		root;
	if (arguments.length > 2) {
		root = object;
		len--;
		while (i < len) {
			key = keys[i++];
			object = object[key] = _.isObject(object[key]) ? object[key] : {};
		}
		object[keys[i]] = value;
	}
	else {
		while ((object = object[keys[i++]]) != null && i < len) {};
		value = i < len ? void 0 : object;
		if (_.isObject(value)) {
			value = _.extend({}, value);
		}
		return value;
	}
}

MeteorConfigurator = Config;
