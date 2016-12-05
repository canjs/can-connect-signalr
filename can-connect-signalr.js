var connect = require("can-connect");
var $ = require("jquery");

require('ms-signalr-client');

module.exports = connect.behavior('can-connect-signalr', function signalR(baseConnection) {
	return {
		init: function () {
			baseConnection.init.apply(this, arguments);
			var context = this;
			this.signalR.ready = new Promise(function (resolve, reject) {
				var signalR = context.signalR;
				var name = signalR.name.toLowerCase();

				signalR.connection = $.hubConnection(signalR.url);
				signalR.proxy = signalR.connection.createHubProxy(signalR.name + 'Hub');

				signalR.proxy.on((signalR.createdName || name + "Created"), function (item) {
					context.createInstance(item);
				});
				signalR.proxy.on((signalR.updatedName || name + "Updated"), function (item) {
					context.updateInstance(item);
				});
				signalR.proxy.on((signalR.destroyedName || name + "Destroyed"), function (item) {
					context.destroyInstance(item);
				});
				signalR.proxy.on((signalR.listDataName || name + "ListData"), function (item) {
					context.createInstance(item);
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
				return signalR.proxy.invoke(signalR.createName || (signalR.name.toLowerCase() + "Create"), props);
			});
		},
		updateData: function (props) {
			return this.signalR.ready.then(function (signalR) {
				return signalR.proxy.invoke(signalR.updateName || (signalR.name.toLowerCase() + "Update"), props);
			});
		},
		destroyData: function (props) {
			return this.signalR.ready.then(function (signalR) {
				return signalR.proxy.invoke(signalR.destroyName || (signalR.name.toLowerCase() + "Destroy"), props);
			});
		},
		getListData: function (set) {
			return this.signalR.ready.then(function (signalR) {
				return signalR.proxy.invoke(signalR.getListName || (signalR.name.toLowerCase() + "GetList"), set);
			});
		}
	};
});
