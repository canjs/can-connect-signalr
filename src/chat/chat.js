import Component  from 'can-component';
import DefineMap  from 'can-define/map/';
import './chat.less!';
import template from './chat.stache!steal-stache';
import Message from 'ccsr/models/message';

export const ViewModel = DefineMap.extend({
	messages: {
		get: function (lastSet, resolve) {
			this.messagesPromise.then(function (messages) {
				resolve(messages)
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
	messageName: {},
	messageBody: {},
	send(event) {
		event.preventDefault();
		new Message({
			name: this.messageName,
			body: this.messageBody
		}).save();
	}
});

export default Component.extend({
	tag: 'ccsr-chat',
	viewModel: ViewModel,
	template
});
