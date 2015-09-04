# Meteor Configurator #

Simple package to help manage a configuration object. You can get/set keys and values in an object and `Configurator` will help manage those items.

## Motivation ##

I find myself writing a lot of boilerplate to set/get settings within my package, etc. This is an attempt to stay DRY.

## Usage ##

From your `package.json`, you can `api.use('awei01:meteor-configurator');`

```
// package.json file

Package.onUse(function(api) {
	...
	api.use('awei01:meteor-configurator');
	...
});
```

From within your code, simply call `new MeteorConfigurator([object]);`. Here's a contrived example for some API service:

```
// some default settings
var defaults = {
	targetUrl: "http://www.example.com",
	credentials: {},
};

Agent = {};
Agent.__configs = new MeteorConfigurator(defaults);
Agent.setCredentials = function(data) {
	this.__configs.set('credentials', data);
};
Agent.setUserId = function(id) {
	this.__configs.set('credentials.userId', id);
};
Agent.setApiKey = function(key) {
	this.__configs.set('credentials.apiKey', key);
};
Agent.query = function(data) {
	var url = this.__configs.get('targetUrl'),
		id = this.__configs.get('credentials.id'),
		key = this.__configs.get('credentials.key'),
		post = _.extend({}, data, { id: id, key: key });
	return Meteor.post(url, { data: post});
};
```

## API ##

### `MeteorConfigurator([object])` ###
(constructor) Instantiate a new configurator instance.
```
var configs = new MeteorConfigurator({ foo: "foo value", "bar.baz": "bar baz value", boo: { bee: "boo bee value" } });
console.log(configs.all());
<!--
{
	foo: "foo value",
	bar: {
		baz: "bar baz value"
	},
	boo: {
		bee: "boo bee value"
	},
}
-->
```

### `.all()` ###
Retrieve a cloned object with all the configuration data. Modifications to the result of this method will not alter your configuration data.
```
var configs = new MeteorConfigurator({ foo: "foo value" });
var data = configs.all();
console.log(data);
<!--
{
	foo: "foo value"
}
-->
data.bar = "this will not affect configs";
console.log(configs.all());
<!--
Hasn't changed...
{
	foo: "foo value"
}
-->

### .set(keyOrObject, [value]) ###
* If key and value passed set key with value in the configs.
* If the key has periods `.` deeply set the key with a value.
* If first param is an object, then deeply extend the configs object.

```
var configs = new MeteorConfigurator({ foo: "foo value" });
console.log(configs.all());
<!--
{
	foo: "foo value"
}
-->
configs.set('foo', 'new foo value');
console.log(configs.all());
<!--
{
	foo: "new foo value"
}
-->
configs.set('bar.baz', 'bar baz value');
console.log(configs.all());
<!--
{
	foo: "new foo value",
	bar: {
		baz: "bar baz value"
	}
}
-->
configs.set({ boo: { bee: "boo bee value" } });
console.log(configs.all());
<!--
{
	foo: "new foo value",
	bar: {
		baz: "bar baz value"
	},
	boo: {
		bee: "boo bee value"
	},
}
-->

### .get(key) ###
Retrieve a value by key using dot notation. If key has not been defined, returns undefined. If an object is returned, it will be a clone so modifying the result of `.get()` will not affect configurations.

```
var configs = new MeteorConfigurator({ foo: "foo value", "bar.baz": "bar baz value" });
console.log(configs.get('foo'));
// 'foo value'
console.log(configs.get('bar.baz'));
// 'bar baz value'
var result = configs.get('bar');
console.log(result);
<!--
{
	baz: "bar baz value"
}
-->
// let's try to mess w/ result
result.something = "this won't affect configs";
<!--
Still the same...
{
	baz: "bar baz value"
}
-->

console.log(configs.get('non-existent-key'));
// undefined


## Contribute ##
Suggestions and PR's greatly welcomed.
