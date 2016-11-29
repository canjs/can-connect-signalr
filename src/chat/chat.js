import Component  from 'can-component';
import DefineMap  from 'can-define/map/';
import './chat.less!';
import template from './chat.stache!steal-stache';
import Message from 'ccsr/models/message';

export const ViewModel = DefineMap.extend({
	messages: {
		get: function (lastSet, resolve) {
			this.messagesPromise.then(function (messages) {
				console.log("got messages", messages);
				resolve(messages)
			}, function (e) {
				debugger;
			});
		}
	},
	loading: {
		type: 'boolean',
		value: true
	},
	signalR: {
		value: {}
	},
	messagesPromise: {
		value: function () {
			return Message.getList();
		}
	},
	send(event) {
		event.preventDefault();
		new Message({
			name: this.name,
			body: this.body
		}).save();
	}
});

export default Component.extend({
	tag: 'ccsr-chat',
	viewModel: ViewModel,
	events: {
		inserted: function inserted() {
			console.log('chat inserted');
			// If signalR is instantiated before the page loads, then it wreaks havoc on the events
			// We pass the options in here, when we create the new instance of the Bx
			// const connection = messageConnection({
			// 	Map: Message,
			// 	signalR: {
			// 		url: 'http://donechatserver20161101024824.azurewebsites.net',
			// 		name: "Message"
			// 	}
			// });

			// connection.getList({}).then((messages) => {
			// 	this.attr('messages', messages);
			// });
			//
			// connection.signalR.ready.then(function () {
			// 	this.viewModel.attr('loading', false);
			// }.bind(this));
			//
			// this.viewModel.attr('signalR', connection);
		}
	},
	template
});
