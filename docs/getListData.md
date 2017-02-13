@function can-connect-signalr/getListData getListData
@parent can-connect-signalr/data-interface

@signature `getListData(set)`

Invokes the method specified by [can-connect-signalr.signalR].getListName or
[can-connect-signalr.signalR].name+"GetList".

The following shows how [can-can-connect-signalr.signalR] calls getListData and
what it does with the response:

```js
// returns a promise that will be resolved once data is received by the Hub.
// Note: Data returned from the Hub will be received in the proxy listener.
var listData = connection.getListData().then(function(data) {
	// do something
});

```

@param {Set} set.
@return {Promise<Object>} A promise that resolves to the list data.