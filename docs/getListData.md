@typedef {function} can-connect/connection.getListData getListData
@parent can-connect-signalr/data-interface

@description Requests a set of data from the `SignalR` hub.

@option {function}

Invokes the method specified by [can-connect-signalr.signalR].getListName or
[can-connect-signalr.signalR].name+"GetList".

The following shows how [can-can-connect-signalr.signalR] calls getListData and
what it does with the response:

```js
// returns a promise that will be resolved once data is returned from the Hub.
var listData = connection.getListData().then(function(data) {
	
});

```

  @param {Set} set

    
