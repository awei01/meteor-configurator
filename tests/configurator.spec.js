'use strict';

var data = {
		foo: "foo value",
		bar: {
			baz: "bar baz value",
		},
		boo: {
			bee: "boo bee value"
		}
	};

describe('MeteorConfigurator instantiated with no params', function() {
	var configs;
	beforeEach(function() {
		configs = new MeteorConfigurator();
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
	it('.set() with object sets .all() with nested object', function() {
		configs.set(data);
		assert(_.isEqual(configs.all(), data), '.all() returns correct object');
	});
	it('.set() when data already set and passed object, deep extends object', function() {
		configs.set(data);
		configs.set({ bar: { bap: "new bar bap value" }, zoo: "new zoo value" });
		var expected = _.extend({}, data);
		expected.bar.bap = 'new bar bap value';
		expected.zoo = "new zoo value";
		// console.log(expected);
		// console.log(configs.all());
		assert(_.isEqual(configs.all(), expected), '.all() returns correct object');
	});
	it('.set() when data already set and passed instance of MeteorConfigurator, deep extends object', function() {
		configs.set(data);
		var configs2 = new MeteorConfigurator({ bar: { bap: "new bar bap value" }, zoo: "new zoo value" });
		configs.set(configs2);
		var expected = _.extend({}, data);
		expected.bar.bap = 'new bar bap value';
		expected.zoo = "new zoo value";
		// console.log(expected);
		// console.log(configs.all());
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
		var configs2 = new MeteorConfigurator({ foo: "foo 2"});
		configs.set('foo', 'foo 1');
		assert.equal(configs.get('foo'), 'foo 1');
		assert.equal(configs2.get('foo'), 'foo 2');
	});

});
describe('MeteorConfigurator instantiated with complex object', function() {

	it('when instantiated with complex object, .all() should return correctly nested object', function() {
		var	configs = new MeteorConfigurator(data);
		assert(_.isEqual(configs.all(), data), '.all() returns correctly formatted object');
	});

});
