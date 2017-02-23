@function can-connect-signalr/createData createData
@parent can-connect-signalr/data-interface

@signature `createData(instanceData)`

Invokes the method specified by [can-connect-signalr.signalR].createName or
[can-connect-signalr.signalR].name+"Create".

## Setup 
If your `SignalR` hub conforms to the required interface (see [can-connect-signalr]), there is nothing you need to 
do to configure this method on the client. If the method name of the `create` end point on your `SignalR` hub deviates from
the standard expected by `can-connect-signalr`, you can override `can-connect-signalr`'s default naming by providing
this property with the name expected by your `SignalR` hub.

```js
    signalR: {
        url: 'http://test.com', // URL of the SignalR server
        name: 'Message' // Name of the SignalR hub,
        createName: 'nameOfMethod'
    }
```

You can call this method directly off of a connection:

```js
connection.createData(instanceData);
```

## CanJS Usage

If your connection is mixed in to a `DefineMap` (see [can-connect-signalr]), `createData` can be called off of the 
`DefineMap` constructor function. Note that `can-connect-signalr` requires the method signatures
defined on your hub to accept only one parameter. You can pass in multiple values by sending the method
an object:

```js
// returns a promise that will be resolved once data is received by the Hub.
// Note: Data returned from the Hub will be received in the proxy listener.
new Message({
		text: 'Hi there!'
	}).save();
```

While `createData` returns a `Promise`, that promise does not contain an instance of the created object. That 
will be made available through the associated RPC listener, `createdData`. This listener takes care of updating
model instances or lists.

@param {Set} set.
@return {Promise<Object>} A promise that resolves to nothing.

    
