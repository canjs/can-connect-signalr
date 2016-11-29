import connect from 'can-connect';
import $ from 'jquery';
import 'ms-signalr-client';

const signalRConnection = connect.behavior('signal-r', function signalR(baseConnection) {
	return {
		init: function () {
			baseConnection.init.apply(this, arguments);
			const context = this;
			this.signalR.ready = new Promise(function (resolve, reject) {
				const signalR = context.signalR;

				// There is no official naming standard for SignalR Hub methods that extends beyond
				// Hub names being PascalCased (server side and client side),a Hub names ending in
				// "Hub"
				signalR.connection = $.hubConnection(signalR.url);
				signalR.proxy = signalR.connection.createHubProxy(signalR.name + 'Hub');

				// SignalR convention is for PascalCased methods on the server to be
				// camelCased on the client. There are no naming conventions for actions
				// defined on the server side. However, we have implemented CUD methods
				// using the following standards.
				const name = signalR.name.toLowerCase();

				signalR.proxy.on(name + "Created", function (item) {
					context.createInstance(item)
				});
				signalR.proxy.on(name + "Updated", function (item) {
					context.updateInstance(item)
				});
				signalR.proxy.on(name + "Destroyed", function (item) {
					context.destroyInstance(item)
				});

				signalR.connection.start()
					.done(function () {
						console.log('Connected: ' + signalR.connection.id);
						resolve(signalR);
					})
					.fail(reject);
			});
		},
		createData: function (props) {
			return this.signalR.ready.then(function (signalR) {
				return signalR.proxy.invoke(signalR.name.toLowerCase() + "Create", props.name, props.body);
			})
		},
		updateData: function (...props) {
			return this.signalR.ready.then(function (signalR) {
				return signalR.proxy.invoke(signalR.name.toLowerCase() + "Update", ...props);
			});
		},
		destroyData: function (...props) {
			return this.signalR.ready.then(function (signalR) {
				return signalR.proxy.invoke(signalR.name.toLowerCase() + "Destroy", ...props);
			});
		},
		getListData: function (...props) {
			return this.signalR.ready.then(function (signalR) {
				// We don't persist any data on the server, so we return a blank set on init.
				return {data: []};
			});
		}
	}
});

export default signalRConnection