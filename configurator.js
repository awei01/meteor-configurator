'use strict';
var deepExtend = Npm.require('deep-extend');

function Config (data) {
	this.__data = {};
	if (data) {
		data = extractObjectIfInstance(data);
		this.set(data);
	}
};
Config.prototype.all = function(data) {
	data = extractObjectIfInstance(data);
	return deepExtend({}, this.__data, data);
};
Config.prototype.get = function(key) {
	return deepGetOrSet(this.__data, key);
};
Config.prototype.set = function(key, value) {
	var me = this;
	key = extractObjectIfInstance(key);
	if (_.isObject(key)) {
		deepExtend(this.__data, key);
	}
	else {
		deepGetOrSet(this.__data, key, value);
	}
	return this;
};

function extractObjectIfInstance(item) {
	if (item instanceof Config) {
		item = item.all();
	}
	return item;
};

function deepGetOrSet(object, key, value) {
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
			value = deepExtend({}, value);
		}
		return value;
	}
}

MeteorConfigurator = Config;
