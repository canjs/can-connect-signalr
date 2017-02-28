var connect = require("can-connect");
var $ = require("jquery");
try {
  require('ms-signalr-client');
} catch (e) {
}

var camelCase = function (str) {
  return str[0].toLowerCase() + str.substr(1);
};

module.exports = connect.behavior('can-connect-signalr', function signalR(baseConnection) {
  return {
    init: function () {

      if (!this.signalR.url) {
        throw new Error('Invalid SignalR Hub URL. URL cannot be blank.');
      }

      if (!this.signalR.name) {
        throw new Error('Invalid SignalR Hub name. Hub name cannot be blank.');
      }

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
        signalR.proxy.on((signalR.dataName || name + "Data"), function (item) {
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
        return signalR.proxy.invoke(signalR.createName || (camelCase(signalR.name) + "Create"), props);
      });
    },
    updateData: function (props) {
      return this.signalR.ready.then(function (signalR) {
        return signalR.proxy.invoke(signalR.updateName || (camelCase(signalR.name) + "Update"), props);
      });
    },
    destroyData: function (props) {
      return this.signalR.ready.then(function (signalR) {
        return signalR.proxy.invoke(signalR.destroyName || (camelCase(signalR.name) + "Destroy"), props);
      });
    },
    getListData: function (set) {
      return this.signalR.ready.then(function (signalR) {
        return signalR.proxy.invoke(signalR.getListDataName || (camelCase(signalR.name) + "GetList"), set);
      });
    },
    get: function (set) {
      return this.signalR.ready.then(function (signalR) {
        return signalR.proxy.invoke(signalR.getDataName || (camelCase(signalR.name) + "Get"), set);
      });
    }
  };
});
