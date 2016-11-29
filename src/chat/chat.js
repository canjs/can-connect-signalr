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
	name: {},
	body: {},
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
	template
});
