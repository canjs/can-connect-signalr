@function can-connect-signalr/getListData getListData
@parent can-connect-signalr/data-interface

@signature `getListData(set)`


## Setup 
If your `SignalR` hub conforms to the required interface see [can-connect-signalr], there is nothing you need to 
do to configure this method on the client. If the method name of the create end point on your `SignalR` hub deviates from
the standard expected by `can-connect-signalr`, you can override `can-connect-signalr`'s default naming by providing
this property with the name expected by your `SignalR` hub.

```js
    signalR: {
        url: 'http://test.com', // URL of the SignalR server
        name: 'Message' // Name of the SignalR hub,
        getListName: 'nameOfMethod'
    }
```


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