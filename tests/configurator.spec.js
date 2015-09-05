'use strict';

function makeData() {
	return {
		foo: "foo value",
		bar: {
			baz: "bar baz value",
		},
		boo: {
			bee: "boo bee value"
		}
	}
};

describe('MeteorConfigurator.all()', function() {
	var configs;
	beforeEach(function() {
		configs = new MeteorConfigurator(makeData());
	});
	it('.all() returns deep cloned object that does not modify instance', function() {
		var result = configs.all();
		result.bar.bap = 'bar bap value';
		assert.deepEqual(configs.all(), makeData());
	});
	it('.all() with object returns deep extended object', function() {
		var expected = makeData();
		expected.bar.bap = "bar bap value";
		var result = configs.all({ bar: { bap: "bar bap value" } });
		assert.deepEqual(result, expected);
	});
	it('.all() with instance returns deep extended object', function() {
		var expected = makeData();
		expected.bar.bap = "bar bap value";
		var configs2 = new MeteorConfigurator({ bar: { bap: "bar bap value" } });
		var result = configs.all(configs2);
		assert.deepEqual(result, expected);
	});
});

describe('MeteorConfigurator.set()', function() {
	var configs;
	beforeEach(function() {
		configs = new MeteorConfigurator();
	});
	it('.set() returns self', function() {
		var result = configs.set('foo', 'foo value');
		assert.equal(configs, result);
	});
	it('.set() w/ key and value sets .all() with object having key and value', function() {
		configs.set('foo', 'foo value');
		assert.deepEqual(configs.all(), { foo: "foo value" });
	});
	it('.set() with nested key and value sets .all() with correctly nested object', function() {
		configs.set('foo.bar.baz', 'foo bar baz value');
		assert.deepEqual(configs.all(), { foo: { bar: { baz: "foo bar baz value" } } });
	});
	it('.set() with object sets .all() with nested object', function() {
		var data = makeData();
		configs.set(data);
		assert.deepEqual(configs.all(), data);
	});
	it('.set() when data already set and passed object, deep extends object', function() {
		configs.set(makeData());
		configs.set({ bar: { bap: "new bar bap value" }, zoo: "new zoo value" });
		var expected = makeData();
		expected.bar.bap = 'new bar bap value';
		expected.zoo = "new zoo value";
		// console.log(expected);
		// console.log(configs.all());
		assert.deepEqual(configs.all(), expected);
	});
	it('.set() when data already set and passed instance of MeteorConfigurator, deep extends object', function() {
		configs.set(makeData());
		var configs2 = new MeteorConfigurator({ bar: { bap: "new bar bap value" }, zoo: "new zoo value" });
		configs.set(configs2);
		var expected = makeData();
		expected.bar.bap = 'new bar bap value';
		expected.zoo = "new zoo value";
		// console.log(expected);
		// console.log(configs.all());
		assert.deepEqual(configs.all(), expected);
	});
});

describe('MeteorConfigurator.get()', function() {
	var configs;
	beforeEach(function() {
		configs = new MeteorConfigurator();
	});
	it('.get() with undefined key returns undefined', function() {
		assert.equal(configs.get('foo'), undefined);
	});
	it('.get() with defined nested key sets .all() with correctly nested object', function() {
		configs.set('foo.bar.baz', 'foo bar baz value');
		assert.equal(configs.get('foo.bar.baz'), 'foo bar baz value');
	});
	it('.get() with key resolving to object returns deep cloned object', function() {
		configs.set('foo.bar.baz', 'foo bar baz value');
		var foo = configs.get('foo');
		foo.bar.baz = 'overridden';
		assert.equal(configs.get('foo.bar.baz'), 'foo bar baz value');
	});
});

describe('MeteorConfigurator instantiation', function() {
	it('with no params .all() returns empty object', function() {
		var configs = new MeteorConfigurator();
		assert.notStrictEqual(configs.all(), {});
	});
	it('when instantiated more than once, each instance behaves independently', function() {
		var configs = new MeteorConfigurator();
		var configs2 = new MeteorConfigurator({ foo: "foo 2"});
		configs.set('foo', 'foo 1');
		assert.equal(configs.get('foo'), 'foo 1');
		assert.equal(configs2.get('foo'), 'foo 2');
	});
	it('when instantiated with complex object, .all() should return correctly nested object', function() {
		var data = makeData();
		var	configs = new MeteorConfigurator(data);
		assert.deepEqual(configs.all(), data);
	});
	it('when instantiated with another instance, .all() should return independent instance', function() {
		var	configs = new MeteorConfigurator(makeData()),
			configs2 = new MeteorConfigurator(configs);
		configs2.set('bar.baz', 'updated bar baz value');
		assert.equal(configs.get('bar.baz'), 'bar baz value');
		assert.equal(configs2.get('bar.baz'), 'updated bar baz value');
	});
});
