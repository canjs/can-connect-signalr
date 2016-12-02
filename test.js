var QUnit = require('steal-qunit');
var clone = require('steal-clone');
var connect = require('can-connect');
var dataParse = require('can-connect/data/parse/');
var constructor = require('can-connect/constructor/');
var constructorStore = require('can-connect/constructor/store/');
var canMap = require('can-connect/can/map/');
var dataCallbacks = require('can-connect/data/callbacks/');
var realTime = require('can-connect/real-time/');
var constructorCallbacksOnce = require('can-connect/constructor/callbacks-once/');
var DefineMap = require('can-define/map/');
var DefineList = require('can-define/list/');

var Message = DefineMap.extend({
	text: {
		type: 'string'
	},
	id: {
		type: 'number'
	}
});

Message.List = DefineList.extend({
	Map: Message
}, {});

var testData = {"text": "this", "id": 1};

QUnit.module('can-connect-signalr', {

	beforeEach: function (assert) {
		var done = assert.async();

		clone({
			'jquery': {
				hubConnection: function () {
					return {
						id: 2228271782,
						createHubProxy: function createHubProxy() {
							return {
								on: function on() {

								},
								invoke: function invoke(methodName) {
									var promise;
									switch(methodName) {
										case "messageGetList":
											promise = new Promise(function (resolve, reject) {
												resolve([{
													data: [testData]
												}]);
											});
											break;
										case "messageUpdate":
											promise = new Promise(function (resolve, reject) {
												testData.text = 'Hello!';
												resolve(testData);
											});
											break;
										default:
											promise = new Promise(function (resolve, reject) {
												resolve(testData);
											});
											break;
									}

									return promise;
								}
							};
						},
						start: function start() {
							return {
								done: function done(fn) {
									fn();
								}
							}
						}
					};
				}
			},
			'ms-signalr-client': {}
		})
			.import('./can-connect-signalr')
			.then(function (signalR) {

				var behaviors = [
					dataParse,
					constructor,
					constructorStore,
					canMap,
					dataCallbacks,
					realTime,
					constructorCallbacksOnce,
					signalR
				];

				Message.connection = connect(behaviors, {
					Map: Message,
					List: Message.List,
					signalR: {
						url: 'http://test.com',
						name: 'Message'
					}
				});

				done();

			});
	}
});

QUnit.test('Plugin initializes correctly', function () {
	QUnit.equal(Message.connection.__behaviorName, 'can-connect-signalr');
});

QUnit.test('getList', function (assert) {
	var done = assert.async();

	Message.getList().then(function (messages) {
		assert.ok(messages, 'Got a response from findAll');
		assert.equal(messages instanceof Message.List, true, 'got a Message.List back');
		done();
	});

});

QUnit.test('create', function (assert) {
	var done = assert.async();
	var message = new Message({
		text: 'Hi there!'
	});

	message.save().then(function (msg) {
		assert.ok(msg);
		done();
	});
});

QUnit.test('update', function (assert) {
	var done = assert.async();
	var message = new Message({
		text: 'Hi there!'
	});

	message.save().then(function (msg) {
		msg.text = 'Hello!';
		msg.save().then(function (saveResponse) {
			assert.equal(saveResponse.text, 'Hello!', 'message text updated correctly');
			done();
		});
	});
});

QUnit.test('destroy', function(assert){
	var done = assert.async();

	var message = new Message({
		text: 'Hi there!'
	});
	message.save().then(function(msg){
		var id = msg._id;
		msg.destroy().then(function(res){
			assert.equal(res._id, id, 'deleted the instance');
			done();
		});
	});
});