@function can-connect-signalr/getListData getListData
@parent can-connect-signalr/data-interface

@signature `getData(id)`

Invokes the method specified by [can-connect-signalr.signalR].getName or
[can-connect-signalr.signalR].name+"Get".

The following shows how [can-can-connect-signalr.signalR] calls getData and
what it does with the response:

```js
// returns a promise that will be resolved once data is received by the Hub.
// Note: Data returned from the Hub will be received in the proxy listener.
var listData = connection.getData().then(function(data) {
	// do something
});

```

@param {number} number.
@return {Promise<Object>} A promise that resolves to the data.