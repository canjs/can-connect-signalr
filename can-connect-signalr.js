var connect = require("can-connect");
var $ = require("jquery");
require('ms-signalr-client');

/**
 * @desc Converts a string in TitleCase to camelCase
 * @param str
 * @returns {string}
 */
var camelCase = function (str) {
  return str[0].toLowerCase() + str.substr(1);
};

module.exports = connect.behavior('can-connect-signalr', function signalR(baseConnection) {
  return {
    /**
     * @desc Initializes the SignalR Hub Proxy, and sets up the RPC listeners for the standard
     * can-connect-signalr RPC interfaces.
     */
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
        signalR.proxy = signalR.connection.createHubProxy(signalR.name);

        /**
         * This is where we set up the RPC listeners for calls from the Hub
         */
        signalR.proxy.on((signalR.createdName || name + "Created"), function (item) {
          context.createInstance(item);
        });
        signalR.proxy.on((signalR.updatedName || name + "Updated"), function (item) {
          context.updateInstance(item);
        });
        signalR.proxy.on((signalR.destroyedName || name + "Destroyed"), function (item) {
          context.destroyInstance(item);
        });

        /**
         * We must connect to the SignalR Hub after setting up the RPC listeners
         */
        signalR.connection.start()
          .done(function () {
            console.log('Connected: ' + signalR.connection.id);
            resolve(signalR);
          })
          .fail(reject);
      });
    },
    /**
     * @desc Creates an instance on the Hub
     * @param props
     * @returns {Promise}
     */
    createData: function (props) {
      return this.signalR.ready.then(function (signalR) {
        return signalR.proxy.invoke(signalR.createName || (camelCase(signalR.name) + "Create"), props);
      });
    },
    /**
     * @desc Updates an instance on the Hub
     * @param props
     * @returns {Promise}
     */
    updateData: function (props) {
      return this.signalR.ready.then(function (signalR) {
        return signalR.proxy.invoke(signalR.updateName || (camelCase(signalR.name) + "Update"), props);
      });
    },
    /**
     * @desc Destroys an instance on the Hub
     * @param props
     * @returns {Promise}
     */
    destroyData: function (props) {
      return this.signalR.ready.then(function (signalR) {
        return signalR.proxy.invoke(signalR.destroyName || (camelCase(signalR.name) + "Destroy"), props);
      });
    },
    /**
     * @desc Gets a collection of data instances from the Hub
     * @param set
     * @returns {Promise}
     */
    getListData: function (set) {
      return this.signalR.ready.then(function (signalR) {
        return signalR.proxy.invoke(signalR.getListDataName || (camelCase(signalR.name) + "GetListData"), set);
      });
    },
    /**
     * @desc Gets a single instance of data from the Hub
     * @param set
     * @returns {Promise}
     */
    get: function (set) {
      return this.signalR.ready.then(function (signalR) {
        return signalR.proxy.invoke(signalR.getDataName || (camelCase(signalR.name) + "GetData"), set);
      });
    }
  };
});
