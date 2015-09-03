'use strict';

var data = {
		foo: "foo value",
		"bar.baz": "bar baz value",
		boo: {
			bee: "boo bee value"
		}
	};
var expected = {
		foo: "foo value",
		bar: {
			baz: "bar baz value"
		},
		boo: {
			bee: "boo bee value"
		}
	};

describe('Configurator instantiated with no params', function() {
	var configs;
	beforeEach(function() {
		configs = new Configurator();
	});
	it('.all() should return empty object', function() {
		assert(_.isEqual(configs.all(), {}), '.all() returns empty object');
	});
	it('.all() returns cloned object', function() {
		var result = configs.all();
		result.foo = 'bar';
		assert(_.isEqual(configs.all(), {}), '.all() returns empty object');
	});
	it('.set() w/ key and value sets .all() with object having key and value', function() {
		configs.set('foo', 'foo value');
		assert(_.isEqual(configs.all(), { foo: "foo value" }), '.all() returns correct object');
	});
	it('.set() with nested key and value sets .all() with correctly nested object', function() {
		configs.set('foo.bar.baz', 'foo bar baz value');
		assert(_.isEqual(configs.all(), { foo: { bar: { baz: "foo bar baz value" } } }), '.all() returns correct object');
	});
	it('.set() with complex object sets .all() with correctly nested object', function() {
		configs.set(data);
		assert(_.isEqual(configs.all(), expected), '.all() returns correct object');
	});
	it('.get() with undefined key returns undefined', function() {
		assert.equal(configs.get('foo'), undefined);
	});
	it('.get() with defined nested key sets .all() with correctly nested object', function() {
		configs.set('foo.bar.baz', 'foo bar baz value');
		assert.equal(configs.get('foo.bar.baz'), 'foo bar baz value');
	});
	it('.get() with key resolving to object returns cloned object', function() {
		configs.set('foo.bar.baz', 'foo bar baz value');
		var foo = configs.get('foo');
		foo.bar = 'overridden';
		assert.equal(configs.get('foo.bar.baz'), 'foo bar baz value');
	});

	it('when instantiated more than once, each instance behaves independently', function() {
		var configs2 = new Configurator({ foo: "foo 2"});
		configs.set('foo', 'foo 1');
		assert.equal(configs.get('foo'), 'foo 1');
		assert.equal(configs2.get('foo'), 'foo 2');
	});

});
describe('Configurator instantiated with complex object', function() {

	it('when instantiated with complex object, .all() should return correctly nested object', function() {
		var	configs = new Configurator(data);
		assert(_.isEqual(configs.all(), expected), '.all() returns correctly formatted object');
	});

});
