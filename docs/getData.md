@function can-connect-signalr/getData getData
@parent can-connect-signalr/data-interface

@signature `getData(id)`

## Setup 
If your `SignalR` hub conforms to the required interface (see [can-connect-signalr]), there is nothing you need to 
do to configure this method on the client. If the method name of the `getData` end point on your `SignalR` hub deviates from
the standard expected by `can-connect-signalr`, you can override `can-connect-signalr`'s default naming by providing
this property with the name expected by your `SignalR` hub.

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

## CanJS Usage

If your connection is mixed in to a `DefineMap` (see [can-connect-signalr]), `getData` can be called off of the 
`DefineMap` constructor function (static). Note that `can-connect-signalr` requires the method signatures
defined on your hub to accept only one parameter. You can pass in multiple values by sending the method
an object:

```js
// Note the method is called `get`. This is not a typo.
MessageConstructor.get()
  .then(function(response){
		
  });
```

@param {Set} set.
@return {Promise<Object>} A promise that resolves to the list data.

@param {number} number.
@return {Promise<Object>} A promise that resolves to the data.